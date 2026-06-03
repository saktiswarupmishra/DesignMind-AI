import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { FileImage, Wand2, Loader2, Copy, Check } from 'lucide-react';

const sizes = ['24x36 inches', '18x24 inches', '11x17 inches', 'A3', 'A4', 'Custom'];
const events = ['Concert/Music', 'Conference', 'Product Launch', 'Sale/Promotion', 'Charity', 'Sports', 'Art Exhibition', 'Festival'];

export default function PosterGeneratorPage() {
  const [form, setForm] = useState({ prompt: '', size: '', eventType: '', industry: '', style: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const { data } = await api.post('/ai/generate-poster', form); setResult(data.data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };
  const copyText = (t, k) => { navigator.clipboard.writeText(typeof t === 'object' ? JSON.stringify(t,null,2) : t); setCopied(k); setTimeout(() => setCopied(''), 2000); };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center"><FileImage className="w-5 h-5 text-white" /></div>
          <h1 className="font-heading text-2xl font-bold text-surface-900 dark:text-white">AI Poster Generator</h1>
        </div>
        <p className="text-surface-200/50">Create stunning posters and flyers with AI</p>
      </motion.div>
      <div className="grid lg:grid-cols-5 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <form onSubmit={handleGenerate} className="glass-card p-6 space-y-4">
            <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Poster Description *</label>
              <textarea value={form.prompt} onChange={e => setForm({...form, prompt: e.target.value})} className="input-field min-h-[100px] resize-none" placeholder="e.g., Summer music festival featuring electronic artists" required /></div>
            <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Size</label>
              <select value={form.size} onChange={e => setForm({...form, size: e.target.value})} className="input-field">
                <option value="">Select size...</option>{sizes.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Event Type</label>
              <select value={form.eventType} onChange={e => setForm({...form, eventType: e.target.value})} className="input-field">
                <option value="">Select type...</option>{events.map(e => <option key={e} value={e}>{e}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Style</label>
              <select value={form.style} onChange={e => setForm({...form, style: e.target.value})} className="input-field">
                <option value="">Select style...</option>{['Bold & Dramatic','Minimalist','Retro/Vintage','Neon/Futuristic','Elegant','Grunge','Watercolor'].map(s => <option key={s} value={s.toLowerCase()}>{s}</option>)}</select></div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wand2 className="w-4 h-4" /> Generate Poster</>}</button>
          </form>
        </motion.div>
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {result && !loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-2">📌 Headline</h3><p className="text-lg font-bold text-brand-600 dark:text-brand-400">{result.headline}</p><p className="text-sm text-surface-700 dark:text-surface-200 mt-1">{result.subheadline}</p></div>
                <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-2">📐 Layout</h3><p className="text-sm text-surface-700 dark:text-surface-200">{result.layout}</p></div>
                <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-3">🎨 Color Scheme</h3>
                  <div className="flex gap-2">{result.colorScheme?.map((c,i) => (<div key={i} className="flex-1 cursor-pointer group" onClick={() => copyText(c.hex,`c${i}`)}><div className="h-14 rounded-xl shadow-md group-hover:scale-105 transition-transform" style={{backgroundColor:c.hex}} /><p className="text-xs text-center mt-1 text-surface-700 dark:text-surface-200">{c.name}</p></div>))}</div></div>
                <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-2">✨ Design Elements</h3>
                  <div className="flex flex-wrap gap-2">{result.designElements?.map((el,i) => (<span key={i} className="px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 text-xs font-semibold">{el}</span>))}</div></div>
                <div className="glass-card p-5"><div className="flex items-center justify-between mb-2"><h3 className="font-semibold text-surface-900 dark:text-white">🖼️ Image Prompt</h3><button onClick={() => copyText(result.imagePrompt,'img')} className="btn-ghost !p-2">{copied==='img'?<Check className="w-4 h-4 text-green-500"/>:<Copy className="w-4 h-4"/>}</button></div><p className="text-sm font-mono text-surface-700 dark:text-surface-200 bg-surface-50 dark:bg-surface-700/50 p-3 rounded-lg">{result.imagePrompt}</p></div>
                {result.printSpecs && <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-2">🖨️ Print Specs</h3><div className="grid grid-cols-2 gap-2">{Object.entries(result.printSpecs).map(([k,v]) => (<div key={k} className="p-2 rounded-lg bg-surface-50 dark:bg-surface-700/50"><span className="text-xs text-surface-200/50 capitalize">{k}</span><p className="text-sm font-semibold text-surface-900 dark:text-white">{v}</p></div>))}</div></div>}
              </motion.div>
            )}
            {!result && !loading && (
              <div className="glass-card p-16 flex flex-col items-center justify-center text-center"><div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-700/50 flex items-center justify-center mb-4"><FileImage className="w-10 h-10 text-surface-200/30" /></div><h3 className="font-heading text-lg font-semibold text-surface-900 dark:text-white mb-2">Design a Poster</h3><p className="text-sm text-surface-200/50 max-w-xs">Describe your poster and get a complete design concept with layout, colors, and print specifications</p></div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
