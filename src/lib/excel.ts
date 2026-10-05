import * as XLSX from 'xlsx';
import { InvoiceData } from './parser';

export function generateExcel(invoices: InvoiceData[]): Blob {
  const wb = XLSX.utils.book_new();

  // Summary Sheet
  const summaryHeaders = ['Invoice #', 'Date', 'Due Date', 'Vendor', 'Bill To', 'Subtotal', 'Tax', 'Total', 'Currency'];
  const summaryData = invoices.map(inv => [
    inv.invoice_number || '',
    inv.date || '',
    inv.due_date || '',
    inv.vendor_name || '',
    inv.bill_to || '',
    inv.subtotal || 0,
    inv.tax || 0,
    inv.total || 0,
    inv.currency
  ]);
  const wsSummary = XLSX.utils.aoa_to_sheet([summaryHeaders, ...summaryData]);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Invoice Summary');

  // Line Items Sheet
  const lineItemsHeaders = ['Invoice #', 'Description', 'Quantity', 'Unit Price', 'Amount'];
  const lineItemsData: (string | number)[][] = [];
  invoices.forEach(inv => {
    inv.line_items.forEach(li => {
      lineItemsData.push([
        inv.invoice_number || '',
        li.description,
        li.quantity || '',
        li.unit_price || 0,
        li.amount || 0
      ]);
    });
  });
  const wsLineItems = XLSX.utils.aoa_to_sheet([lineItemsHeaders, ...lineItemsData]);
  XLSX.utils.book_append_sheet(wb, wsLineItems, 'Line Items');

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export function generateCSV(invoices: InvoiceData[]): string {
  const summaryHeaders = ['Invoice #', 'Date', 'Due Date', 'Vendor', 'Bill To', 'Subtotal', 'Tax', 'Total', 'Currency'];
  const summaryData = invoices.map(inv => [
    inv.invoice_number || '',
    inv.date || '',
    inv.due_date || '',
    inv.vendor_name || '',
    inv.bill_to || '',
    inv.subtotal || 0,
    inv.tax || 0,
    inv.total || 0,
    inv.currency
  ]);
  const wsSummary = XLSX.utils.aoa_to_sheet([summaryHeaders, ...summaryData]);
  return XLSX.utils.sheet_to_csv(wsSummary);
}

function formatImportDate(value: string | null): string {
  if (!value) return '';
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}

function rowsForInvoice(inv: InvoiceData) {
  return inv.line_items.length > 0
    ? inv.line_items
    : [{ description: 'Invoice total', quantity: 1, unit_price: inv.total, amount: inv.total }];
}

function csvFromRows(headers: string[], rows: (string | number | null)[][]): string {
  return XLSX.utils.sheet_to_csv(XLSX.utils.aoa_to_sheet([headers, ...rows]));
}

export function generateXeroCSV(invoices: InvoiceData[]): string {
  const headers = [
    'ContactName', 'InvoiceNumber', 'InvoiceDate', 'DueDate', 'Currency',
    'LineAmountType', 'Description', 'Quantity', 'UnitAmount', 'AccountCode',
    'TaxType', 'TaxAmount',
  ];
  const rows: (string | number | null)[][] = [];
  invoices.forEach((inv) => rowsForInvoice(inv).forEach((line) => rows.push([
    inv.vendor_name || '', inv.invoice_number || '', formatImportDate(inv.date),
    formatImportDate(inv.due_date), inv.currency, 'Exclusive', line.description,
    line.quantity ?? 1, line.unit_price ?? line.amount ?? 0, '', '', inv.tax ?? '',
  ])));
  return csvFromRows(headers, rows);
}

export function generateQuickBooksCSV(invoices: InvoiceData[]): string {
  const headers = [
    'Bill no.', 'Supplier', 'Bill Date', 'Due Date', 'Account', 'Description',
    'Qty', 'Rate', 'Line Amount', 'Line Tax Code', 'Currency',
  ];
  const rows: (string | number | null)[][] = [];
  invoices.forEach((inv) => rowsForInvoice(inv).forEach((line) => rows.push([
    inv.invoice_number || '', inv.vendor_name || '', inv.date || '', inv.due_date || '',
    'Uncategorized Expense', line.description, line.quantity ?? 1,
    line.unit_price ?? line.amount ?? 0, line.amount ?? 0, 'Tax Exempt', inv.currency,
  ])));
  return csvFromRows(headers, rows);
}

export function generateSageCSV(invoices: InvoiceData[]): string {
  const headers = [
    'Transaction Type', 'Reference', 'Supplier', 'Date', 'Due Date', 'Description',
    'Quantity', 'Unit Price', 'Net Amount', 'Tax Amount', 'Total Amount', 'Currency',
  ];
  const rows: (string | number | null)[][] = [];
  invoices.forEach((inv) => rowsForInvoice(inv).forEach((line) => rows.push([
    'Purchase Invoice', inv.invoice_number || '', inv.vendor_name || '', inv.date || '',
    inv.due_date || '', line.description, line.quantity ?? 1,
    line.unit_price ?? line.amount ?? 0, line.amount ?? inv.subtotal ?? 0,
    inv.tax ?? 0, inv.total ?? 0, inv.currency,
  ])));
  return csvFromRows(headers, rows);
}
