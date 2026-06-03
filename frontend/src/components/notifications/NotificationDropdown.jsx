import { useState, useEffect } from 'react';
import { Bell, CheckSquare } from 'lucide-react';
import api from '../../api/axios';

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data.notifications || []);
      setUnread(data.data.unreadCount || 0);
    } catch (err) {
      // Fallback
      setNotifications([
        { id: 1, title: 'Team invite', message: 'You have been invited to join Alpha Team', isRead: false, createdAt: new Date() },
        { id: 2, title: 'System alert', message: 'Your AI limits have reset for this month', isRead: true, createdAt: new Date() }
      ]);
      setUnread(1);
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnread(0);
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-xl text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
        <Bell className="w-5 h-5" />
        {unread > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-surface-800 rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-700 py-2 z-50">
          <div className="px-4 py-2 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
            <span className="font-semibold text-sm text-surface-900 dark:text-white">Notifications</span>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-brand-500 font-semibold hover:underline flex items-center gap-1">
                <CheckSquare className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-64 overflow-y-auto divide-y divide-surface-200 dark:divide-surface-750">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-surface-200/50">No notifications yet</div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className={`px-4 py-3 text-left transition-colors ${!n.isRead ? 'bg-brand-500/5' : ''}`}>
                  <h4 className="font-semibold text-xs text-surface-900 dark:text-white">{n.title}</h4>
                  <p className="text-xs text-surface-700 dark:text-surface-200 mt-0.5">{n.message}</p>
                  <span className="text-[10px] text-surface-200/50 block mt-1">{new Date(n.createdAt).toLocaleTimeString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
