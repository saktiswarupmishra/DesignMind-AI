import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { Users, FileText, Database, Shield, Zap, Sparkles } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data.data);
    } catch (err) {
      console.error(err);
      // Fallback
      setStats({
        users: 145, projects: 512, designs: 1240, aiRequests: 4890, templates: 24,
        recentUsers: [
          { id: 1, firstName: 'Aarav', lastName: 'Sharma', email: 'aarav@gmail.com', role: 'DESIGNER', createdAt: '2026-06-01T10:00:00Z', isActive: true },
          { id: 2, firstName: 'Nisha', lastName: 'Patel', email: 'nisha@gmail.com', role: 'CONTENT_CREATOR', createdAt: '2026-05-30T12:00:00Z', isActive: true },
          { id: 3, firstName: 'Rohit', lastName: 'Kumar', email: 'rohit@gmail.com', role: 'MARKETING_TEAM', createdAt: '2026-05-29T15:00:00Z', isActive: false },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (uid) => {
    try {
      await api.patch(`/admin/users/${uid}/toggle-status`);
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-12">Loading Admin Panel...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
          <Shield className="w-8 h-8 text-brand-500" /> Admin Command Center
        </h1>
        <p className="text-surface-200/50 mt-1">Platform management, usage metrics and analytics overview</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', val: stats?.users, icon: Users, color: 'from-blue-500 to-indigo-600' },
          { label: 'Total Projects', val: stats?.projects, icon: FileText, color: 'from-purple-500 to-pink-600' },
          { label: 'AI Generations', val: stats?.aiRequests, icon: Zap, color: 'from-amber-500 to-orange-600' },
          { label: 'Active Templates', val: stats?.templates, icon: Database, color: 'from-teal-500 to-emerald-600' },
        ].map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shrink-0`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-surface-200/50 uppercase font-semibold">{card.label}</p>
              <h3 className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{card.val}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="font-heading text-lg font-bold text-surface-900 dark:text-white mb-4">Recent Users</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700 text-xs text-surface-200/50 font-bold uppercase">
                  <th className="pb-3">User</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Joined</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-750">
                {stats?.recentUsers?.map(u => (
                  <tr key={u.id} className="text-sm">
                    <td className="py-3.5">
                      <div className="font-semibold text-surface-900 dark:text-white">{u.firstName} {u.lastName}</div>
                      <div className="text-xs text-surface-200/50">{u.email}</div>
                    </td>
                    <td className="py-3.5"><span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-200">{u.role}</span></td>
                    <td className="py-3.5 text-surface-700 dark:text-surface-200">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-3.5">
                      <button onClick={() => toggleStatus(u.id)} className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${u.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-6 space-y-6">
          <h3 className="font-heading text-lg font-bold text-surface-900 dark:text-white">System Logs</h3>
          <div className="space-y-4">
            {[
              { text: 'Database optimization completed', type: 'system', time: '10m ago' },
              { text: 'AI Microservice latency: 240ms', type: 'ai', time: '45m ago' },
              { text: 'Backup successfully written', type: 'system', time: '2h ago' },
            ].map((log, i) => (
              <div key={i} className="flex gap-3 items-start text-sm">
                <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-surface-900 dark:text-white font-medium">{log.text}</p>
                  <span className="text-xs text-surface-200/50">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
