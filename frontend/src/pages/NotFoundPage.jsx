import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card max-w-md w-full p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-4xl font-bold text-surface-900 dark:text-white">404</h1>
          <h2 className="text-xl font-semibold text-surface-900 dark:text-white">Page Not Found</h2>
          <p className="text-sm text-surface-200/50">The page you are looking for does not exist or has been moved.</p>
        </div>
        <Link to="/" className="btn-primary inline-flex items-center gap-2 w-full justify-center !py-3">
          <ArrowLeft className="w-4 h-4" /> Back to Safety
        </Link>
      </motion.div>
    </div>
  );
}
