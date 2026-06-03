import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { Wand2, Loader2, Maximize2 } from 'lucide-react';

const targets = ['instagram_post', 'instagram_story', 'facebook_cover', 'twitter_header', 'linkedin_banner', 'youtube_thumbnail'];

export default function SmartResizerPage() {
  const [prompt, setPrompt] = useState('');
  const [originalPlatform, setOriginalPlatform] = useState('');
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleToggle = (t) => {
    if (selectedTargets.includes(t)) setSelectedTargets(selectedTargets.filter(item => item !== t));
    else setSelectedTargets([...selectedTargets, t]);
  };

  const handleResize = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const { data } = await api.post('/ai/smart-resize', { prompt, originalPlatform, targetPlatforms: selectedTargets }); setResult(data.data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-600 flex items-center justify-center"><Maximize2 className="w-5 h-5 text-white" /></div>
          <h1 className="font-heading text-2xl font-bold text-surface-900 dark:text-white">Smart Resizer</h1></div>
        <p className="text-surface-200/50">Resize your creative content layouts to target multiple platforms automatically</p>
      </motion.div>
      <div className="grid lg:grid-cols-5 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <form onSubmit={handleResize} className="glass-card p-6 space-y-4">
            <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Original Design Description *</label>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="input-field min-h-[100px] resize-none" placeholder="e.g. Minimalist Instagram square ad with central logo and text below" required /></div>
            <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Original Aspect Ratio / Platform</label>
              <select value={originalPlatform} onChange={e => setOriginalPlatform(e.target.value)} className="input-field"><option value="">Select platform...</option>
                {['Instagram Post (1:1)','Instagram Story (9:16)','YouTube Thumbnail (16:9)','LinkedIn Banner'].map(p => <option key={p} value={p.toLowerCase()}>{p}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Target Platforms</label>
              <div className="grid grid-cols-2 gap-2">{targets.map(t => (
                <button type="button" key={t} onClick={() => handleToggle(t)} className={`p-2 rounded-xl text-xs font-semibold border transition-all duration-350 ${selectedTargets.includes(t) ? 'bg-brand-500/10 border-brand-500 text-brand-500' : 'border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-200'}`}>
                  {t.replace('_', ' ').toUpperCase()}
                </button>
              ))}</div></div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wand2 className="w-4 h-4" /> Analyze Layout Resize</>}</button>
          </form>
        </motion.div>
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {result && !loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-3">📐 Target Layout Suggestions</h3>
                  <div className="space-y-3">{result.resizes?.map((r,i)=>(<div key={i} className="p-3 rounded-lg bg-surface-50 dark:bg-surface-700/50 space-y-1"><span className="text-sm font-bold text-brand-600 dark:text-brand-400">{r.platform} ({r.dimensions} | {r.aspectRatio})</span><p className="text-xs text-surface-200/50">Focus Area: {r.focusArea}</p><ul className="text-xs text-surface-700 dark:text-surface-200 mt-1 space-y-1">{r.adjustments?.map((a,idx)=>(<li key={idx}>🔧 {a}</li>))}</ul></div>))}</div></div>
                <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-2">📋 Elements Priority Flow</h3><p className="text-sm text-surface-700 dark:text-surface-200">{result.contentPriority}</p></div>
                <div className="glass-card p-5"><h3 className="font-semibold text-surface-900 dark:text-white mb-2">💡 Crop Strategy</h3><p className="text-sm text-surface-700 dark:text-surface-200">{result.cropSuggestions}</p></div>
              </motion.div>
            )}
            {!result && !loading && (<div className="glass-card p-16 flex flex-col items-center justify-center text-center"><div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-700/50 flex items-center justify-center mb-4"><Maximize2 className="w-10 h-10 text-surface-200/30" /></div><h3 className="font-heading text-lg font-semibold text-surface-900 dark:text-white mb-2">Analyze Layout Resize</h3><p className="text-sm text-surface-200/50 max-w-xs">Define your design specs and choose multi-platform outputs to get structural layout suggestions</p></div>)}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
