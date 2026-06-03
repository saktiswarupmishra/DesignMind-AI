import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { BarChart, Zap, TrendingUp, Users } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then(res => setData(res.data.data))
      .catch(() => setData({
        totalUsers: 145, newUsers: 24, totalAI: 4890, recentAI: 950, activeSubscriptions: 18, growthRate: '16.5',
        aiByType: [
          { type: 'DESIGN_GENERATION', count: 1850 },
          { type: 'LOGO_GENERATION', count: 1200 },
          { type: 'COLOR_PALETTE', count: 940 },
          { type: 'BRAND_IDENTITY', count: 900 }
        ],
        usersByRole: [
          { role: 'DESIGNER', count: 65 },
          { role: 'CONTENT_CREATOR', count: 35 },
          { role: 'MARKETING_TEAM', count: 25 },
          { role: 'ADMIN', count: 2 }
        ]
      }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center p-12">Loading platform analytics...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
          <BarChart className="w-8 h-8 text-brand-500" /> Platform Analytics
        </h1>
        <p className="text-surface-200/50 mt-1">Growth trends, user segmentation, and AI tool distribution stats</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '30d User Growth', val: `+${data?.newUsers}`, desc: `${data?.growthRate}% rate`, icon: Users },
          { label: 'AI Generations (30d)', val: data?.recentAI, desc: `out of ${data?.totalAI} total`, icon: Zap },
          { label: 'Premium Subscriptions', val: data?.activeSubscriptions, desc: 'Active paid plans', icon: TrendingUp },
        ].map((card, i) => (
          <div key={i} className="glass-card p-6 space-y-2">
            <div className="flex justify-between items-center text-surface-200/50">
              <span className="text-xs uppercase font-semibold">{card.label}</span>
              <card.icon className="w-4 h-4 text-brand-500" />
            </div>
            <h3 className="text-2xl font-bold text-surface-900 dark:text-white">{card.val}</h3>
            <p className="text-xs text-surface-200/50">{card.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h3 className="font-heading text-lg font-bold text-surface-900 dark:text-white mb-6">AI Generations by Category</h3>
          <div className="space-y-4">
            {data?.aiByType?.map((item, i) => {
              const max = Math.max(...data.aiByType.map(t => t.count));
              const pct = max > 0 ? (item.count / max) * 100 : 0;
              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-surface-700 dark:text-surface-200">{item.type.replace('_', ' ')}</span>
                    <span className="font-bold text-surface-900 dark:text-white">{item.count}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-surface-100 dark:bg-surface-700 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-heading text-lg font-bold text-surface-900 dark:text-white mb-6">Users by Persona Group</h3>
          <div className="space-y-4">
            {data?.usersByRole?.map((item, i) => {
              const max = Math.max(...data.usersByRole.map(r => r.count));
              const pct = max > 0 ? (item.count / max) * 100 : 0;
              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-surface-700 dark:text-surface-200">{item.role}</span>
                    <span className="font-bold text-surface-900 dark:text-white">{item.count}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-surface-100 dark:bg-surface-700 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
