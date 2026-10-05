import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://pullinvoice.com';
  return ['/', '/extract', '/tools', '/tools/invoice-pdf-to-excel', '/tools/invoice-to-xero', '/tools/invoice-to-quickbooks', '/tools/invoice-to-sage', '/about', '/contact', '/waitlist'].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));
}
