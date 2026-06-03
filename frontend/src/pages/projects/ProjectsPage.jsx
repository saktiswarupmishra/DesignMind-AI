import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { FolderOpen, Plus, Search, MoreVertical, Calendar, Image, Trash2, Edit3, Loader2 } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', category: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.data.projects);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/projects', newProject);
      setNewProject({ name: '', description: '', category: '' });
      setShowCreate(false);
      fetchProjects();
    } catch (err) { console.error(err); }
    finally { setCreating(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) { console.error(err); }
  };

  const categories = ['All', 'Branding', 'Marketing', 'Social Media', 'Print', 'Video', 'Web'];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-surface-900 dark:text-white">Projects</h1>
          <p className="text-surface-200/50 mt-1">Organize and manage your design projects</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </motion.div>

      {/* Create Project Form */}
      {showCreate && (
        <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleCreate} className="glass-card p-6">
          <h3 className="font-heading font-semibold text-surface-900 dark:text-white mb-4">Create New Project</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <input type="text" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} className="input-field" placeholder="Project name *" required />
            <input type="text" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className="input-field" placeholder="Description" />
            <select value={newProject.category} onChange={(e) => setNewProject({ ...newProject, category: e.target.value })} className="input-field">
              <option value="">Category</option>
              {categories.filter(c => c !== 'All').map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={creating} className="btn-primary">
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Project'}
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="btn-ghost">Cancel</button>
          </div>
        </motion.form>
      )}

      {/* Project Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        </div>
      ) : projects.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-brand-500" />
                </div>
                <button onClick={() => handleDelete(project.id)} className="opacity-0 group-hover:opacity-100 transition-opacity btn-ghost !p-1.5 text-red-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-heading font-semibold text-surface-900 dark:text-white mb-1">{project.name}</h3>
              <p className="text-xs text-surface-200/50 mb-3 line-clamp-2">{project.description || 'No description'}</p>
              <div className="flex items-center justify-between text-xs text-surface-200/50">
                <span className="flex items-center gap-1">
                  <Image className="w-3 h-3" /> {project._count?.designs || 0} designs
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
              {project.category && (
                <span className="inline-block mt-3 px-2 py-1 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-500 text-xs font-medium">{project.category}</span>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
          <FolderOpen className="w-14 h-14 text-surface-200/30 mb-4" />
          <h3 className="font-heading text-lg font-semibold text-surface-900 dark:text-white mb-2">No Projects Yet</h3>
          <p className="text-sm text-surface-200/50 mb-4">Create your first project to start organizing your designs</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> Create Project
          </button>
        </div>
      )}
    </div>
  );
}
