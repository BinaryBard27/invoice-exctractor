import type { Metadata } from 'next';
import InvoiceToolPage from '@/components/InvoiceToolPage';
import ToolFaqSchema from '@/components/ToolFaqSchema';

export const metadata: Metadata = { title: 'Invoice PDF to Excel | PullInvoice', description: 'Extract invoice vendors, dates, totals, and line items from PDF into Excel.' };

export default function Page() { return <><InvoiceToolPage kind="excel" title="Invoice PDF to Excel" answer="Pull Invoice turns uploaded invoice PDFs into a downloadable Excel workbook. It extracts the vendor, invoice date, due date, totals, currency, and line items using the existing PDF parsing pipeline, then separates invoice summaries and line-item detail into clean worksheets for review, reconciliation, or further spreadsheet work." exportLabel="Excel workbook" fileExtension=".xlsx" lastUpdated="September 23, 2026" /><ToolFaqSchema name="Invoice PDF to Excel" /></>; }
