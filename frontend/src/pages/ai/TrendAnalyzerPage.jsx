import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { LineChart, Wand2, Loader2, Sparkles } from 'lucide-react';

export default function TrendAnalyzerPage() {
  const [industry, setIndustry] = useState('');
  const [region, setRegion] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const { data } = await api.post('/ai/analyze-trends', { industry, region }); setResult(data.data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-600 flex items-center justify-center"><LineChart className="w-5 h-5 text-white" /></div>
          <h1 className="font-heading text-2xl font-bold text-surface-900 dark:text-white">AI Trend Analyzer</h1></div>
        <p className="text-surface-200/50">Analyze current graphic design, layout and color palette trends for your industry</p>
      </motion.div>
      <div className="grid lg:grid-cols-5 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <form onSubmit={handleAnalyze} className="glass-card p-6 space-y-4">
            <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Industry Niche *</label>
              <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} className="input-field" placeholder="e.g. Fintech, E-commerce, Healthcare" required /></div>
            <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Target Region</label>
              <select value={region} onChange={e => setRegion(e.target.value)} className="input-field"><option value="">Select region...</option>
                {['Global','North America','Europe','Asia Pacific','Latin America'].map(r => <option key={r} value={r.toLowerCase()}>{r}</option>)}</select></div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wand2 className="w-4 h-4" /> Analyze Trends</>}</button>
          </form>
        </motion.div>
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {result && !loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-3">🔥 Hot Visual Trends</h3>
                  <div className="space-y-3">{result.trends?.map((t,i)=>(<div key={i} className="p-3 rounded-lg bg-surface-50 dark:bg-surface-700/50 space-y-1"><div className="flex justify-between items-center"><span className="text-sm font-bold text-surface-900 dark:text-white">{t.name}</span><span className="text-xs bg-brand-500/10 text-brand-500 px-2 py-0.5 rounded-full font-bold">🎯 Popularity: {t.popularity}%</span></div><p className="text-xs text-surface-700 dark:text-surface-200 mt-1">{t.description}</p></div>))}</div></div>
                <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-3">🎨 Trending Color Palettes</h3>
                  <div className="flex gap-2">{result.colorTrends?.map((c,i)=>(<div key={i} className="flex-1 text-center"><div className="h-10 rounded-xl" style={{backgroundColor:c.color}} /><span className="text-[10px] text-surface-700 dark:text-surface-200 block truncate mt-1">{c.name}</span></div>))}</div></div>
                <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-2">📋 Typography Styles</h3>
                  <div className="space-y-1">{result.typographyTrends?.map((t,i)=>(<div key={i} className="text-sm text-surface-700 dark:text-surface-200 flex gap-2"><span>✨</span>{t.font} — {t.trend}</div>))}</div></div>
              </motion.div>
            )}
            {!result && !loading && (<div className="glass-card p-16 flex flex-col items-center justify-center text-center"><div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-700/50 flex items-center justify-center mb-4"><LineChart className="w-10 h-10 text-surface-200/30" /></div><h3 className="font-heading text-lg font-semibold text-surface-900 dark:text-white mb-2">Analyze Design Trends</h3><p className="text-sm text-surface-200/50 max-w-xs">Describe your industry to generate current color palettes, font pairings and layout trends.</p></div>)}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
