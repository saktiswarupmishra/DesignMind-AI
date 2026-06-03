import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { Image, Wand2, Loader2, Copy, Check, TrendingUp, Type, Layout } from 'lucide-react';

export default function ThumbnailPage() {
  const [form, setForm] = useState({ prompt: '', platform: 'youtube', style: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/ai/generate-design', {
        prompt: `Create a ${form.platform} thumbnail: ${form.prompt}`,
        style: form.style,
        platform: form.platform,
        industry: 'content creation',
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
            <Image className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-surface-900 dark:text-white">AI Thumbnail Generator</h1>
        </div>
        <p className="text-surface-200/50">Create eye-catching thumbnails optimized for clicks</p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <form onSubmit={handleGenerate} className="glass-card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Video Topic *</label>
              <textarea value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} className="input-field min-h-[100px] resize-none" placeholder="e.g., 10 AI Tools That Will Replace Your Job in 2026" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Platform</label>
              <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="input-field">
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram_reel">Instagram Reel</option>
                <option value="blog">Blog Header</option>
                <option value="podcast">Podcast Cover</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Style</label>
              <select value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} className="input-field">
                <option value="">Select style...</option>
                {['Bold & Dramatic', 'Clean & Modern', 'Colorful & Fun', 'Dark & Cinematic', 'Tech/Futuristic', 'Minimal'].map((s) => <option key={s} value={s.toLowerCase()}>{s}</option>)}
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wand2 className="w-4 h-4" /> Generate Thumbnail</>}
            </button>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> CTR Optimization Tips
              </p>
              <ul className="text-xs text-amber-600 dark:text-amber-300 mt-1 space-y-1">
                <li>• Use faces with emotions for 35% more clicks</li>
                <li>• Large text (3-5 words max) performs best</li>
                <li>• Contrasting colors grab attention</li>
                <li>• Avoid clutter — simplicity wins</li>
              </ul>
            </div>
          </form>
        </motion.div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {result && !loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Layout className="w-4 h-4 text-brand-500" />
                    <h3 className="font-semibold text-surface-900 dark:text-white">Thumbnail Layout</h3>
                  </div>
                  <p className="text-sm text-surface-700 dark:text-surface-200">{result.layout}</p>
                </div>

                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Type className="w-4 h-4 text-accent-teal" />
                    <h3 className="font-semibold text-surface-900 dark:text-white">Thumbnail Text</h3>
                  </div>
                  <div className="space-y-2">
                    {result.ctaSuggestions?.map((text, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-surface-50 dark:bg-surface-700/50">
                        <span className="text-sm font-bold text-surface-900 dark:text-white">{text}</span>
                        <button onClick={() => copyText(text, `txt-${i}`)} className="btn-ghost !p-1">
                          {copied === `txt-${i}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-5">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-3">🎨 Color Scheme</h3>
                  <div className="flex gap-2">
                    {result.colorPalette?.map((color, i) => (
                      <div key={i} className="flex-1 group cursor-pointer" onClick={() => copyText(color.hex, `clr-${i}`)}>
                        <div className="h-16 rounded-xl shadow-md group-hover:scale-105 transition-transform" style={{ backgroundColor: color.hex }} />
                        <p className="text-xs text-center mt-1 font-medium text-surface-700 dark:text-surface-200">{color.hex}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-surface-900 dark:text-white">🖼️ AI Image Prompt</h3>
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
                  <Image className="w-10 h-10 text-surface-200/30" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-surface-900 dark:text-white mb-2">Create Thumbnails</h3>
                <p className="text-sm text-surface-200/50 max-w-xs">Enter your video topic and get AI-generated thumbnail concepts with text, layout, and image prompts</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
