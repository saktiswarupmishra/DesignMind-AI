import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { Megaphone, Wand2, Loader2, Copy, Check } from 'lucide-react';

const platforms = [
  { value: 'instagram_post', label: 'Instagram Post', icon: '📸' },
  { value: 'instagram_reel', label: 'Instagram Reel', icon: '🎬' },
  { value: 'facebook_post', label: 'Facebook Post', icon: '👍' },
  { value: 'linkedin_post', label: 'LinkedIn Post', icon: '💼' },
  { value: 'twitter_post', label: 'Twitter/X Post', icon: '🐦' },
  { value: 'pinterest', label: 'Pinterest Pin', icon: '📌' },
];

export default function SocialMediaPage() {
  const [form, setForm] = useState({ prompt: '', platform: 'instagram_post', tone: '', industry: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/ai/generate-design', {
        prompt: `Create a ${form.platform.replace('_', ' ')} about: ${form.prompt}`,
        style: form.tone,
        platform: form.platform,
        industry: form.industry,
      });
      setResult(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-surface-900 dark:text-white">AI Social Media Creator</h1>
        </div>
        <p className="text-surface-200/50">Generate platform-optimized social media content with AI</p>
      </motion.div>

      {/* Platform Selection */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {platforms.map((p) => (
          <button
            key={p.value}
            onClick={() => setForm({ ...form, platform: p.value })}
            className={`glass-card p-4 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
              form.platform === p.value ? 'ring-2 ring-brand-500 bg-brand-50/50 dark:bg-brand-500/10' : ''
            }`}
          >
            <span className="text-2xl block mb-2">{p.icon}</span>
            <span className="text-xs font-semibold text-surface-900 dark:text-white">{p.label}</span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <form onSubmit={handleGenerate} className="glass-card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">What's your post about? *</label>
              <textarea value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} className="input-field min-h-[100px] resize-none" placeholder="e.g., Launching our new summer collection with 30% off all items" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Tone</label>
              <select value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })} className="input-field">
                <option value="">Select tone...</option>
                {['Professional', 'Casual', 'Humorous', 'Inspirational', 'Urgent', 'Educational', 'Storytelling'].map((t) => <option key={t} value={t.toLowerCase()}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Industry</label>
              <input type="text" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="input-field" placeholder="e.g., Fashion, Tech, Food" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wand2 className="w-4 h-4" /> Generate Content</>}
            </button>
          </form>
        </motion.div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {result && !loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-surface-900 dark:text-white">📝 Caption</h3>
                    <button onClick={() => copyText(result.marketingCopy, 'caption')} className="btn-ghost !p-2">
                      {copied === 'caption' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-sm text-surface-700 dark:text-surface-200">{result.marketingCopy}</p>
                </div>

                <div className="glass-card p-5">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-2">🎨 Design Concept</h3>
                  <p className="text-sm text-surface-700 dark:text-surface-200">{result.concept}</p>
                </div>

                <div className="glass-card p-5">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-2">📐 Layout</h3>
                  <p className="text-sm text-surface-700 dark:text-surface-200">{result.layout}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="glass-card p-5">
                    <h3 className="font-semibold text-surface-900 dark:text-white mb-3">🎯 CTA Suggestions</h3>
                    <div className="space-y-2">
                      {result.ctaSuggestions?.map((cta, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-brand-50 dark:bg-brand-500/10">
                          <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold">{i + 1}</span>
                          <span className="text-sm text-surface-900 dark:text-white">{cta}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-5">
                    <h3 className="font-semibold text-surface-900 dark:text-white mb-3">🎨 Colors</h3>
                    <div className="space-y-2">
                      {result.colorPalette?.map((color, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg shadow-inner" style={{ backgroundColor: color.hex }} />
                          <span className="text-xs text-surface-700 dark:text-surface-200">{color.name} — {color.usage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-surface-900 dark:text-white">🖼️ Image Prompt</h3>
                    <button onClick={() => copyText(result.imagePrompt, 'img')} className="btn-ghost !p-2">
                      {copied === 'img' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-sm font-mono text-surface-700 dark:text-surface-200 bg-surface-50 dark:bg-surface-700/50 p-3 rounded-lg">{result.imagePrompt}</p>
                </div>
              </motion.div>
            )}

            {!result && !loading && (
              <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-700/50 flex items-center justify-center mb-4">
                  <Megaphone className="w-10 h-10 text-surface-200/30" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-surface-900 dark:text-white mb-2">Create Social Content</h3>
                <p className="text-sm text-surface-200/50 max-w-xs">Select a platform, describe your post, and let AI generate the perfect content</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
