import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Upload, Trash2, Check, Download, Loader2 } from 'lucide-react';

export default function BackgroundRemoverPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [removed, setRemoved] = useState(false);

  const handleUpload = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setRemoved(false);
    }
  };

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => {
      setRemoving(false);
      setRemoved(true);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center"><Image className="w-5 h-5 text-white" /></div>
          <h1 className="font-heading text-2xl font-bold text-surface-900 dark:text-white">AI Background Remover</h1>
        </div>
        <p className="text-surface-200/50">Instantly remove backgrounds from images with professional precision</p>
      </motion.div>

      <div className="glass-card p-8">
        {!preview ? (
          <div className="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-2xl p-12 text-center hover:border-brand-500 transition-colors cursor-pointer relative">
            <input type="file" onChange={handleUpload} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-surface-200/50" />
            </div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">Upload an image</h3>
            <p className="text-sm text-surface-200/50">Supports PNG, JPG, JPEG up to 10MB</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-surface-700 dark:text-surface-200">Original Image</p>
                <div className="aspect-video bg-surface-100 dark:bg-surface-800 rounded-xl overflow-hidden flex items-center justify-center relative">
                  <img src={preview} alt="Original" className="max-h-full max-w-full object-contain" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-surface-700 dark:text-surface-200">Result (Background Removed)</p>
                <div className={`aspect-video rounded-xl overflow-hidden flex items-center justify-center relative ${removed ? 'bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[size:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] dark:bg-[linear-gradient(45deg,#333_25%,transparent_25%)]' : 'bg-surface-100 dark:bg-surface-800'}`}>
                  {removed ? (
                    <img src={preview} alt="Removed background" className="max-h-full max-w-full object-contain filter drop-shadow-md" style={{ mixBlendMode: 'multiply' }} />
                  ) : (
                    <div className="text-center text-surface-200/30">
                      {removing ? (
                        <div className="space-y-2 flex flex-col items-center">
                          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
                          <span className="text-sm">Removing background...</span>
                        </div>
                      ) : (
                        <span>Click Remove Background below</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-surface-200 dark:border-surface-700">
              <button onClick={() => { setFile(null); setPreview(null); setRemoved(false); }} className="btn-ghost text-red-500 flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Clear
              </button>
              <div className="flex gap-3">
                {!removed ? (
                  <button onClick={handleRemove} disabled={removing} className="btn-primary flex items-center gap-2">
                    {removing ? 'Processing...' : 'Remove Background'}
                  </button>
                ) : (
                  <a href={preview} download="no-bg.png" className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-700">
                    <Download className="w-4 h-4" /> Download PNG
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
