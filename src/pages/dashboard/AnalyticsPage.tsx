import { Download, LineChart, Radar, TrendingUp } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { demoCustomers, demoTransactions } from '../../data/demoData';
import { pendingDues, sumTransactions } from '../../utils/calculations';
import { currency } from '../../utils/formatters';
import { exportTextPdf } from '../../services/pdfService';

const revenueData = [
  { month: 'Jan', revenue: 520000, profit: 132000 },
  { month: 'Feb', revenue: 610000, profit: 188000 },
  { month: 'Mar', revenue: 575000, profit: 145000 },
  { month: 'Apr', revenue: 720000, profit: 241000 },
  { month: 'May', revenue: 860000, profit: 391000 },
];

const channelData = [
  { channel: 'Repeat', value: 46 },
  { channel: 'Referral', value: 22 },
  { channel: 'Ads', value: 18 },
  { channel: 'Organic', value: 14 },
];

export const AnalyticsPage = () => {
  const revenue = sumTransactions(demoTransactions, 'income');
  const expense = sumTransactions(demoTransactions, 'expense');
  const dues = pendingDues(demoCustomers);

  const exportAnalytics = () => {
    exportTextPdf('Business Analytics Report', [
      { heading: 'Revenue', lines: [`Monthly revenue: ${currency(revenue)}`, `Monthly expense: ${currency(expense)}`] },
      { heading: 'Cash Flow', lines: [`Pending dues: ${currency(dues)}`, 'Recovery priority: overdue customer follow-ups.'] },
      { heading: 'AI Insight', lines: ['Repeat customers are the highest-quality growth channel. Shift budget from low-return ads into retention and referrals.'] },
    ]);
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-black">Analytics</h1>
          <p className="mt-2 text-slate-400">Revenue analytics, growth score, health, recovery alerts, and exportable insights.</p>
        </div>
        <Button onClick={exportAnalytics}><Download className="h-4 w-4" /> Export PDF</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Growth Score" value="91" trend="+7 AI momentum points" icon={TrendingUp} />
        <StatCard title="Recovery Risk" value="Medium" trend={`${currency(dues)} pending`} icon={Radar} />
        <StatCard title="Forecast" value={currency(980000)} trend="Projected next month" icon={LineChart} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <Card className="border-cyan-300/20 bg-slate-950/80 text-white">
          <h2 className="font-display text-xl font-bold">Revenue and Profit Trend</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="cyanRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#67e8f9" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#67e8f9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
                <Tooltip formatter={(value) => currency(Number(value))} />
                <Area dataKey="revenue" stroke="#67e8f9" fill="url(#cyanRevenue)" strokeWidth={3} />
                <Area dataKey="profit" stroke="#22c55e" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="border-cyan-300/20 bg-slate-950/80 text-white">
          <h2 className="font-display text-xl font-bold">Growth Channels</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                <XAxis dataKey="channel" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#67e8f9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
