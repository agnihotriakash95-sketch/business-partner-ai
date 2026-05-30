import { Activity, CreditCard, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { useAuth } from '../../contexts/AuthContext';

const users = [
  { name: 'Akash Agnihotri', title: 'CEO & Founder', email: 'akash@businesspartner.ai', plan: 'Pro', status: 'Active' },
  { name: 'Meera Retail', email: 'meera@example.com', plan: 'Free', status: 'Trial' },
  { name: 'Enterprise Ops', email: 'ops@example.com', plan: 'Enterprise', status: 'Active' },
];

export const AdminPage = () => {
  const { profile } = useAuth();

  return (
    <div className="grid gap-6">
    <div>
      <h1 className="font-display text-3xl font-black">Admin Panel</h1>
      <p className="mt-2 text-neutral-500 dark:text-neutral-400">User management, subscription management, and analytics dashboard.</p>
    </div>
    <Card className="border-cyan-300/30 bg-slate-950 text-white">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-lg bg-cyan-300 font-black text-slate-950">AA</span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">Default Admin Account</p>
            <h2 className="mt-1 font-display text-2xl font-black">{profile.name}</h2>
            <p className="text-sm text-slate-300">{profile.title}</p>
          </div>
        </div>
        <Sparkles className="h-8 w-8 text-cyan-300" />
      </div>
    </Card>
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard title="Total Users" value="1,284" trend="+12% this month" icon={Users} />
      <StatCard title="MRR" value="INR 18.6L" trend="+9% this month" icon={CreditCard} />
      <StatCard title="AI Requests" value="42.8K" trend="Stable latency" icon={Activity} />
    </div>
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-gold-400" />
        <h2 className="font-display text-xl font-bold">Users</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-neutral-500 dark:text-neutral-400">
            <tr>
              <th className="py-3">Name</th>
              <th>Title</th>
              <th>Email</th>
              <th>Subscription</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email} className="border-t border-black/10 dark:border-white/10">
                <td className="py-4 font-semibold">{user.name}</td>
                <td>{'title' in user ? user.title : 'Team Member'}</td>
                <td>{user.email}</td>
                <td>{user.plan}</td>
                <td><span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500">{user.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
  );
};
