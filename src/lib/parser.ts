export interface LineItem {
  description: string;
  quantity: number | null;
  unit_price: number | null;
  amount: number | null;
}

export interface InvoiceData {
  invoice_number: string | null;
  date: string | null;
  due_date: string | null;
  vendor_name: string | null;
  vendor_address: string | null;
  bill_to: string | null;
  subtotal: number | null;
  tax: number | null;
  total: number | null;
  currency: string;
  line_items: LineItem[];
  confidence: 'high' | 'medium' | 'low';
}

function parseNumber(str: string | undefined): number | null {
  if (!str) return null;
  const cleaned = str.replace(/[^0-9.\-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

function parseDate(str: string | undefined): string | null {
  if (!str) return null;
  
  // Month name format: "Jun 16, 2026" or "Jun 16 2026"
  const monthNameMatch = str.match(
    /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),?\s+(\d{4})$/i
  );
  if (monthNameMatch) {
    const months: Record<string, string> = {
      jan:'01',feb:'02',mar:'03',apr:'04',may:'05',jun:'06',
      jul:'07',aug:'08',sep:'09',oct:'10',nov:'11',dec:'12'
    };
    const m = months[monthNameMatch[1].toLowerCase()];
    const d = monthNameMatch[2].padStart(2, '0');
    const y = monthNameMatch[3];
    return `${y}-${m}-${d}`;  // No Date object, no timezone issue
  }

  // Numeric format: DD/MM/YYYY or MM/DD/YYYY
  const numericMatch = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/);
  if (numericMatch) {
    const y = numericMatch[3].length === 2 
      ? `20${numericMatch[3]}` 
      : numericMatch[3];
    const part1 = numericMatch[1].padStart(2, '0');
    const part2 = numericMatch[2].padStart(2, '0');
    // Assume DD/MM/YYYY for EU, MM/DD/YYYY for US
    // If first part > 12 it must be a day
    return parseInt(part1) > 12
      ? `${y}-${part2}-${part1}`
      : `${y}-${part1}-${part2}`;
  }

  return str; // Return as-is if no pattern matched
}

export function extractInvoiceData(text: string): InvoiceData {
  const data: InvoiceData = {
    invoice_number: null,
    date: null,
    due_date: null,
    vendor_name: null,
    vendor_address: null,
    bill_to: null,
    subtotal: null,
    tax: null,
    total: null,
    currency: 'USD',
    line_items: [],
    confidence: 'low',
  };

  // ── Invoice Number ──────────────────────────────────────────────
  const invMatch =
    text.match(/(?:invoice\s*(?:no|number|num|#|id)[:\s#]*)([\w\-\/]+)/i) ||
    text.match(/(?:^|\s)#\s*(\d+)/m) ||
    text.match(/(?:inv[:\-\s#]*)([\w\-]+)/i) ||
    text.match(/(?:^|\s)(INV[-–]\w+)/m);
  if (invMatch) data.invoice_number = invMatch[1].trim();

  // ── Currency ────────────────────────────────────────────────────
  if (text.includes('£') || text.match(/\bGBP\b/i)) data.currency = 'GBP';
  else if (text.includes('€') || text.match(/\bEUR\b/i)) data.currency = 'EUR';
  else if (text.match(/\bCAD\b/i)) data.currency = 'CAD';
  else if (text.match(/\bAUD\b/i)) data.currency = 'AUD';

  // ── Dates ───────────────────────────────────────────────────────
  // Standard: label first
  const dateMatch =
    text.match(/(?:invoice\s*date|date\s*of\s*invoice)[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i) ||
    text.match(/(?:invoice\s*date|date)[:\s]*(\w+\s+\d{1,2},?\s+\d{4})/i) ||
    text.match(/(?:date)[:\s]+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i);
  if (dateMatch) data.date = parseDate(dateMatch[1].trim());

  const dueMatch =
    text.match(/(?:due\s*date|payment\s*due|pay\s*by|due\s*by)[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i) ||
    text.match(/(?:due\s*date|payment\s*due)[:\s]*(\w+\s+\d{1,2},?\s+\d{4})/i);
  if (dueMatch) data.due_date = parseDate(dueMatch[1].trim());

  // Fallback: value-before-label format (invoice-generator.com, etc.)
  // Extract ALL month-name dates in document order
  if (!data.date || !data.due_date) {
    const allDates = [
      ...text.matchAll(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}\b/g),
    ].map((m) => m[0]);
    if (!data.date && allDates.length > 0) data.date = parseDate(allDates[0]);
    if (!data.due_date && allDates.length > 1) data.due_date = parseDate(allDates[1]);
  }

  // Net 30 fallback
  if (!data.due_date && data.date && text.match(/Net\s*30/i)) {
    const d = new Date(data.date);
    d.setDate(d.getDate() + 30);
    data.due_date = d.toISOString().split('T')[0];
  }

  // ── Totals (standard: label → value) ───────────────────────────
  const totalMatchStd =
    text.match(/(?:total\s*due|amount\s*due|balance\s*due|total\s*amount)[:\s]*[$£€]?\s*([\d,]+\.?\d*)/i) ||
    text.match(/(?:grand\s*total)[:\s]*[$£€]?\s*([\d,]+\.?\d*)/i) ||
    text.match(/(?:^|\s)total[:\s]*[$£€]?\s*([\d,]+\.?\d*)/im);
  if (totalMatchStd) data.total = parseNumber(totalMatchStd[1]);

  const subMatchStd = text.match(/(?:sub\s*total|subtotal)[:\s]*[$£€]?\s*([\d,]+\.?\d*)/i);
  if (subMatchStd) data.subtotal = parseNumber(subMatchStd[1]);

  const taxMatchStd = text.match(/(?:tax|gst|vat|hst)[:\s\(]*[$£€]?\s*([\d,]+\.?\d*)/i);
  if (taxMatchStd) data.tax = parseNumber(taxMatchStd[1]);

  // ── Totals (reversed: value → label, invoice-generator.com) ────
  if (!data.total) {
    // Balance Due reversed: $X.XX \n ... \n Balance Due:
    const reversedBalance = text.match(/(\$[\d,]+\.?\d*)\n(?:[^\n]*\n){0,6}Balance\s*Due:/i);
    if (reversedBalance) data.total = parseNumber(reversedBalance[1].replace('$', ''));
  }

  if (!data.subtotal || !data.tax || !data.total) {
    // Block: $subtotal \n $tax \n $total \n Subtotal:
    const reversedBlock = text.match(
      /(\$[\d,]+\.?\d*)\n(\$[\d,]+\.?\d*)\n(\$[\d,]+\.?\d*)\n[^\n]*Subtotal/i
    );
    if (reversedBlock) {
      if (!data.subtotal) data.subtotal = parseNumber(reversedBlock[1].replace('$', ''));
      if (!data.tax) data.tax = parseNumber(reversedBlock[2].replace('$', ''));
      if (!data.total) data.total = parseNumber(reversedBlock[3].replace('$', ''));
    }
  }

  // ── Vendor Name ─────────────────────────────────────────────────
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  const vendorMatch = text.match(/(?:from|bill\s*from|vendor)[:\s]*\n?([\w\s,\.]+)/i);
  if (vendorMatch && !vendorMatch[1].toLowerCase().includes('invoice')) {
    data.vendor_name = vendorMatch[1].trim();
  } else {
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const l = lines[i].toLowerCase();
      if (!l.includes('invoice') && !l.includes('date') && /[a-z]/i.test(l)) {
        data.vendor_name = lines[i];
        break;
      }
    }
  }

  // ── Bill To (first line only) ───────────────────────────────────
  const billToMatch = text.match(
    /(?:bill\s*to|invoice\s*to|sold\s*to|client|customer)[:\s]*\n?\s*([^\n]+)/i
  );
  if (billToMatch) {
    const candidate = billToMatch[1].trim();
    // Reject if it looks like a date or number
    if (candidate && !/^\d/.test(candidate) && !/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(candidate)) {
      data.bill_to = candidate;
    }
  }

  // ── Line Items ──────────────────────────────────────────────────
  let headerIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].toLowerCase();
    if (
      (l.includes('description') || l.includes('item') || l.includes('service')) &&
      (l.includes('qty') || l.includes('quantity')) &&
      (l.includes('price') || l.includes('rate')) &&
      (l.includes('amount') || l.includes('total'))
    ) {
      headerIdx = i;
      break;
    }
  }

  if (headerIdx !== -1) {
    let endIdx = lines.length;
    for (let i = headerIdx + 1; i < lines.length; i++) {
      const l = lines[i].toLowerCase();
      if (l === 'subtotal:' || l === 'subtotal' || l.startsWith('subtotal') || l.startsWith('total:')) {
        endIdx = i;
        break;
      }
    }

    for (let i = headerIdx + 1; i < endIdx; i++) {
      const line = lines[i];
      // Skip lines that are only a currency amount (subtotal/tax/total values in reversed format)
      if (/^[$£€][\d,]+\.?\d*$/.test(line)) continue;

      const numbersMatch = line.match(/(?:\s+[$£€]?\s*[\d,]+\.?\d*)+$/);
      if (numbersMatch) {
        const numbersStr = numbersMatch[0];
        const nums = Array.from(numbersStr.matchAll(/[\d,]+\.?\d*/g)).map((m) =>
          parseNumber(m[0])
        );
        if (nums.length >= 2) {
          const description = line.substring(0, line.length - numbersStr.length).trim();
          if (description) {
            data.line_items.push({
              description,
              quantity: nums.length >= 3 ? nums[nums.length - 3] : null,
              unit_price: nums[nums.length - 2],
              amount: nums[nums.length - 1],
            });
          }
        }
      }
    }
  }

  // ── Confidence ──────────────────────────────────────────────────
  if (data.invoice_number && data.date && data.total !== null) data.confidence = 'high';
  else if (data.total !== null) data.confidence = 'medium';
  else data.confidence = 'low';

  return data;
}
