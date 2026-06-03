import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toggleDarkMode } from '../../store/uiSlice';
import { logout } from '../../store/authSlice';
import { Sun, Moon, Search, LogOut, User, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import NotificationDropdown from '../notifications/NotificationDropdown';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-700">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-200/50" />
          <input
            type="text"
            placeholder="Search designs, templates, tools..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-4">
          {/* Dark mode toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch(toggleDarkMode())}
            className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-accent-gold" /> : <Moon className="w-5 h-5 text-surface-700" />}
          </motion.button>

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.firstName?.[0] || 'U'}
                </span>
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-surface-900 dark:text-white">
                  {user?.firstName || 'User'} {user?.lastName || ''}
                </p>
                <p className="text-xs text-surface-200/50 capitalize">
                  {user?.role?.toLowerCase().replace('_', ' ') || 'Designer'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-surface-200/50" />
            </button>

            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-surface-800 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 py-2 z-50"
              >
                <button
                  onClick={() => { navigate('/settings'); setDropdownOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-surface-700 dark:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                >
                  <User className="w-4 h-4" /> Profile & Settings
                </button>
                <hr className="my-1 border-surface-200 dark:border-surface-700" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
