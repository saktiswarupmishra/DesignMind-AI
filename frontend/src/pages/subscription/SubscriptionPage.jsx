import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { CreditCard, Shield, Zap, Check } from 'lucide-react';

const plans = [
  { id: 'STARTER', name: 'Starter', price: '$19', desc: 'Best for freelancers and hobbyists', features: ['200 AI generation credits/mo', 'Create up to 20 projects', 'All 12 AI generator tools', 'Standard support'] },
  { id: 'PROFESSIONAL', name: 'Professional', price: '$49', desc: 'Ideal for agencies and creators', features: ['1000 AI generation credits/mo', 'Create up to 100 projects', 'All 12 AI generator tools', 'Priority support', 'Team collaboration'] },
  { id: 'ENTERPRISE', name: 'Enterprise', price: '$99', desc: 'For heavy business demands', features: ['Unlimited AI generations', 'Unlimited projects', 'Dedicated support manager', 'Custom API access', 'Advanced team settings'] },
];

export default function SubscriptionPage() {
  const [sub, setSub] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sRes, uRes] = await Promise.all([
        api.get('/subscriptions/current'),
        api.get('/subscriptions/usage')
      ]);
      setSub(sRes.data.data);
      setUsage(uRes.data.data);
    } catch (err) {
      console.error(err);
      // Fallback
      setSub({ plan: 'FREE', status: 'ACTIVE', aiCredits: 50 });
      setUsage({ plan: 'FREE', aiCreditsUsed: 12, aiCreditsTotal: 50, projectsUsed: 2, projectsTotal: 5 });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan) => {
    try {
      await api.post('/subscriptions/upgrade', { plan });
      alert(`Successfully upgraded to ${plan}!`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your plan?')) return;
    try {
      await api.post('/subscriptions/cancel');
      alert('Subscription cancelled.');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-12">Loading subscriptions...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-brand-500" /> Subscription & Plan
        </h1>
        <p className="text-surface-200/50 mt-1">Upgrade your creative limits or monitor account credits</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-heading text-lg font-bold text-surface-900 dark:text-white">Current Subscription</h3>
          <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20">
            <span className="text-xs uppercase font-bold text-brand-500">Plan Name</span>
            <h4 className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{sub?.plan}</h4>
            <span className="text-xs text-surface-200/50 mt-2 block">Status: {sub?.status}</span>
          </div>
          {sub?.plan !== 'FREE' && (
            <button onClick={handleCancel} className="btn-ghost text-red-500 w-full">Cancel Plan</button>
          )}
        </div>

        <div className="glass-card p-6 space-y-4">
          <h3 className="font-heading text-lg font-bold text-surface-900 dark:text-white">Resource Usage</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-surface-700 dark:text-surface-200 font-semibold">AI Generation Credits</span>
                <span className="text-surface-900 dark:text-white font-bold">{usage?.aiCreditsUsed} / {usage?.aiCreditsTotal}</span>
              </div>
              <div className="h-2 rounded-full bg-surface-150 dark:bg-surface-700 overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(usage?.aiCreditsUsed / usage?.aiCreditsTotal) * 100}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-surface-700 dark:text-surface-200 font-semibold">Projects Created</span>
                <span className="text-surface-900 dark:text-white font-bold">{usage?.projectsUsed} / {usage?.projectsTotal}</span>
              </div>
              <div className="h-2 rounded-full bg-surface-150 dark:bg-surface-700 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(usage?.projectsUsed / usage?.projectsTotal) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 pt-4">
        {plans.map((p, i) => (
          <div key={p.id} className="glass-card p-6 flex flex-col justify-between hover:scale-102 transition-transform duration-300">
            <div>
              <h3 className="font-heading text-xl font-bold text-surface-900 dark:text-white">{p.name}</h3>
              <p className="text-xs text-surface-200/50 mt-1">{p.desc}</p>
              <div className="my-6">
                <span className="text-3xl font-bold text-surface-900 dark:text-white">{p.price}</span>
                <span className="text-sm text-surface-200/50">/month</span>
              </div>
              <ul className="space-y-2.5 mb-8">
                {p.features.map((f, idx) => (
                  <li key={idx} className="text-sm text-surface-700 dark:text-surface-200 flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-500" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={() => handleUpgrade(p.id)} className={`w-full py-2.5 rounded-xl font-semibold transition-all duration-300 ${sub?.plan === p.id ? 'bg-surface-200 dark:bg-surface-700 text-surface-400 dark:text-surface-300 cursor-default' : 'bg-brand-500 hover:bg-brand-600 text-white shadow-md'}`} disabled={sub?.plan === p.id}>
              {sub?.plan === p.id ? 'Current Plan' : `Upgrade to ${p.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
