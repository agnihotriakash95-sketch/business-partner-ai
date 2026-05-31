import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  BadgeDollarSign,
  BellRing,
  BrainCircuit,
  CalendarClock,
  Rocket,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { OpenAIKeyWarning } from '../../components/ai/OpenAIKeyWarning';
import { InteractiveChartCard } from '../../components/ai/InteractiveChartCard';
import { InteractiveStatCard } from '../../components/ai/InteractiveStatCard';
import { useAIAssistant } from '../../contexts/AIAssistantContext';
import { useAuth } from '../../contexts/AuthContext';
import { useBusinessData } from '../../contexts/BusinessDataContext';
import { generateEnterpriseForecast, isOpenAIConfigured } from '../../services/openaiService';
import { buildBusinessMetrics } from '../../utils/analyticsEngine';
import { currency } from '../../utils/formatters';

export const DashboardHome = () => {
  const { profile } = useAuth();
  const { transactions, customers, loading: dataLoading } = useBusinessData();
  const { explainMetric, loadDashboardInsights, loadGrowthAdvisor, dashboardInsights, growthAdvisor, loading: aiLoading } =
    useAIAssistant();

  const metrics = useMemo(
    () => buildBusinessMetrics(transactions, customers, profile.name),
    [transactions, customers, profile.name]
  );

  const [forecast, setForecast] = useState<{ forecast: string; growthScore: number; riskScore: number } | null>(null);

  useEffect(() => {
    if (!isOpenAIConfigured() || dataLoading || !transactions.length) return;
    void loadDashboardInsights(metrics);
    void loadGrowthAdvisor(metrics);
    generateEnterpriseForecast(metrics)
      .then(setForecast)
      .catch(() => undefined);
  }, [metrics, dataLoading, transactions.length, loadDashboardInsights, loadGrowthAdvisor]);

  const trendLabel = (pct: number) => `${pct >= 0 ? '+' : ''}${pct}% vs prior period`;

  const chartData = metrics.monthlyTrend.length
    ? metrics.monthlyTrend
    : [{ month: 'No data', revenue: 0, expense: 0, profit: 0 }];

  if (!isOpenAIConfigured()) {
    return (
      <div className="grid gap-6">
        <OpenAIKeyWarning />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-slate-950/90 via-slate-950/80 to-cyan-950/30 p-6 shadow-[0_0_60px_rgba(14,165,233,.14)] backdrop-blur-xl"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Enterprise AI Business OS</p>
        <h1 className="mt-2 font-display text-3xl font-black sm:text-5xl">Welcome, {profile.name}</h1>
        <p className="mt-2 text-cyan-100">{profile.title}</p>
        <p className="mt-4 max-w-3xl text-slate-400">
          Real-time AI analysis of revenue, cashflow, customer risk, and growth — click any metric for voice-powered CFO
          insights.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InteractiveStatCard
          title="Monthly Revenue"
          value={currency(metrics.revenue)}
          trend={trendLabel(metrics.revenueChangePercent)}
          icon={TrendingUp}
          loading={aiLoading}
          onAnalyze={() =>
            void explainMetric('Monthly Revenue', {
              revenue: metrics.revenue,
              changePercent: metrics.revenueChangePercent,
              trend: metrics.monthlyTrend,
            })
          }
        />
        <InteractiveStatCard
          title="Monthly Expenses"
          value={currency(metrics.expenses)}
          trend={trendLabel(metrics.expenseChangePercent)}
          icon={TrendingDown}
          loading={aiLoading}
          onAnalyze={() =>
            void explainMetric('Monthly Expenses', {
              expenses: metrics.expenses,
              changePercent: metrics.expenseChangePercent,
              topCategories: metrics.topCategories,
            })
          }
        />
        <InteractiveStatCard
          title="Net Profit"
          value={currency(metrics.profit)}
          trend={`${metrics.margin}% net margin`}
          icon={BadgeDollarSign}
          highlight
          loading={aiLoading}
          onAnalyze={() =>
            void explainMetric('Net Profit', {
              profit: metrics.profit,
              margin: metrics.margin,
              revenue: metrics.revenue,
              expenses: metrics.expenses,
              cashflowStatus: metrics.cashflowStatus,
            })
          }
        />
        <InteractiveStatCard
          title="Customers"
          value={String(metrics.customerCount)}
          trend={`${currency(metrics.pendingDues)} pending · ${metrics.retentionRate}% retention`}
          icon={Users}
          loading={aiLoading}
          onAnalyze={() =>
            void explainMetric('Customer Portfolio', {
              customerCount: metrics.customerCount,
              overdueCount: metrics.overdueCount,
              pendingDues: metrics.pendingDues,
              retentionRate: metrics.retentionRate,
            })
          }
        />
      </div>

      {dashboardInsights.length ? (
        <div className="grid gap-4 md:grid-cols-3">
          {dashboardInsights.map((item, index) => {
            const icons = [BrainCircuit, BellRing, CalendarClock];
            const Icon = icons[index % icons.length];
            return (
              <motion.button
                key={item.title}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                onClick={() => void explainMetric(item.title, { insight: item.insight, metrics })}
                className="rounded-2xl border border-cyan-300/20 bg-slate-950/80 p-5 text-left backdrop-blur-sm transition hover:border-cyan-300/40"
              >
                <Icon className="mb-4 h-7 w-7 text-cyan-300" />
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.insight}</p>
                <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-cyan-300">
                  <Sparkles className="h-3.5 w-3.5" /> Tap for voice briefing
                </p>
              </motion.button>
            );
          })}
        </div>
      ) : dataLoading || aiLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : !transactions.length ? (
        <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-8 text-center">
          <p className="text-slate-400">
            Add transactions in Finance and customers in CRM to activate AI-powered enterprise analytics.
          </p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_.6fr]">
        <InteractiveChartCard
          title="Revenue vs Expense"
          subtitle="Click chart or use AI Explain for voice analysis"
          loading={aiLoading}
          onAnalyze={() =>
            void explainMetric('Revenue vs Expense Chart', {
              monthlyTrend: metrics.monthlyTrend,
              revenueChange: metrics.revenueChangePercent,
              expenseChange: metrics.expenseChangePercent,
            })
          }
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                onClick={(state) => {
                  if (state?.activePayload?.[0]?.payload) {
                    void explainMetric('Chart Data Point', state.activePayload[0].payload as Record<string, unknown>);
                  }
                }}
              >
                <defs>
                  <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#67e8f9" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#67e8f9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis tickFormatter={(v) => `${Number(v) / 1000}k`} stroke="#64748b" />
                <Tooltip formatter={(v) => currency(Number(v))} contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
                <Area type="monotone" dataKey="revenue" stroke="#67e8f9" fill="url(#revenue)" strokeWidth={3} />
                <Area type="monotone" dataKey="expense" stroke="#94a3b8" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </InteractiveChartCard>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-cyan-300/20 bg-slate-950/80 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-3">
              <Activity className="h-6 w-6 text-cyan-300" />
              <h2 className="font-display text-xl font-bold">Business Health</h2>
            </div>
            <button
              type="button"
              onClick={() =>
                void explainMetric('Business Health Score', {
                  healthScore: metrics.healthScore,
                  cashflowStatus: metrics.cashflowStatus,
                  margin: metrics.margin,
                })
              }
              className="relative mx-auto grid aspect-square max-h-52 w-full max-w-52 place-items-center rounded-full border-[18px] border-cyan-300/20 shadow-[inset_0_0_50px_rgba(103,232,249,.12)] transition hover:border-cyan-300/40"
            >
              <span className="font-display text-6xl font-black text-cyan-300">{metrics.healthScore}</span>
            </button>
            {forecast ? (
              <div className="mt-5 rounded-xl bg-cyan-300/10 p-4">
                <div className="flex items-center gap-2 font-semibold text-cyan-200">
                  <Rocket className="h-4 w-4" /> Growth {forecast.growthScore} · Risk {forecast.riskScore}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{forecast.forecast}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {growthAdvisor ? (
        <div className="rounded-2xl border border-cyan-300/20 bg-slate-950/80 p-6 backdrop-blur-sm">
          <h2 className="font-display text-xl font-bold text-white">AI Growth Advisor</h2>
          <p className="mt-1 text-sm text-slate-400">Strategic recommendations from your live business data</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {(
              [
                ['Growth', growthAdvisor.growthStrategies],
                ['Marketing', growthAdvisor.marketingPlans],
                ['Sales', growthAdvisor.salesImprovements],
                ['Funding', growthAdvisor.fundingReadiness],
              ] as const
            ).map(([label, items]) => (
              <div key={label} className="rounded-xl bg-white/5 p-4">
                <h3 className="text-sm font-bold text-cyan-300">{label}</h3>
                <ul className="mt-3 grid gap-2 text-sm text-slate-300">
                  {items.slice(0, 2).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
