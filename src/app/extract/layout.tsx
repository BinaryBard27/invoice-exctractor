import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Extract PDF invoices to Excel',
  description: 'Upload invoice PDFs and export structured data to Excel or CSV with PullInvoice.',
};

export default function ExtractLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
