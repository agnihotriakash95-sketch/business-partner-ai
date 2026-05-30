import { Activity, BadgeDollarSign, BellRing, BrainCircuit, CalendarClock, Rocket, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { demoCustomers, demoTransactions } from '../../data/demoData';
import { useAuth } from '../../contexts/AuthContext';
import { calculateHealthScore, pendingDues, sumTransactions } from '../../utils/calculations';
import { currency } from '../../utils/formatters';

const chartData = [
  { month: 'Jan', revenue: 520000, expense: 390000 },
  { month: 'Feb', revenue: 610000, expense: 420000 },
  { month: 'Mar', revenue: 575000, expense: 430000 },
  { month: 'Apr', revenue: 720000, expense: 480000 },
  { month: 'May', revenue: 860000, expense: 469000 },
];

export const DashboardHome = () => {
  const { profile } = useAuth();
  const revenue = sumTransactions(demoTransactions, 'income');
  const expenses = sumTransactions(demoTransactions, 'expense');
  const profit = revenue - expenses;
  const dues = pendingDues(demoCustomers);
  const health = calculateHealthScore(revenue, expenses, dues, 14);

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border border-cyan-300/20 bg-slate-950/80 p-6 shadow-[0_0_60px_rgba(14,165,233,.14)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">AI Business Operating System</p>
        <h1 className="mt-2 font-display text-3xl font-black sm:text-5xl">Welcome, {profile.name}</h1>
        <p className="mt-2 text-cyan-100">{profile.title}</p>
        <p className="mt-4 max-w-3xl text-slate-400">Revenue, expenses, profit, customer dues, recovery alerts, and AI-powered business health in one futuristic command center.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Monthly Revenue" value={currency(revenue)} trend="+18% from last month" icon={TrendingUp} />
        <StatCard title="Monthly Expenses" value={currency(expenses)} trend="-4% operational leakage" icon={TrendingDown} />
        <StatCard title="Profit" value={currency(profit)} trend={`${Math.round((profit / revenue) * 100)}% net margin`} icon={BadgeDollarSign} />
        <StatCard title="Customers" value={String(demoCustomers.length)} trend={`${currency(dues)} pending dues`} icon={Users} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: BrainCircuit, title: 'AI Insight', text: 'Shift 15% low-return ad budget into repeat customer offers this week.' },
          { icon: BellRing, title: 'Recovery Alert', text: `${currency(dues)} pending dues can affect working capital if delayed.` },
          { icon: CalendarClock, title: 'Upcoming Payments', text: '2 customer follow-ups and 1 vendor payment due in the next 7 days.' },
        ].map((item) => (
          <Card key={item.title} className="border-cyan-300/20 bg-slate-950/80 text-white">
            <item.icon className="mb-4 h-7 w-7 text-cyan-300" />
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_.6fr]">
        <Card className="border-cyan-300/20 bg-slate-950/80 text-white">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">Revenue vs Expense</h2>
              <p className="text-sm text-slate-400">Monthly cash movement</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#67e8f9" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#67e8f9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
                <Tooltip formatter={(value) => currency(Number(value))} />
                <Area type="monotone" dataKey="revenue" stroke="#67e8f9" fill="url(#revenue)" strokeWidth={3} />
                <Area type="monotone" dataKey="expense" stroke="#737373" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="grid content-between gap-6 border-cyan-300/20 bg-slate-950/80 text-white">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Activity className="h-6 w-6 text-cyan-300" />
              <h2 className="font-display text-xl font-bold">Business Health Score</h2>
            </div>
            <div className="relative grid aspect-square max-h-64 place-items-center rounded-full border-[18px] border-cyan-300/20 shadow-[inset_0_0_50px_rgba(103,232,249,.12)]">
              <span className="font-display text-6xl font-black text-cyan-300">{health}</span>
            </div>
          </div>
          <div className="rounded-lg bg-cyan-300/10 p-4">
            <div className="flex items-center gap-2 font-semibold text-cyan-200"><Rocket className="h-4 w-4" /> Growth score: 91</div>
            <p className="mt-2 text-sm leading-6 text-slate-300">Strong profit momentum. Reduce pending dues and track marketing ROI weekly to move into the excellent zone.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
