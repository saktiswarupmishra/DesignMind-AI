import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Palette, Crown, Image, Megaphone, PenTool, Zap, ArrowRight, Star, Check } from 'lucide-react';

const features = [
  { icon: Sparkles, title: 'AI Design Generator', desc: 'Create stunning designs from text prompts', color: 'from-brand-500 to-brand-700' },
  { icon: Palette, title: 'Color Palette Engine', desc: 'Generate perfect color schemes with AI', color: 'from-accent-teal to-emerald-600' },
  { icon: Crown, title: 'Logo Generator', desc: 'Professional logo concepts in seconds', color: 'from-accent-gold to-orange-500' },
  { icon: Image, title: 'Thumbnail Creator', desc: 'Eye-catching thumbnails that drive clicks', color: 'from-accent-pink to-rose-600' },
  { icon: Megaphone, title: 'Social Media Creator', desc: 'Content for every platform, instantly', color: 'from-blue-500 to-indigo-600' },
  { icon: PenTool, title: 'Brand Identity Kit', desc: 'Complete branding in one click', color: 'from-purple-500 to-pink-500' },
];

const plans = [
  { name: 'Free', price: '$0', period: '/month', features: ['5 AI Generations/day', '3 Projects', 'Basic Templates', 'Community Support'], highlighted: false },
  { name: 'Professional', price: '$29', period: '/month', features: ['Unlimited AI Generations', '50 Projects', 'Premium Templates', 'Priority Support', 'Brand Identity Kit', 'Team Collaboration'], highlighted: true },
  { name: 'Enterprise', price: '$99', period: '/month', features: ['Everything in Pro', 'Unlimited Projects', 'Custom AI Models', 'Dedicated Account Manager', 'API Access', 'White-label Option'], highlighted: false },
];

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200/50 dark:border-surface-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-hero-gradient flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-surface-900 dark:text-white">DesignMind AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-surface-700 dark:text-surface-200 hover:text-brand-500 transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-surface-700 dark:text-surface-200 hover:text-brand-500 transition-colors">Pricing</a>
            <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm !py-2.5">Get Started Free <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-1/4 w-80 h-80 bg-accent-teal/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-accent-pink/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div {...fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-semibold mb-6">
              <Zap className="w-4 h-4" /> Powered by Advanced AI
            </span>
          </motion.div>

          <motion.h1 {...fadeUp} transition={{ delay: 0.1, duration: 0.6 }}
            className="font-heading text-5xl md:text-7xl font-black text-surface-900 dark:text-white leading-tight mb-6"
          >
            Your Intelligent<br />
            <span className="gradient-text">Creative Design</span><br />
            Partner
          </motion.h1>

          <motion.p {...fadeUp} transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-surface-700 dark:text-surface-200/70 max-w-2xl mx-auto mb-10"
          >
            Create professional graphics, branding assets, social media content, and marketing creatives using AI. One platform, infinite possibilities.
          </motion.p>

          <motion.div {...fadeUp} transition={{ delay: 0.3, duration: 0.6 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary text-lg !px-8 !py-4">
              Start Creating Free <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="btn-secondary text-lg !px-8 !py-4">
              See What AI Can Do
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeUp} transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[{ num: '50K+', label: 'Designers' }, { num: '2M+', label: 'Designs Created' }, { num: '99%', label: 'Satisfaction' }].map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-3xl font-bold gradient-text">{stat.num}</p>
                <p className="text-sm text-surface-200/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-surface-50 dark:bg-surface-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-surface-900 dark:text-white mb-4">
              AI-Powered Design Tools
            </h2>
            <p className="text-lg text-surface-200/70 max-w-2xl mx-auto">
              Everything you need to create stunning visuals, all powered by cutting-edge artificial intelligence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="glass-card p-6 group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-surface-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-surface-200/70 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-surface-900 dark:text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-surface-200/70">Start free, upgrade as you grow</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`rounded-2xl p-8 ${plan.highlighted
                  ? 'bg-gradient-to-b from-brand-500 to-brand-700 text-white shadow-2xl shadow-brand-500/30 scale-105'
                  : 'glass-card'
                }`}
              >
                {plan.highlighted && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-4">
                    <Star className="w-3 h-3" /> Most Popular
                  </span>
                )}
                <h3 className={`font-heading text-xl font-bold ${plan.highlighted ? 'text-white' : 'text-surface-900 dark:text-white'}`}>{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className={`text-4xl font-black ${plan.highlighted ? 'text-white' : 'text-surface-900 dark:text-white'}`}>{plan.price}</span>
                  <span className={`text-sm ${plan.highlighted ? 'text-white/70' : 'text-surface-200/50'}`}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlighted ? 'text-white/90' : 'text-surface-700 dark:text-surface-200'}`}>
                      <Check className="w-4 h-4 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${plan.highlighted
                    ? 'bg-white text-brand-600 hover:bg-white/90'
                    : 'btn-primary'
                  }`}
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-surface-200 dark:border-surface-700">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-lg text-surface-900 dark:text-white">DesignMind AI</span>
          </div>
          <p className="text-sm text-surface-200/50">© 2026 DesignMind AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
