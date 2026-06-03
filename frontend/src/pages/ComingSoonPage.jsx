import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

export default function ComingSoonPage({ title, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-6">
        {Icon ? <Icon className="w-10 h-10 text-brand-500" /> : <Construction className="w-10 h-10 text-brand-500" />}
      </div>
      <h1 className="font-heading text-3xl font-bold text-surface-900 dark:text-white mb-3">
        {title || 'Coming Soon'}
      </h1>
      <p className="text-surface-200/50 max-w-md">
        This feature is under development and will be available in the next phase. Stay tuned for exciting updates!
      </p>
      <div className="mt-6 px-4 py-2 rounded-full bg-accent-gold/10 text-accent-gold text-sm font-medium">
        Phase 2 Feature
      </div>
    </motion.div>
  );
}
