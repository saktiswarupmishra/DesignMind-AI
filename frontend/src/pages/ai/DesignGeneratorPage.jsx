import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { Sparkles, Send, Loader2, Copy, Check, Wand2 } from 'lucide-react';

export default function DesignGeneratorPage() {
  const [form, setForm] = useState({ prompt: '', style: '', platform: '', industry: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post('/ai/generate-design', form);
      setResult(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-surface-900 dark:text-white">AI Design Generator</h1>
        </div>
        <p className="text-surface-200/50">Describe your design and let AI create a complete concept</p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Input */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <form onSubmit={handleGenerate} className="glass-card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Design Prompt *</label>
              <textarea
                value={form.prompt}
                onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                className="input-field min-h-[120px] resize-none"
                placeholder="e.g., Create a luxury coffee shop Instagram advertisement with warm tones and elegant typography"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Style</label>
              <select value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} className="input-field">
                <option value="">Select style...</option>
                {['Modern', 'Vintage', 'Minimalist', 'Bold', 'Elegant', 'Playful', 'Corporate', 'Luxury'].map((s) => (
                  <option key={s} value={s.toLowerCase()}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Platform</label>
              <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="input-field">
                <option value="">Select platform...</option>
                {['Instagram', 'Facebook', 'LinkedIn', 'Twitter/X', 'YouTube', 'Website', 'Print'].map((p) => (
                  <option key={p} value={p.toLowerCase()}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Industry</label>
              <input
                type="text"
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                className="input-field"
                placeholder="e.g., Food & Beverage"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wand2 className="w-4 h-4" /> Generate Design</>}
            </button>
          </form>
        </motion.div>

        {/* Output */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="glass-card p-12 flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-hero-gradient flex items-center justify-center mb-4 animate-glow">
                  <Sparkles className="w-8 h-8 text-white animate-spin" />
                </div>
                <p className="text-surface-700 dark:text-surface-200 font-medium">Generating your design concept...</p>
                <p className="text-xs text-surface-200/50 mt-1">This may take a few seconds</p>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Concept */}
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-surface-900 dark:text-white">Design Concept</h3>
                    <button onClick={() => copyText(result.concept, 'concept')} className="btn-ghost !p-2">
                      {copied === 'concept' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-sm text-surface-700 dark:text-surface-200">{result.concept}</p>
                </div>

                {/* Layout */}
                <div className="glass-card p-5">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-2">Layout Recommendation</h3>
                  <p className="text-sm text-surface-700 dark:text-surface-200">{result.layout}</p>
                </div>

                {/* Colors */}
                <div className="glass-card p-5">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-3">Color Palette</h3>
                  <div className="flex flex-wrap gap-3">
                    {result.colorPalette?.map((color, i) => (
                      <div key={i} className="flex items-center gap-2 bg-surface-50 dark:bg-surface-700/50 rounded-xl px-3 py-2">
                        <div className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: color.hex }} />
                        <div>
                          <p className="text-xs font-semibold text-surface-900 dark:text-white">{color.name}</p>
                          <p className="text-xs text-surface-200/50">{color.hex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typography */}
                <div className="glass-card p-5">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-3">Typography</h3>
                  <div className="space-y-2">
                    {result.typography && Object.entries(result.typography).map(([key, val]) => (
                      <div key={key} className="flex items-start gap-3 p-2 rounded-lg bg-surface-50 dark:bg-surface-700/50">
                        <span className="text-xs font-semibold text-brand-500 uppercase min-w-[60px]">{key}</span>
                        <span className="text-sm text-surface-700 dark:text-surface-200">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA & Marketing Copy */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="glass-card p-5">
                    <h3 className="font-semibold text-surface-900 dark:text-white mb-3">CTA Suggestions</h3>
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
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-surface-900 dark:text-white">Marketing Copy</h3>
                      <button onClick={() => copyText(result.marketingCopy, 'copy')} className="btn-ghost !p-2">
                        {copied === 'copy' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-sm text-surface-700 dark:text-surface-200">{result.marketingCopy}</p>
                  </div>
                </div>

                {/* Image Prompt */}
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-surface-900 dark:text-white">AI Image Prompt</h3>
                    <button onClick={() => copyText(result.imagePrompt, 'img')} className="btn-ghost !p-2">
                      {copied === 'img' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-sm text-surface-700 dark:text-surface-200 font-mono bg-surface-50 dark:bg-surface-700/50 p-3 rounded-lg">{result.imagePrompt}</p>
                </div>
              </motion.div>
            )}

            {!result && !loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="glass-card p-16 flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-700/50 flex items-center justify-center mb-4">
                  <Sparkles className="w-10 h-10 text-surface-200/30" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-surface-900 dark:text-white mb-2">Ready to Create</h3>
                <p className="text-sm text-surface-200/50 max-w-xs">Describe your design idea and AI will generate a complete concept with colors, typography, and more</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
