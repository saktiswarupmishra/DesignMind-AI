import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toggleDarkMode } from '../../store/uiSlice';
import api from '../../api/axios';
import { Settings, User, Moon, Sun, Shield, Bell, Save, Check, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.ui);
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: '',
    company: '',
    website: '',
    phone: '',
    location: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-2xl font-bold text-surface-900 dark:text-white">Settings</h1>
        <p className="text-surface-200/50 mt-1">Manage your account and preferences</p>
      </motion.div>

      {/* Profile */}
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={handleSave} className="glass-card p-6 space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-surface-200 dark:border-surface-700">
          <div className="w-16 h-16 rounded-2xl bg-hero-gradient flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{user?.firstName?.[0] || 'U'}</span>
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold text-surface-900 dark:text-white">{user?.firstName} {user?.lastName}</h2>
            <p className="text-sm text-surface-200/50">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-500 text-xs font-medium capitalize">{user?.role?.toLowerCase().replace('_', ' ')}</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-4 h-4" /> Profile Information
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">First Name</label>
              <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Last Name</label>
              <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input-field min-h-[80px] resize-none" placeholder="Tell us about yourself..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Company</label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input-field" placeholder="Company name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Website</label>
              <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="input-field" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="+1 234 567 8900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Location</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" placeholder="City, Country" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </motion.form>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <h3 className="font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
          {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />} Appearance
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-surface-900 dark:text-white">Dark Mode</p>
            <p className="text-xs text-surface-200/50">Switch between light and dark themes</p>
          </div>
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className={`w-14 h-7 rounded-full transition-colors duration-300 flex items-center px-1 ${darkMode ? 'bg-brand-500' : 'bg-surface-200'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${darkMode ? 'translate-x-7' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <h3 className="font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4" /> Security
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50">
            <div>
              <p className="text-sm font-medium text-surface-900 dark:text-white">Change Password</p>
              <p className="text-xs text-surface-200/50">Update your account password</p>
            </div>
            <button className="btn-ghost text-sm">Update</button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50">
            <div>
              <p className="text-sm font-medium text-surface-900 dark:text-white">Two-Factor Authentication</p>
              <p className="text-xs text-surface-200/50">Add extra security to your account</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 font-medium">Coming Soon</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
