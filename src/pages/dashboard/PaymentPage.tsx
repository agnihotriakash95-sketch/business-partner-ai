import { Check, Crown, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { savePaymentRecord } from '../../services/firestoreService';
import { checkoutSubscription } from '../../services/paymentService';
import type { SubscriptionPlan } from '../../types';

const plans = [
  {
    id: 'pro' as SubscriptionPlan,
    name: 'Basic',
    amount: 499,
    price: '₹499',
    description: 'Starter plan for small businesses.',
    highlighted: false,
    features: ['AI Chat', 'Basic DPR', 'CRM Access', 'Analytics'],
  },
  {
    id: 'pro' as SubscriptionPlan,
    name: 'Pro',
    amount: 1999,
    price: '₹1,999',
    description: 'Best for growing startups.',
    highlighted: true,
    features: [
      'Unlimited AI Chat',
      'Professional DPR',
      'AI Voice Assistant',
      'Payment Gateway',
      'Analytics Dashboard',
    ],
  },
  {
    id: 'enterprise' as SubscriptionPlan,
    name: 'Enterprise',
    amount: 9999,
    price: '₹9,999',
    description: 'Large business solution.',
    highlighted: false,
    features: ['All Pro Features', 'Team Access', 'AI Automation', 'Custom Branding', 'Priority Support'],
  },
];

export const PaymentPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState('');
  const [status, setStatus] = useState('');

  const checkout = async (planId: SubscriptionPlan, amount: number, label: string) => {
    setLoadingPlan(label);
    setStatus('');
    try {
      const record = await checkoutSubscription(planId, amount, profile);
      await savePaymentRecord(record);
      if (record.status === 'success') {
        navigate('/dashboard/payment-success');
        return;
      }
      setStatus(
        record.status === 'demo'
          ? 'Demo payment recorded. Add Razorpay key for live checkout.'
          : 'Payment successful. Subscription updated.'
      );
    } catch (caught) {
      setStatus(caught instanceof Error ? caught.message : 'Payment failed.');
      navigate('/dashboard/payment-failed');
    } finally {
      setLoadingPlan('');
    }
  };

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border border-cyan-300/20 bg-slate-950/80 p-6 shadow-[0_0_60px_rgba(14,165,233,.14)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Membership</p>
        <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">Upgrade Membership</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Unlock premium AI tools, DPR generation, analytics, finance management, and unlimited reports.
          Current plan: <span className="font-semibold text-cyan-200">{profile.plan.toUpperCase()}</span>.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`grid content-between gap-6 border-cyan-300/20 bg-slate-950/80 text-white ${
              plan.highlighted ? 'border-cyan-300 shadow-[0_0_30px_rgba(34,211,238,.2)]' : ''
            } ${profile.plan === plan.id && plan.name === 'Pro' ? 'border-cyan-300' : ''}`}
          >
            <div>
              <div className="flex items-center justify-between">
                <h2 className={`font-display text-2xl font-bold ${plan.highlighted ? 'text-cyan-300' : ''}`}>
                  {plan.name}
                </h2>
                {profile.plan === plan.id && plan.name === 'Pro' ? (
                  <Crown className="h-5 w-5 text-cyan-300" />
                ) : null}
              </div>
              <p className="mt-2 text-sm text-slate-400">{plan.description}</p>
              <p className="mt-6 font-display text-4xl font-black text-cyan-300">
                {plan.price}
                <span className="text-base font-semibold text-slate-400"> /month</span>
              </p>
              <div className="mt-6 grid gap-3">
                {plan.features.map((feature) => (
                  <span key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="h-4 w-4 shrink-0 text-cyan-300" /> {feature}
                  </span>
                ))}
              </div>
            </div>
            <Button
              className="w-full"
              variant={plan.highlighted ? 'primary' : 'secondary'}
              loading={loadingPlan === plan.name}
              onClick={() => checkout(plan.id, plan.amount, plan.name)}
            >
              {plan.name === 'Enterprise' ? 'Contact Sales' : plan.name === 'Pro' ? 'Upgrade Now' : 'Buy Now'}
            </Button>
          </Card>
        ))}
      </div>

      {status ? (
        <Card className="border-cyan-300/20 bg-slate-950/80 text-cyan-100">{status}</Card>
      ) : (
        <Card className="flex items-center gap-3 border-cyan-300/20 bg-slate-950/80 text-slate-300">
          <Sparkles className="h-5 w-5 text-cyan-300" />
          <p className="text-sm">
            Secure Razorpay checkout. Demo mode works without keys; production uses Firebase Functions for order creation.
          </p>
        </Card>
      )}
    </div>
  );
};
