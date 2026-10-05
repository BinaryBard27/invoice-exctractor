interface ToolFaqSchemaProps {
  name: string;
}

export default function ToolFaqSchema({ name }: ToolFaqSchemaProps) {
  const questions = [
    { q: 'Is this invoice conversion tool free?', a: 'You can try Pull Invoice with a limited number of free invoice extractions. A one-time paid plan is available for unlimited processing.' },
    { q: 'What invoice formats can I upload?', a: 'Upload text-based PDF invoices. The parser extracts common invoice fields such as vendor, invoice date, due date, totals, and line items.' },
    { q: 'What file will I download?', a: `The ${name} tool downloads an XLSX workbook or a CSV formatted for the selected accounting workflow.` },
    { q: 'Is my invoice data stored?', a: 'Files are processed to return your extraction and are not used to build a permanent document library. Avoid uploading documents you are not authorized to process.' },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: questions.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }) }} />;
}
