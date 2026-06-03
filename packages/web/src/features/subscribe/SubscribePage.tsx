import { useState } from 'react';
import { FiLock, FiCheck, FiStar } from 'react-icons/fi';

const TIERS = [
  {
    name: 'Free',
    price: 0,
    features: ['Basic feed access', 'Join public meetings', '5 min recording', 'Standard quality'],
    color: 'border-slate-700',
    bg: 'bg-slate-800',
    cta: 'Current Plan',
  },
  {
    name: 'Creator',
    price: 9.99,
    features: ['HD streaming', '60 min recording', 'Monetization tools', 'Analytics dashboard', 'Priority support'],
    color: 'border-indigo-600',
    bg: 'bg-indigo-950',
    cta: 'Subscribe $9.99/mo',
    popular: true,
  },
  {
    name: 'Universe',
    price: 29.99,
    features: ['4K streaming', 'Unlimited recording', 'AI recommendations', 'Custom domain', 'Dedicated server', 'Early access features'],
    color: 'border-purple-600',
    bg: 'bg-purple-950',
    cta: 'Subscribe $29.99/mo',
  },
];

export default function SubscribePage() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="pt-12 px-4 pb-20">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Unlock the Universe</h2>
        <p className="text-slate-400 text-sm">Choose your plan and start creating</p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        {TIERS.map((tier, i) => (
          <div
            key={i}
            className={`${tier.bg} ${tier.color} border rounded-2xl p-5 relative ${tier.popular ? 'ring-2 ring-indigo-500/50' : ''}`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{tier.name}</span>
                  {tier.name === 'Free' ? null : tier.name === 'Creator' ? <FiStar size={16} className="text-indigo-400" /> : <FiLock size={16} className="text-purple-400" />}
                </div>
                <p className="text-2xl font-bold mt-1">
                  {tier.price === 0 ? 'Free' : '$' + tier.price}
                  {tier.price > 0 && <span className="text-sm font-normal text-slate-400">/mo</span>}
                </p>
              </div>
              {tier.name !== 'Free' && (
                <button
                  onClick={() => setSelected(i)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    selected === i
                      ? 'bg-indigo-600 text-white'
                      : 'border border-slate-600 text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {selected === i ? (
                    <span className="flex items-center gap-1"><FiCheck size={14} /> Selected</span>
                  ) : tier.cta}
                </button>
              )}
            </div>

            <ul className="space-y-2">
              {tier.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                  <FiCheck size={14} className="text-green-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {selected !== null && (
        <div className="max-w-sm mx-auto mt-6">
          <button className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-bold text-lg">
            Continue with Stripe
          </button>
          <p className="text-center text-xs text-slate-500 mt-2">
            Secured by Stripe · Cancel anytime
          </p>
        </div>
      )}
    </div>
  );
}
