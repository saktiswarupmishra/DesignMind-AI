import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleSidebar } from '../../store/uiSlice';
import {
  LayoutDashboard, Palette, Type, Crown, Image, Sparkles, PenTool,
  Megaphone, FileText, Users, Settings, ChevronLeft, Zap, Layers,
  FileImage, Target, Eye, Maximize2, LineChart, CreditCard, History, Shield, Menu
} from 'lucide-react';

export default function Sidebar() {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  const sections = [
    {
      title: 'Main',
      items: [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/projects', icon: PenTool, label: 'Projects' },
        { to: '/templates', icon: Zap, label: 'Templates' },
      ]
    },
    {
      title: 'AI Generators',
      items: [
        { to: '/ai/design-generator', icon: Sparkles, label: 'Design' },
        { to: '/ai/color-palette', icon: Palette, label: 'Color Palette' },
        { to: '/ai/logo-generator', icon: Crown, label: 'Logo' },
        { to: '/ai/brand-identity', icon: Layers, label: 'Brand Identity' },
        { to: '/ai/social-media', icon: Megaphone, label: 'Social Media' },
        { to: '/ai/thumbnail', icon: Image, label: 'Thumbnail' },
        { to: '/ai/copywriter', icon: FileText, label: 'Copywriter' },
        { to: '/ai/poster', icon: FileImage, label: 'Poster' },
        { to: '/ai/banner', icon: Sparkles, label: 'Banner' },
        { to: '/ai/ad-creative', icon: Target, label: 'Ad Creative' },
      ]
    },
    {
      title: 'AI Analytics',
      items: [
        { to: '/ai/analyzer', icon: Eye, label: 'Design Critic' },
        { to: '/ai/bg-remover', icon: Image, label: 'BG Remover' },
        { to: '/ai/mockup', icon: LayoutDashboard, label: 'Mockup Gen' },
        { to: '/ai/resizer', icon: Maximize2, label: 'Smart Resize' },
        { to: '/ai/trends', icon: LineChart, label: 'Trend Report' },
      ]
    },
    {
      title: 'Management',
      items: [
        { to: '/team', icon: Users, label: 'Team' },
        { to: '/subscription', icon: CreditCard, label: 'Subscription' },
        { to: '/payments', icon: History, label: 'Billing' },
        { to: '/activity', icon: History, label: 'Logs' },
        { to: '/settings', icon: Settings, label: 'Settings' },
      ]
    }
  ];

  // Admin Section
  if (user?.role === 'ADMIN') {
    sections.push({
      title: 'Admin',
      items: [
        { to: '/admin', icon: Shield, label: 'Command Center' },
        { to: '/admin/users', icon: Users, label: 'Users' },
        { to: '/admin/analytics', icon: LineChart, label: 'Analytics' },
      ]
    });
  }

  return (
    <AnimatePresence>
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-screen bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 z-40 flex flex-col overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-surface-200 dark:border-surface-700">
          <div className="w-10 h-10 rounded-xl bg-hero-gradient flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="font-heading font-bold text-lg text-surface-900 dark:text-white">DesignMind</h1>
              <p className="text-xs text-surface-200/70 dark:text-surface-200/50">AI Creative Studio</p>
            </motion.div>
          )}
        </div>

        {/* Nav Items grouped by sections */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
          {sections.map((sect, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {sidebarOpen && (
                <span className="text-[10px] uppercase font-bold text-surface-200/50 px-3 tracking-wider block mb-1">
                  {sect.title}
                </span>
              )}
              {sect.items.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''} ${!sidebarOpen ? 'justify-center px-0' : ''}`
                  }
                  title={label}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">{label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Toggle Button */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="flex items-center justify-center p-4 border-t border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
        >
          <ChevronLeft className={`w-5 h-5 text-surface-200/70 transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </motion.aside>
    </AnimatePresence>
  );
}
