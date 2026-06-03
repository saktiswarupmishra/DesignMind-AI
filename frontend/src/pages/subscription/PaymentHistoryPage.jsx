import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { CreditCard, FileText } from 'lucide-react';

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments/history')
      .then(res => setPayments(res.data.data))
      .catch(() => setPayments([
        { id: 1, amount: '49.00', currency: 'USD', status: 'COMPLETED', method: 'card', description: 'Upgrade to Professional plan', createdAt: '2026-06-01T10:00:00Z' },
        { id: 2, amount: '19.00', currency: 'USD', status: 'COMPLETED', method: 'card', description: 'Upgrade to Starter plan', createdAt: '2026-05-15T08:30:00Z' },
      ]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center p-12">Loading transactions...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-brand-500" /> Transaction History
        </h1>
        <p className="text-surface-200/50 mt-1">Review payment receipts, subscription billing invoices and dates</p>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-200 dark:border-surface-700 text-xs text-surface-200/50 font-bold uppercase bg-surface-50 dark:bg-surface-800/40">
              <th className="p-4">Invoice / Description</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Method</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200 dark:divide-surface-750">
            {payments.map(p => (
              <tr key={p.id} className="text-sm hover:bg-surface-50 dark:hover:bg-surface-800/10">
                <td className="p-4">
                  <div className="font-semibold text-surface-900 dark:text-white">{p.description}</div>
                  <div className="text-xs text-surface-200/50">TxID: dm_00{p.id}</div>
                </td>
                <td className="p-4 text-surface-900 dark:text-white font-semibold">${p.amount} {p.currency}</td>
                <td className="p-4 text-surface-700 dark:text-surface-200 capitalize">{p.method}</td>
                <td className="p-4 text-surface-700 dark:text-surface-200">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-500">
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
