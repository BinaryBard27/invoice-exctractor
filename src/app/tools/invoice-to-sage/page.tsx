import type { Metadata } from 'next';
import InvoiceToolPage from '@/components/InvoiceToolPage';
import ToolFaqSchema from '@/components/ToolFaqSchema';

export const metadata: Metadata = { title: 'Invoice to Sage CSV Converter | PullInvoice', description: 'Extract invoice PDFs and prepare purchase invoice rows for Sage import.' };

export default function Page() { return <><InvoiceToolPage kind="sage" title="Invoice to Sage" answer="Pull Invoice extracts purchase invoice details from PDFs and prepares a Sage-friendly CSV with supplier, reference, dates, currency, descriptions, quantities, net amounts, tax, and totals. Download the line-based file, compare it with your Sage template, and complete any account or tax mapping required by your Sage region." exportLabel="Sage CSV" fileExtension=".csv" lastUpdated="September 23, 2026" /><ToolFaqSchema name="Invoice to Sage" /></>; }
