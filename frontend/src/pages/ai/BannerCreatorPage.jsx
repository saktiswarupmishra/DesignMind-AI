import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { LayoutDashboard, Wand2, Loader2, Copy, Check } from 'lucide-react';

export default function BannerCreatorPage() {
  const [form, setForm] = useState({ prompt: '', dimensions: '', platform: '', style: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const { data } = await api.post('/ai/generate-banner', form); setResult(data.data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };
  const copyText = (t, k) => { navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(''), 2000); };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center"><LayoutDashboard className="w-5 h-5 text-white" /></div>
          <h1 className="font-heading text-2xl font-bold text-surface-900 dark:text-white">AI Banner Creator</h1></div>
        <p className="text-surface-200/50">Design web banners, ads, and marketing assets</p>
      </motion.div>
      <div className="grid lg:grid-cols-5 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <form onSubmit={handleGenerate} className="glass-card p-6 space-y-4">
            <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Banner Description *</label>
              <textarea value={form.prompt} onChange={e => setForm({...form, prompt: e.target.value})} className="input-field min-h-[100px] resize-none" placeholder="e.g., SaaS product launch banner with free trial CTA" required /></div>
            <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Platform</label>
              <select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})} className="input-field"><option value="">Select platform...</option>
                {['Website Hero','Google Display','Facebook Ad','LinkedIn','Email Header','Blog Header'].map(p => <option key={p} value={p.toLowerCase()}>{p}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Dimensions</label>
              <select value={form.dimensions} onChange={e => setForm({...form, dimensions: e.target.value})} className="input-field"><option value="">Select size...</option>
                {['728x90 (Leaderboard)','300x250 (Medium Rectangle)','160x600 (Skyscraper)','1920x600 (Hero)','1200x628 (Social)','468x60 (Full Banner)'].map(d => <option key={d} value={d}>{d}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Style</label>
              <select value={form.style} onChange={e => setForm({...form, style: e.target.value})} className="input-field"><option value="">Select style...</option>
                {['Gradient','Flat','3D','Glassmorphism','Minimal','Dark','Illustrated'].map(s => <option key={s} value={s.toLowerCase()}>{s}</option>)}</select></div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wand2 className="w-4 h-4" /> Generate Banner</>}</button>
          </form>
        </motion.div>
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {result && !loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-2">📢 Headline</h3><p className="text-lg font-bold text-brand-600 dark:text-brand-400">{result.headline}</p><p className="text-sm text-surface-700 dark:text-surface-200 mt-1">{result.tagline}</p></div>
                <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-2">📐 Layout</h3><p className="text-sm text-surface-700 dark:text-surface-200">{result.layout}</p></div>
                <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-3">🎨 Colors</h3><div className="flex gap-2">{result.colorPalette?.map((c,i)=>(<div key={i} className="flex-1 group cursor-pointer" onClick={()=>copyText(c.hex,`c${i}`)}><div className="h-14 rounded-xl shadow-md group-hover:scale-105 transition-transform" style={{backgroundColor:c.hex}} /><p className="text-xs text-center mt-1 text-surface-700 dark:text-surface-200">{c.name}</p></div>))}</div></div>
                {result.ctaButton && <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-3">🎯 CTA Button</h3><div className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-white font-semibold" style={{backgroundColor:result.ctaButton.color}}>{result.ctaButton.text}</div><p className="text-xs text-surface-200/50 mt-2">Shape: {result.ctaButton.shape}</p></div>}
                {result.animationSuggestions && <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-3">✨ Animation</h3><div className="space-y-2">{result.animationSuggestions.map((a,i) => <div key={i} className="p-2 rounded-lg bg-surface-50 dark:bg-surface-700/50 text-sm text-surface-700 dark:text-surface-200">🎬 {a}</div>)}</div></div>}
                <div className="glass-card p-5"><div className="flex items-center justify-between mb-2"><h3 className="font-semibold text-surface-900 dark:text-white">🖼️ Image Prompt</h3><button onClick={()=>copyText(result.imagePrompt,'img')} className="btn-ghost !p-2">{copied==='img'?<Check className="w-4 h-4 text-green-500"/>:<Copy className="w-4 h-4"/>}</button></div><p className="text-sm font-mono text-surface-700 dark:text-surface-200 bg-surface-50 dark:bg-surface-700/50 p-3 rounded-lg">{result.imagePrompt}</p></div>
              </motion.div>
            )}
            {!result && !loading && (<div className="glass-card p-16 flex flex-col items-center justify-center text-center"><div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-700/50 flex items-center justify-center mb-4"><LayoutDashboard className="w-10 h-10 text-surface-200/30" /></div><h3 className="font-heading text-lg font-semibold text-surface-900 dark:text-white mb-2">Create a Banner</h3><p className="text-sm text-surface-200/50 max-w-xs">Design professional web banners and marketing assets with AI</p></div>)}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
