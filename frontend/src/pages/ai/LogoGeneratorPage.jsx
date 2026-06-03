import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { Crown, Wand2, Loader2, Copy, Check, Lightbulb } from 'lucide-react';

export default function LogoGeneratorPage() {
  const [form, setForm] = useState({ brandName: '', industry: '', style: '', description: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/ai/generate-logo', form);
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-gold to-orange-500 flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-surface-900 dark:text-white">AI Logo Generator</h1>
        </div>
        <p className="text-surface-200/50">Generate professional logo concepts with AI-powered creativity</p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <form onSubmit={handleGenerate} className="glass-card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Brand Name *</label>
              <input type="text" value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })} className="input-field" placeholder="e.g., DesignMind" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Industry</label>
              <input type="text" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="input-field" placeholder="e.g., Technology, Food, Fashion" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Logo Style</label>
              <select value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} className="input-field">
                <option value="">Select style...</option>
                {['Minimalist', 'Modern', 'Vintage', 'Geometric', 'Abstract', 'Wordmark', 'Mascot', 'Emblem'].map((s) => (
                  <option key={s} value={s.toLowerCase()}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[80px] resize-none" placeholder="Any specific ideas or requirements..." />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wand2 className="w-4 h-4" /> Generate Logos</>}
            </button>
          </form>
        </motion.div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {result && !loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Recommended Style */}
                <div className="glass-card p-5">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-accent-gold" /> Recommended Style
                  </h3>
                  <p className="text-sm text-surface-700 dark:text-surface-200">{result.recommendedStyle}</p>
                  {result.colorSuggestions && (
                    <div className="flex gap-2 mt-3">
                      {result.colorSuggestions.map((hex, i) => (
                        <div key={i} className="w-8 h-8 rounded-lg shadow-md cursor-pointer hover:scale-110 transition-transform" style={{ backgroundColor: hex }} title={hex} onClick={() => copyText(hex, `clr-${i}`)} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Logo Concepts */}
                {result.concepts?.map((concept, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-gold/20 to-orange-500/20 flex items-center justify-center">
                          <span className="font-heading text-lg font-bold text-accent-gold">{i + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-surface-900 dark:text-white">{concept.name}</h3>
                          <span className="text-xs text-brand-500 font-medium">{concept.style}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-surface-700 dark:text-surface-200 mb-4">{concept.description}</p>

                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-surface-200/50">SVG Prompt</span>
                          <button onClick={() => copyText(concept.svgPrompt, `svg-${i}`)} className="btn-ghost !p-1">
                            {copied === `svg-${i}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <p className="text-xs text-surface-700 dark:text-surface-200 font-mono">{concept.svgPrompt}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-surface-200/50">AI Image Prompt</span>
                          <button onClick={() => copyText(concept.aiImagePrompt, `ai-${i}`)} className="btn-ghost !p-1">
                            {copied === `ai-${i}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <p className="text-xs text-surface-700 dark:text-surface-200 font-mono">{concept.aiImagePrompt}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {!result && !loading && (
              <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-700/50 flex items-center justify-center mb-4">
                  <Crown className="w-10 h-10 text-surface-200/30" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-surface-900 dark:text-white mb-2">Create Your Logo</h3>
                <p className="text-sm text-surface-200/50 max-w-xs">Enter your brand details and AI will generate multiple professional logo concepts</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
