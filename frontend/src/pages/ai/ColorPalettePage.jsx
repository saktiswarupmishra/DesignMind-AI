import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { Palette, Wand2, Loader2, Copy, Check } from 'lucide-react';

export default function ColorPalettePage() {
  const [form, setForm] = useState({ prompt: '', mood: '', industry: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedHex, setCopiedHex] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/ai/generate-palette', form);
      setResult(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const copyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(''), 1500);
  };

  const ColorSwatch = ({ color, size = 'md' }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => copyHex(color.hex)}
      className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${size === 'lg' ? 'h-32' : 'h-24'}`}
    >
      <div className="absolute inset-0" style={{ backgroundColor: color.hex }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end pb-3">
        <p className="text-white text-xs font-bold">{color.name}</p>
        <p className="text-white/70 text-xs">{color.hex}</p>
        {copiedHex === color.hex && <span className="text-green-300 text-xs mt-1">Copied!</span>}
      </div>
    </motion.button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-teal to-emerald-600 flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-surface-900 dark:text-white">AI Color Palette Engine</h1>
        </div>
        <p className="text-surface-200/50">Generate beautiful, harmonious color palettes with AI-powered color theory</p>
      </motion.div>

      {/* Input */}
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        onSubmit={handleGenerate} className="glass-card p-6"
      >
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Describe your project *</label>
            <input type="text" value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} className="input-field" placeholder="e.g., Modern tech startup, warm coffee brand..." required />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-2">Mood</label>
            <select value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })} className="input-field">
              <option value="">Any mood</option>
              {['Energetic', 'Calm', 'Luxurious', 'Playful', 'Professional', 'Warm', 'Cool', 'Dramatic'].map((m) => (
                <option key={m} value={m.toLowerCase()}>{m}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wand2 className="w-4 h-4" /> Generate</>}
            </button>
          </div>
        </div>
      </motion.form>

      {/* Output */}
      <AnimatePresence mode="wait">
        {result && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {[
              { title: 'Primary Colors', colors: result.primary, desc: 'Core brand identity colors' },
              { title: 'Secondary Colors', colors: result.secondary, desc: 'Supporting and complementary colors' },
              { title: 'Accent Colors', colors: result.accent, desc: 'Highlight and emphasis colors' },
              { title: 'Brand System', colors: result.brandColors, desc: 'Text, backgrounds, and UI colors' },
            ].map((section) => (
              <div key={section.title} className="glass-card p-6">
                <h3 className="font-heading font-semibold text-surface-900 dark:text-white mb-1">{section.title}</h3>
                <p className="text-xs text-surface-200/50 mb-4">{section.desc}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {section.colors?.map((color, i) => (
                    <div key={i}>
                      <ColorSwatch color={color} />
                      <div className="mt-2 text-center">
                        <p className="text-xs font-semibold text-surface-900 dark:text-white">{color.name}</p>
                        <p className="text-xs text-surface-200/50">{color.usage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Psychology Report */}
            {result.psychologyReport && (
              <div className="glass-card p-6">
                <h3 className="font-heading font-semibold text-surface-900 dark:text-white mb-3">🧠 Color Psychology Report</h3>
                <p className="text-sm text-surface-700 dark:text-surface-200 leading-relaxed">{result.psychologyReport}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
