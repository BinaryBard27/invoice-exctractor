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
