import { Check, Crown, ReceiptIndianRupee } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { savePaymentRecord } from '../../services/firestoreService';
import { checkoutSubscription } from '../../services/paymentService';
import type { PaymentRecord, SubscriptionPlan } from '../../types';

const plans = [
  { id: 'free' as SubscriptionPlan, name: 'Free', amount: 0, price: 'INR 0', features: ['Dashboard access', 'Basic reports', 'Limited AI'] },
  { id: 'pro' as SubscriptionPlan, name: 'Pro', amount: 1999, price: 'INR 1,999/mo', features: ['Unlimited reports', 'Collections AI', 'Finance analytics', 'Priority insights'] },
  { id: 'enterprise' as SubscriptionPlan, name: 'Enterprise', amount: 9999, price: 'INR 9,999/mo', features: ['Admin panel', 'Team seats', 'Custom workflows', 'SLA support'] },
];

export const SubscriptionPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState('');
  const [billingHistory, setBillingHistory] = useState<PaymentRecord[]>([]);
  const [status, setStatus] = useState('');

  const checkout = async (plan: SubscriptionPlan, amount: number) => {
    if (amount === 0) {
      setStatus('Free plan is active.');
      return;
    }
    setLoadingPlan(plan);
    setStatus('');
    try {
      const record = await checkoutSubscription(plan, amount, profile);
      setBillingHistory((current) => [record, ...current]);
      await savePaymentRecord(record);
      setStatus(record.status === 'success' ? 'Payment successful. Subscription updated.' : 'Payment recorded.');
      if (record.status === 'success') navigate('/dashboard/payment-success');
    } catch (caught) {
      const failed: PaymentRecord = {
        id: crypto.randomUUID(),
        ownerId: profile.id,
        plan,
        amount,
        status: 'failed',
        provider: 'razorpay',
        createdAt: new Date().toISOString(),
      };
      setBillingHistory((current) => [failed, ...current]);
      await savePaymentRecord(failed);
      setStatus(caught instanceof Error ? caught.message : 'Payment failed.');
      navigate('/dashboard/payment-failed');
    } finally {
      setLoadingPlan('');
    }
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-black">Subscription System</h1>
        <p className="mt-2 text-slate-400">Razorpay checkout for Free, Pro, and Enterprise. Current plan: {profile.plan.toUpperCase()}.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={`border-cyan-300/20 bg-slate-950/80 text-white ${profile.plan === plan.id ? 'border-cyan-300' : ''}`}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">{plan.name}</h2>
              {profile.plan === plan.id ? <Crown className="h-5 w-5 text-cyan-300" /> : null}
            </div>
            <p className="mt-4 text-3xl font-black">{plan.price}</p>
            <div className="mt-6 grid gap-3">
              {plan.features.map((feature) => (
                <span key={feature} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-cyan-300" /> {feature}</span>
              ))}
            </div>
            <Button className="mt-6 w-full" loading={loadingPlan === plan.id} variant={profile.plan === plan.id ? 'secondary' : 'primary'} onClick={() => checkout(plan.id, plan.amount)}>
              {profile.plan === plan.id ? 'Active' : `Pay with Razorpay`}
            </Button>
          </Card>
        ))}
      </div>
      {status ? <Card className="border-cyan-300/20 bg-slate-950/80 text-cyan-100">{status}</Card> : null}
      <Card className="border-cyan-300/20 bg-slate-950/80 text-white">
        <div className="mb-4 flex items-center gap-2">
          <ReceiptIndianRupee className="h-5 w-5 text-cyan-300" />
          <h2 className="font-display text-xl font-bold">Billing History</h2>
        </div>
        <div className="grid gap-3">
          {billingHistory.length ? billingHistory.map((record) => (
            <div key={record.id} className="grid gap-2 rounded-lg bg-white/10 p-3 text-sm sm:grid-cols-4">
              <span>{record.plan.toUpperCase()}</span>
              <span>INR {record.amount.toLocaleString('en-IN')}</span>
              <span className={record.status === 'success' ? 'text-emerald-300' : 'text-red-300'}>{record.status}</span>
              <span className="text-slate-400">{new Date(record.createdAt).toLocaleString('en-IN')}</span>
            </div>
          )) : <p className="text-sm text-slate-400">No payments yet. Your transaction history will appear here.</p>}
        </div>
      </Card>
    </div>
  );
};
