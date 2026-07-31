'use client';

import { useState } from 'react';
import { InvoiceData } from '@/lib/parser';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface ResultsTableProps {
  results: InvoiceData[];
}

export default function ResultsTable({ results }: ResultsTableProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'line-items'>('summary');

  const ConfidenceDot = ({ level }: { level: 'high' | 'medium' | 'low' }) => {
    if (level === 'high') return <CheckCircle2 className="w-4 h-4 text-green-600 inline" />;
    if (level === 'medium') return <AlertTriangle className="w-4 h-4 text-yellow-600 inline" />;
    return <XCircle className="w-4 h-4 text-red-600 inline" />;
  };

  return (
    <div className="w-full mt-10">
      <div className="flex space-x-1 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
            activeTab === 'summary' ? 'bg-white border border-b-0 border-slate-200 text-primary' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Invoice Summary
        </button>
        <button
          onClick={() => setActiveTab('line-items')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
            activeTab === 'line-items' ? 'bg-white border border-b-0 border-slate-200 text-primary' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Line Items
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === 'summary' ? (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 text-slate-700 text-sm border-b border-slate-200">
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Invoice #</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Date</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Due Date</th>
                  <th className="px-4 py-3 font-semibold">Vendor</th>
                  <th className="px-4 py-3 font-semibold">Bill To</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Subtotal</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Tax</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Total</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Curr</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {results.map((res, i) => (
                  <tr key={i} className="hover:bg-slate-50 text-sm text-slate-700 transition-colors">
                    <td className="px-4 py-3 text-center"><ConfidenceDot level={res.confidence} /></td>
                    <td className="px-4 py-3 font-medium text-slate-900">{res.invoice_number || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{res.date || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{res.due_date || '-'}</td>
                    <td className="px-4 py-3 truncate max-w-[200px]" title={res.vendor_name || ''}>{res.vendor_name || '-'}</td>
                    <td className="px-4 py-3 truncate max-w-[200px]" title={res.bill_to || ''}>{res.bill_to || '-'}</td>
                    <td className="px-4 py-3">{res.subtotal != null ? res.subtotal.toFixed(2) : '-'}</td>
                    <td className="px-4 py-3">{res.tax != null ? res.tax.toFixed(2) : '-'}</td>
                    <td className="px-4 py-3 font-medium">{res.total != null ? res.total.toFixed(2) : '-'}</td>
                    <td className="px-4 py-3">{res.currency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 text-slate-700 text-sm border-b border-slate-200">
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Invoice #</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Quantity</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Unit Price</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {results.flatMap((res, resIdx) => 
                  (res.line_items || []).length > 0 ? (
                    (res.line_items || []).map((li, liIdx) => (
                      <tr key={`${resIdx}-${liIdx}`} className="hover:bg-slate-50 text-sm text-slate-700 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900">{res.invoice_number || '-'}</td>
                        <td className="px-4 py-3">{li.description}</td>
                        <td className="px-4 py-3">{li.quantity != null ? li.quantity : '-'}</td>
                        <td className="px-4 py-3">{li.unit_price != null ? li.unit_price.toFixed(2) : '-'}</td>
                        <td className="px-4 py-3 font-medium">{li.amount != null ? li.amount.toFixed(2) : '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr key={`${resIdx}-empty`} className="hover:bg-slate-50 text-sm text-slate-500 italic text-center">
                      <td className="px-4 py-3 text-slate-400" colSpan={5}>No line items extracted for invoice {res.invoice_number || `#${resIdx + 1}`}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
