import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import api from '../../api/axios';

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I am your DesignMind creative assistant. How can I help you design today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Send message to our general design prompt copywriter backend or general proxy
      const { data } = await api.post('/ai/generate-design', { prompt: `Chat question: ${input}. Provide a short, direct helpful response answering the question.` });
      const botMsg = { id: Date.now() + 1, text: data.data.concept || 'I am ready to help you generate styles, logo ideas or color palettes. Choose a tool from the sidebar to begin!', sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const botMsg = { id: Date.now() + 1, text: 'I am here to guide you with branding and graphic design. Try using logo or color generator pages for custom results!', sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }} className="w-80 sm:w-96 h-[480px] bg-white dark:bg-surface-800 rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-700 flex flex-col overflow-hidden mb-4">
            <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold text-sm">DesignMind Assistant</h3>
                  <span className="text-[10px] text-brand-100 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Online</span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map(m => (
                <div key={m.id} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500 shrink-0"><Bot className="w-4 h-4" /></div>}
                  <div className={`p-3 rounded-2xl max-w-[75%] text-sm ${m.sender === 'user' ? 'bg-brand-500 text-white rounded-tr-none' : 'bg-surface-50 dark:bg-surface-700/50 text-surface-900 dark:text-white rounded-tl-none'}`}>
                    {m.text}
                  </div>
                  {m.sender === 'user' && <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white shrink-0"><User className="w-4 h-4" /></div>}
                </div>
              ))}
              {loading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500 shrink-0"><Bot className="w-4 h-4" /></div>
                  <div className="p-3 rounded-2xl bg-surface-50 dark:bg-surface-700/50 text-surface-900 dark:text-white rounded-tl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-brand-500" /> Thinking...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 border-t border-surface-200 dark:border-surface-700 flex gap-2">
              <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask anything about design..." className="input-field !py-2" />
              <button type="submit" disabled={loading} className="btn-primary !px-3 !py-2 shrink-0"><Send className="w-4 h-4" /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => setOpen(!open)} className="w-14 h-14 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-xl hover:scale-105 transition-transform flex items-center justify-center z-50">
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
}
