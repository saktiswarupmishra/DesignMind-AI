import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { Eye, Wand2, Loader2, Star, CheckSquare, AlertTriangle, ArrowRight } from 'lucide-react';

export default function DesignAnalyzerPage() {
  const [form, setForm] = useState({ description: '', designType: '', goals: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const { data } = await api.post('/ai/analyze-design', form); setResult(data.data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><Eye className="w-5 h-5 text-white" /></div>
          <h1 className="font-heading text-2xl font-bold text-surface-900 dark:text-white">AI Design Analyzer</h1>
        </div>
        <p className="text-surface-200/50">Get professional critique, rating and improvement ideas for your designs</p>
      </motion.div>
      <div className="grid lg:grid-cols-5 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <form onSubmit={handleAnalyze} className="glass-card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Describe Your Design *</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field min-h-[120px] resize-none" placeholder="Describe the layout, colors, elements, and text of your design (min 10 chars)..." required />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Design Type</label>
              <select value={form.designType} onChange={e => setForm({...form, designType: e.target.value})} className="input-field">
                <option value="">Select type...</option>
                {['Landing Page','Mobile App','Logo','Flyer/Poster','Social Post','Infographic'].map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Target Goals / Audience</label>
              <input type="text" value={form.goals} onChange={e => setForm({...form, goals: e.target.value})} className="input-field" placeholder="e.g. increase conversions, build trust" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wand2 className="w-4 h-4" /> Analyze Design</>}
            </button>
          </form>
        </motion.div>
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {result && !loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="glass-card p-5 flex items-center justify-between flex-1">
                    <div>
                      <h3 className="font-semibold text-surface-900 dark:text-white">Overall Quality Score</h3>
                      <p className="text-xs text-surface-200/50">Based on layout, accessibility and visual hierarchy</p>
                    </div>
                    <div className="flex items-center gap-1 bg-brand-500/10 text-brand-500 font-bold text-2xl px-4 py-2 rounded-xl">
                      <Star className="w-6 h-6 fill-current" /> {result.overallScore}/100
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="glass-card p-5">
                    <h3 className="font-semibold text-surface-900 dark:text-white mb-3 text-green-500 flex items-center gap-2">✓ Strengths</h3>
                    <ul className="space-y-2">
                      {result.strengths?.map((s,i) => <li key={i} className="text-sm text-surface-700 dark:text-surface-200 flex gap-2"><span>✨</span>{s}</li>)}
                    </ul>
                  </div>
                  <div className="glass-card p-5">
                    <h3 className="font-semibold text-surface-900 dark:text-white mb-3 text-amber-500 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Weaknesses</h3>
                    <ul className="space-y-2">
                      {result.weaknesses?.map((w,i) => <li key={i} className="text-sm text-surface-700 dark:text-surface-200 flex gap-2"><span>⚠️</span>{w}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="glass-card p-5">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-3 flex items-center gap-2"><CheckSquare className="w-4 h-4 text-brand-500"/> Actionable Improvements</h3>
                  <div className="space-y-3">
                    {result.improvements?.map((imp,i) => (
                      <div key={i} className="p-3 rounded-lg bg-surface-50 dark:bg-surface-700/50 flex justify-between items-center">
                        <div>
                          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase">{imp.area}</span>
                          <p className="text-sm text-surface-900 dark:text-white mt-0.5">{imp.suggestion}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${imp.priority==='High'?'bg-red-500/10 text-red-500':imp.priority==='Medium'?'bg-amber-500/10 text-amber-500':'bg-blue-500/10 text-blue-500'}`}>{imp.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-card p-5">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-2">📋 Design Analysis Summary</h3>
                  <p className="text-sm text-surface-700 dark:text-surface-200 mb-4">{result.colorAnalysis}</p>
                  <p className="text-sm text-surface-700 dark:text-surface-200 mb-4">{result.typographyAnalysis}</p>
                  <p className="text-sm text-surface-700 dark:text-surface-200">{result.layoutAnalysis}</p>
                </div>
              </motion.div>
            )}
            {!result && !loading && (
              <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-700/50 flex items-center justify-center mb-4"><Eye className="w-10 h-10 text-surface-200/30" /></div>
                <h3 className="font-heading text-lg font-semibold text-surface-900 dark:text-white mb-2">Critique Your Design</h3>
                <p className="text-sm text-surface-200/50 max-w-xs">Enter your design specifications, goals, and layout details to get a deep professional audit.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
