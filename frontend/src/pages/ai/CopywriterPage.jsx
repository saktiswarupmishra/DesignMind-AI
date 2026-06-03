import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { FileText, Wand2, Loader2, Copy, Check } from 'lucide-react';

const copyTypes = [
  { value: 'marketing', label: '📢 Marketing Copy' },
  { value: 'product', label: '🛍️ Product Description' },
  { value: 'sales', label: '💰 Sales Copy' },
  { value: 'landing', label: '🌐 Landing Page' },
  { value: 'email', label: '📧 Email Campaign' },
  { value: 'social', label: '📱 Social Media' },
  { value: 'blog', label: '📝 Blog Post' },
  { value: 'ad', label: '🎯 Ad Copy' },
];

export default function CopywriterPage() {
  const [form, setForm] = useState({ prompt: '', type: 'marketing', tone: '', audience: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/ai/generate-design', {
        prompt: `Write ${form.type} copy: ${form.prompt}. Tone: ${form.tone || 'professional'}. Audience: ${form.audience || 'general'}`,
        style: form.tone,
        platform: form.type,
        industry: form.audience,
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-surface-900 dark:text-white">AI Copywriter</h1>
        </div>
        <p className="text-surface-200/50">Generate compelling marketing copy, product descriptions, and more</p>
      </motion.div>

      {/* Copy Type Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {copyTypes.map((t) => (
          <button
            key={t.value}
            onClick={() => setForm({ ...form, type: t.value })}
            className={`glass-card p-4 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
              form.type === t.value ? 'ring-2 ring-brand-500 bg-brand-50/50 dark:bg-brand-500/10' : ''
            }`}
          >
            <span className="text-sm font-semibold text-surface-900 dark:text-white">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <form onSubmit={handleGenerate} className="glass-card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">What do you need copy for? *</label>
              <textarea value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} className="input-field min-h-[120px] resize-none" placeholder="e.g., A premium coffee subscription service that delivers freshly roasted beans from around the world" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Tone</label>
              <select value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })} className="input-field">
                <option value="">Professional</option>
                {['Conversational', 'Persuasive', 'Witty', 'Formal', 'Inspirational', 'Urgent', 'Friendly'].map((t) => <option key={t} value={t.toLowerCase()}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Target Audience</label>
              <input type="text" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} className="input-field" placeholder="e.g., Young professionals, Business owners" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wand2 className="w-4 h-4" /> Generate Copy</>}
            </button>
          </form>
        </motion.div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {result && !loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-surface-900 dark:text-white">✍️ Main Copy</h3>
                    <button onClick={() => copyText(result.marketingCopy, 'main')} className="btn-ghost !p-2">
                      {copied === 'main' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-sm text-surface-700 dark:text-surface-200 whitespace-pre-wrap leading-relaxed">{result.marketingCopy}</p>
                </div>

                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-surface-900 dark:text-white">💡 Creative Direction</h3>
                    <button onClick={() => copyText(result.concept, 'concept')} className="btn-ghost !p-2">
                      {copied === 'concept' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-sm text-surface-700 dark:text-surface-200">{result.concept}</p>
                </div>

                <div className="glass-card p-5">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-3">🎯 Headlines / CTAs</h3>
                  <div className="space-y-2">
                    {result.ctaSuggestions?.map((cta, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-50 dark:bg-surface-700/50">
                        <span className="text-sm font-semibold text-surface-900 dark:text-white">{cta}</span>
                        <button onClick={() => copyText(cta, `cta-${i}`)} className="btn-ghost !p-1">
                          {copied === `cta-${i}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {result.brandConsistency && (
                  <div className="glass-card p-5">
                    <h3 className="font-semibold text-surface-900 dark:text-white mb-3">📋 Writing Guidelines</h3>
                    <ul className="space-y-2">
                      {result.brandConsistency.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-200">
                          <span className="text-brand-500 mt-0.5">•</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {!result && !loading && (
              <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-700/50 flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-surface-200/30" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-surface-900 dark:text-white mb-2">Write with AI</h3>
                <p className="text-sm text-surface-200/50 max-w-xs">Select a copy type, describe your needs, and let AI craft compelling content</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
