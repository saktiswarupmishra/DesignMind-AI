import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { History, Eye, Wand2, Shield } from 'lucide-react';

export default function ActivityLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/activity')
      .then(res => setLogs(res.data.data.logs || []))
      .catch(() => setLogs([
        { id: 1, action: 'AI_GENERATION', entity: 'LOGO', details: { name: 'Brand logo generated' }, createdAt: '2026-06-03T09:00:00Z' },
        { id: 2, action: 'PROJECT_CREATE', entity: 'PROJECT', details: { name: 'Alpha app mockups' }, createdAt: '2026-06-02T14:20:00Z' },
        { id: 3, action: 'AUTH_LOGIN', entity: 'USER', details: { ip: '127.0.0.1' }, createdAt: '2026-06-02T10:00:00Z' },
      ]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center p-12">Loading activity trail...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
          <History className="w-8 h-8 text-brand-500" /> Security & Activity Logs
        </h1>
        <p className="text-surface-200/50 mt-1">Audit log of design generations, logins, and settings modifications</p>
      </div>

      <div className="glass-card p-6 space-y-6">
        <div className="space-y-4">
          {logs.map((l, i) => (
            <div key={i} className="flex gap-4 items-start p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/10 transition-colors">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${l.action.includes('AI') ? 'bg-amber-500/10 text-amber-500' : l.action.includes('AUTH') ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                {l.action.includes('AI') ? <Wand2 className="w-4.5 h-4.5" /> : l.action.includes('AUTH') ? <Shield className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-semibold text-sm text-surface-900 dark:text-white">{l.action.replace('_', ' ')}</h4>
                  <span className="text-xs text-surface-200/50">{new Date(l.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-xs text-surface-200/50 mt-0.5">{JSON.stringify(l.details)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
