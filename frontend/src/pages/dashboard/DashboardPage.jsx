import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import {
  LayoutDashboard, FolderOpen, Image, Zap, Sparkles, Palette,
  Crown, ArrowRight, TrendingUp, Clock
} from 'lucide-react';

const quickActions = [
  { to: '/ai/design-generator', icon: Sparkles, label: 'AI Design', color: 'from-brand-500 to-brand-700' },
  { to: '/ai/color-palette', icon: Palette, label: 'Color Palette', color: 'from-accent-teal to-emerald-600' },
  { to: '/ai/logo-generator', icon: Crown, label: 'Logo Generator', color: 'from-accent-gold to-orange-500' },
  { to: '/ai/brand-identity', icon: Image, label: 'Brand Identity', color: 'from-accent-pink to-rose-600' },
];

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/projects/dashboard');
        setStats(data.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { icon: FolderOpen, label: 'Projects', value: stats?.stats?.projects || 0, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-500/10' },
    { icon: Image, label: 'Designs', value: stats?.stats?.designs || 0, color: 'text-accent-teal', bg: 'bg-teal-50 dark:bg-accent-teal/10' },
    { icon: Zap, label: 'AI Requests', value: stats?.stats?.aiRequests || 0, color: 'text-accent-gold', bg: 'bg-amber-50 dark:bg-accent-gold/10' },
    { icon: TrendingUp, label: 'AI Credits', value: stats?.stats?.aiCredits || 0, color: 'text-accent-pink', bg: 'bg-pink-50 dark:bg-accent-pink/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl font-bold text-surface-900 dark:text-white">
          Welcome back, {user?.firstName || 'Creator'} 👋
        </h1>
        <p className="text-surface-200/50 mt-1">Here's what's happening in your creative studio</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <span className="text-xs font-medium text-surface-200/50 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +12%
              </span>
            </div>
            <p className="font-heading text-3xl font-bold text-surface-900 dark:text-white">{card.value}</p>
            <p className="text-sm text-surface-200/50 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-heading text-lg font-semibold text-surface-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Link
                to={action.to}
                className="glass-card p-5 flex flex-col items-center gap-3 group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-semibold text-surface-900 dark:text-white">{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-surface-900 dark:text-white">Recent Designs</h3>
            <Link to="/projects" className="text-sm text-brand-500 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {stats?.recentDesigns?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentDesigns.map((design) => (
                <div key={design.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
                    <Image className="w-5 h-5 text-brand-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{design.title}</p>
                    <p className="text-xs text-surface-200/50">{design.type?.replace('_', ' ')}</p>
                  </div>
                  <span className="text-xs text-surface-200/50">{new Date(design.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-surface-200/50">
              <Image className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No designs yet. Start creating!</p>
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-surface-900 dark:text-white">AI Activity</h3>
            <span className="text-xs px-2 py-1 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-500 font-medium">
              Plan: {stats?.stats?.plan || 'FREE'}
            </span>
          </div>
          {stats?.recentRequests?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentRequests.map((req) => (
                <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-accent-teal/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-accent-teal" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{req.type?.replace('_', ' ')}</p>
                    <p className="text-xs text-surface-200/50 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {req.processingMs ? `${req.processingMs}ms` : 'N/A'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                    req.status === 'COMPLETED' ? 'bg-green-50 dark:bg-green-500/10 text-green-600' :
                    req.status === 'FAILED' ? 'bg-red-50 dark:bg-red-500/10 text-red-500' :
                    'bg-amber-50 dark:bg-amber-500/10 text-amber-600'
                  }`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-surface-200/50">
              <Zap className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No AI requests yet. Try an AI tool!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
