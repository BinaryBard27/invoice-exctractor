import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://pullinvoice.com';
  return ['/', '/extract', '/about', '/contact', '/waitlist'].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));
}
