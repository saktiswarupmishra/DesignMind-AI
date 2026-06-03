import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { Layers, Wand2, Loader2, Copy, Check, Palette, Type, Eye, Target, Heart } from 'lucide-react';

export default function BrandIdentityPage() {
  const [form, setForm] = useState({ brandName: '', industry: '', targetAudience: '', style: '', values: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, values: form.values ? form.values.split(',').map(v => v.trim()) : [] };
      const { data } = await api.post('/ai/generate-brand', payload);
      setResult(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(typeof text === 'object' ? JSON.stringify(text, null, 2) : text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-pink to-rose-600 flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-surface-900 dark:text-white">AI Brand Identity Generator</h1>
        </div>
        <p className="text-surface-200/50">Generate a complete brand identity package with AI</p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <form onSubmit={handleGenerate} className="glass-card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Brand Name *</label>
              <input type="text" value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })} className="input-field" placeholder="e.g., NovaTech" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Industry</label>
              <input type="text" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="input-field" placeholder="e.g., SaaS, E-commerce" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Target Audience</label>
              <input type="text" value={form.targetAudience} onChange={(e) => setForm({ ...form, targetAudience: e.target.value })} className="input-field" placeholder="e.g., Young professionals 25-35" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Brand Style</label>
              <select value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} className="input-field">
                <option value="">Select style...</option>
                {['Modern', 'Classic', 'Bold', 'Elegant', 'Playful', 'Luxury', 'Minimalist', 'Techy'].map((s) => <option key={s} value={s.toLowerCase()}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Core Values (comma separated)</label>
              <input type="text" value={form.values} onChange={(e) => setForm({ ...form, values: e.target.value })} className="input-field" placeholder="Innovation, Trust, Quality" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wand2 className="w-4 h-4" /> Generate Brand Identity</>}
            </button>
          </form>
        </motion.div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card p-12 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-hero-gradient flex items-center justify-center mb-4 animate-glow">
                  <Layers className="w-8 h-8 text-white animate-spin" />
                </div>
                <p className="text-surface-700 dark:text-surface-200 font-medium">Creating your brand identity...</p>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Mission & Vision */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-brand-500" />
                      <h3 className="font-semibold text-surface-900 dark:text-white">Mission Statement</h3>
                    </div>
                    <p className="text-sm text-surface-700 dark:text-surface-200">{result.missionStatement}</p>
                  </div>
                  <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-accent-teal" />
                      <h3 className="font-semibold text-surface-900 dark:text-white">Vision Statement</h3>
                    </div>
                    <p className="text-sm text-surface-700 dark:text-surface-200">{result.visionStatement}</p>
                  </div>
                </div>

                {/* Brand Voice */}
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-surface-900 dark:text-white flex items-center gap-2">
                      <Heart className="w-4 h-4 text-accent-pink" /> Brand Voice
                    </h3>
                    <button onClick={() => copyText(result.brandVoice, 'voice')} className="btn-ghost !p-2">
                      {copied === 'voice' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-sm text-surface-700 dark:text-surface-200">{result.brandVoice}</p>
                </div>

                {/* Color Palette */}
                {result.colorPalette && (
                  <div className="glass-card p-5">
                    <h3 className="font-semibold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-accent-gold" /> Brand Colors
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(result.colorPalette).map(([key, hex]) => (
                        <button key={key} onClick={() => copyText(hex, `clr-${key}`)} className="flex items-center gap-2 bg-surface-50 dark:bg-surface-700/50 rounded-xl px-3 py-2 hover:scale-105 transition-transform">
                          <div className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: hex }} />
                          <div>
                            <p className="text-xs font-semibold text-surface-900 dark:text-white capitalize">{key}</p>
                            <p className="text-xs text-surface-200/50">{hex}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Typography */}
                {result.typography && (
                  <div className="glass-card p-5">
                    <h3 className="font-semibold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
                      <Type className="w-4 h-4 text-brand-500" /> Typography System
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(result.typography).map(([key, val]) => (
                        <div key={key} className="p-3 rounded-lg bg-surface-50 dark:bg-surface-700/50">
                          <span className="text-xs font-semibold text-brand-500 uppercase">{key}</span>
                          <p className="text-sm text-surface-700 dark:text-surface-200 mt-1">
                            {typeof val === 'object' ? `${val.font} — ${val.weight} — ${val.usage}` : val}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Brand Personality */}
                {result.brandPersonality && (
                  <div className="glass-card p-5">
                    <h3 className="font-semibold text-surface-900 dark:text-white mb-3">Brand Personality</h3>
                    {result.brandPersonality.traits && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {result.brandPersonality.traits.map((trait) => (
                          <span key={trait} className="px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 text-xs font-semibold">{trait}</span>
                        ))}
                      </div>
                    )}
                    {result.brandPersonality.archetype && (
                      <p className="text-sm text-surface-700 dark:text-surface-200 mb-2">
                        <strong>Archetype:</strong> {result.brandPersonality.archetype}
                      </p>
                    )}
                    {result.brandPersonality.tone && (
                      <p className="text-sm text-surface-700 dark:text-surface-200">
                        <strong>Tone:</strong> {result.brandPersonality.tone}
                      </p>
                    )}
                  </div>
                )}

                {/* Logo Ideas */}
                {result.logoIdeas && (
                  <div className="glass-card p-5">
                    <h3 className="font-semibold text-surface-900 dark:text-white mb-3">Logo Concepts</h3>
                    <div className="space-y-2">
                      {result.logoIdeas.map((idea, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-700/50">
                          <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                          <div>
                            <p className="text-sm font-semibold text-surface-900 dark:text-white">{idea.concept}</p>
                            <p className="text-xs text-surface-200/50 mt-1">{idea.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {!result && !loading && (
              <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-700/50 flex items-center justify-center mb-4">
                  <Layers className="w-10 h-10 text-surface-200/30" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-surface-900 dark:text-white mb-2">Build Your Brand</h3>
                <p className="text-sm text-surface-200/50 max-w-xs">Enter your brand details and AI will create a complete identity with colors, typography, voice, and guidelines</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
