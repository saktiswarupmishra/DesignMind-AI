import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { Search, Grid, Layout, Award, Play, Filter } from 'lucide-react';

const categories = ['All', 'Social Media', 'Thumbnails', 'Logos', 'Brand Identity', 'Posters', 'Banners'];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, [category]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const q = category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
      const { data } = await api.get(`/templates${q}`);
      setTemplates(data.data.templates || []);
    } catch (err) {
      console.error(err);
      // Fallback templates for marketplace
      setTemplates([
        { id: 1, name: 'SaaS Product Hero', category: 'Banners', type: 'BANNER', isPremium: true, usageCount: 450, thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80' },
        { id: 2, name: 'Cyberpunk YouTube Cover', category: 'Thumbnails', type: 'THUMBNAIL', isPremium: false, usageCount: 1200, thumbnailUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&q=80' },
        { id: 3, name: 'Modern Serif Monogram', category: 'Logos', type: 'LOGO', isPremium: false, usageCount: 890, thumbnailUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&q=80' },
        { id: 4, name: 'Tech Conf Poster 2026', category: 'Posters', type: 'POSTER', isPremium: true, usageCount: 320, thumbnailUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80' },
        { id: 5, name: 'Minimal Instagram Post', category: 'Social Media', type: 'SOCIAL_MEDIA', isPremium: false, usageCount: 2300, thumbnailUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80' },
        { id: 6, name: 'Corporate Brand Guidelines', category: 'Brand Identity', type: 'BRAND_IDENTITY', isPremium: true, usageCount: 140, thumbnailUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=80' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = async (tid) => {
    try {
      const { data } = await api.post(`/templates/${tid}/use`);
      navigate(`/projects`);
    } catch (err) {
      console.error(err);
      navigate(`/projects`);
    }
  };

  const filtered = templates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
            <Layout className="w-8 h-8 text-brand-500" /> Template Marketplace
          </h1>
          <p className="text-surface-200/50 mt-1">Jumpstart your designs with professional pre-built templates</p>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${category === c ? 'bg-brand-500 text-white shadow-md' : 'bg-surface-50 dark:bg-surface-800 text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-700/50'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-200/50" />
          <input type="text" placeholder="Search templates..." value={search} onChange={e => setSearch(e.target.value)} className="input-field !pl-10" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card overflow-hidden group">
            <div className="aspect-[4/3] bg-surface-100 dark:bg-surface-800 relative overflow-hidden">
              <img src={t.thumbnailUrl} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 duration-300">
                <button onClick={() => handleUseTemplate(t.id)} className="btn-primary flex items-center gap-2 !py-2.5">
                  <Play className="w-4 h-4 fill-current" /> Use Template
                </button>
              </div>
              <div className="absolute top-3 left-3 flex gap-2">
                {t.isPremium && <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Award className="w-3 h-3" /> Premium</span>}
                <span className="bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{t.category}</span>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-surface-900 dark:text-white group-hover:text-brand-500 transition-colors">{t.name}</h3>
                <p className="text-xs text-surface-200/50 mt-0.5">{t.usageCount} uses</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
