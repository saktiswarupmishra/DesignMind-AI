import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { Target, Wand2, Loader2, Copy, Check } from 'lucide-react';

export default function AdCreativePage() {
  const [form, setForm] = useState({ prompt: '', platform: '', objective: '', audience: '', tone: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const { data } = await api.post('/ai/generate-ad', form); setResult(data.data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };
  const copyText = (t, k) => { navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(''), 2000); };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center"><Target className="w-5 h-5 text-white" /></div>
          <h1 className="font-heading text-2xl font-bold text-surface-900 dark:text-white">AI Ad Creative</h1></div>
        <p className="text-surface-200/50">Generate high-converting ad creatives with AI targeting</p>
      </motion.div>
      <div className="grid lg:grid-cols-5 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <form onSubmit={handleGenerate} className="glass-card p-6 space-y-4">
            <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Product / Service *</label>
              <textarea value={form.prompt} onChange={e => setForm({...form, prompt: e.target.value})} className="input-field min-h-[100px] resize-none" placeholder="e.g., AI-powered project management tool for remote teams" required /></div>
            <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Platform</label>
              <select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})} className="input-field"><option value="">Select platform...</option>
                {['Google Ads','Facebook/Instagram','LinkedIn','Twitter/X','TikTok','YouTube'].map(p => <option key={p} value={p.toLowerCase()}>{p}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Objective</label>
              <select value={form.objective} onChange={e => setForm({...form, objective: e.target.value})} className="input-field"><option value="">Select objective...</option>
                {['Brand Awareness','Lead Generation','Conversions','App Installs','Traffic','Engagement'].map(o => <option key={o} value={o.toLowerCase()}>{o}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Target Audience</label>
              <input type="text" value={form.audience} onChange={e => setForm({...form, audience: e.target.value})} className="input-field" placeholder="e.g., Tech professionals 25-45" /></div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wand2 className="w-4 h-4" /> Generate Ad</>}</button>
          </form>
        </motion.div>
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {result && !loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="glass-card p-5"><div className="flex items-center justify-between mb-2"><h3 className="font-semibold text-surface-900 dark:text-white">📝 Primary Text</h3><button onClick={()=>copyText(result.primaryText,'pt')} className="btn-ghost !p-2">{copied==='pt'?<Check className="w-4 h-4 text-green-500"/>:<Copy className="w-4 h-4"/>}</button></div><p className="text-sm text-surface-700 dark:text-surface-200">{result.primaryText}</p></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-2">🎯 Headline</h3><p className="text-sm font-bold text-brand-600 dark:text-brand-400">{result.headline}</p></div>
                  <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-2">📋 Description</h3><p className="text-sm text-surface-700 dark:text-surface-200">{result.description}</p></div>
                </div>
                <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-2">🎨 Visual Concept</h3><p className="text-sm text-surface-700 dark:text-surface-200">{result.visualConcept}</p></div>
                <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-3">📊 A/B Test Variations</h3><div className="space-y-2">{result.variations?.map((v,i)=>(<div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-50 dark:bg-surface-700/50"><span className="text-sm text-surface-900 dark:text-white font-medium">{v}</span><button onClick={()=>copyText(v,`v${i}`)} className="btn-ghost !p-1">{copied===`v${i}`?<Check className="w-3 h-3 text-green-500"/>:<Copy className="w-3 h-3"/>}</button></div>))}</div></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-3">🎯 Targeting Tips</h3><ul className="space-y-2">{result.targetingTips?.map((t,i)=>(<li key={i} className="text-sm text-surface-700 dark:text-surface-200 flex items-start gap-2"><span className="text-brand-500 mt-0.5">•</span>{t}</li>))}</ul></div>
                  <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-3">📈 Performance Tips</h3><ul className="space-y-2">{result.performanceTips?.map((t,i)=>(<li key={i} className="text-sm text-surface-700 dark:text-surface-200 flex items-start gap-2"><span className="text-accent-teal mt-0.5">•</span>{t}</li>))}</ul></div>
                </div>
              </motion.div>
            )}
            {!result && !loading && (<div className="glass-card p-16 flex flex-col items-center justify-center text-center"><div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-700/50 flex items-center justify-center mb-4"><Target className="w-10 h-10 text-surface-200/30" /></div><h3 className="font-heading text-lg font-semibold text-surface-900 dark:text-white mb-2">Create Ads</h3><p className="text-sm text-surface-200/50 max-w-xs">Generate platform-optimized ad creatives with targeting and A/B variations</p></div>)}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
