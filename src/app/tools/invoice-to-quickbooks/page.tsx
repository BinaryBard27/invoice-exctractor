import type { Metadata } from 'next';
import InvoiceToolPage from '@/components/InvoiceToolPage';
import ToolFaqSchema from '@/components/ToolFaqSchema';

export const metadata: Metadata = { title: 'Invoice to QuickBooks CSV Converter | PullInvoice', description: 'Extract invoice PDFs and prepare bill rows for QuickBooks CSV import.' };

export default function Page() { return <><InvoiceToolPage kind="quickbooks" title="Invoice to QuickBooks" answer="Pull Invoice reads invoice PDFs and turns the extracted supplier, bill number, dates, currency, descriptions, quantities, rates, and line amounts into a QuickBooks-ready CSV. Each invoice line is kept as its own row so you can map accounts and tax codes during the QuickBooks import review." exportLabel="QuickBooks CSV" fileExtension=".csv" lastUpdated="September 23, 2026" /><ToolFaqSchema name="Invoice to QuickBooks" /></>; }
