import type { Metadata } from 'next';
import InvoiceToolPage from '@/components/InvoiceToolPage';
import ToolFaqSchema from '@/components/ToolFaqSchema';

export const metadata: Metadata = { title: 'Invoice to Xero CSV Converter | PullInvoice', description: 'Extract invoice PDFs and format line items for Xero bill import.' };

export default function Page() { return <><InvoiceToolPage kind="xero" title="Invoice to Xero" answer="Pull Invoice extracts supplier details, invoice dates, due dates, currencies, totals, and line items from PDF invoices, then formats each line for Xero’s bill CSV import workflow. Download the result, review contact names and account mappings in Xero, and import the prepared CSV as a draft bill." exportLabel="Xero CSV" fileExtension=".csv" lastUpdated="September 23, 2026" /><ToolFaqSchema name="Invoice to Xero" /></>; }
