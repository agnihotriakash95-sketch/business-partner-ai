import { Check, Crown } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';

const plans = [
  { id: 'free', name: 'Free', price: 'INR 0', features: ['Dashboard demo', 'Basic reports', 'Limited AI'] },
  { id: 'pro', name: 'Pro', price: 'INR 1,999/mo', features: ['Unlimited reports', 'Collections AI', 'Finance analytics', 'Priority insights'] },
  { id: 'enterprise', name: 'Enterprise', price: 'Custom', features: ['Admin panel', 'Team seats', 'Custom workflows', 'SLA support'] },
];

export const SubscriptionPage = () => {
  const { profile } = useAuth();
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-black">Subscription System</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">Choose Free, Pro, or Enterprise. Current plan: {profile.plan.toUpperCase()}.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={profile.plan === plan.id ? 'border-gold-400' : ''}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">{plan.name}</h2>
              {profile.plan === plan.id ? <Crown className="h-5 w-5 text-gold-400" /> : null}
            </div>
            <p className="mt-4 text-3xl font-black">{plan.price}</p>
            <div className="mt-6 grid gap-3">
              {plan.features.map((feature) => (
                <span key={feature} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-gold-400" /> {feature}</span>
              ))}
            </div>
            <Button className="mt-6 w-full" variant={profile.plan === plan.id ? 'secondary' : 'primary'}>{profile.plan === plan.id ? 'Active' : 'Upgrade'}</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
