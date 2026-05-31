import { useEffect, useMemo, useState } from 'react';
import { Download, LineChart, Radar, Sparkles, TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { motion } from 'framer-motion';
import { OpenAIKeyWarning } from '../../components/ai/OpenAIKeyWarning';
import { InteractiveChartCard } from '../../components/ai/InteractiveChartCard';
import { InteractiveStatCard } from '../../components/ai/InteractiveStatCard';
import { Button } from '../../components/ui/Button';
import { useAIAssistant } from '../../contexts/AIAssistantContext';
import { useAuth } from '../../contexts/AuthContext';
import { useBusinessData } from '../../contexts/BusinessDataContext';
import { exportTextPdf } from '../../services/pdfService';
import { generateEnterpriseForecast, isOpenAIConfigured } from '../../services/openaiService';
import { buildBusinessMetrics, buildCategoryBreakdown } from '../../utils/analyticsEngine';
import { currency } from '../../utils/formatters';

const CHANNEL_COLORS = ['#67e8f9', '#22d3ee', '#0ea5e9', '#38bdf8', '#7dd3fc'];

export const AnalyticsPage = () => {
  const { profile } = useAuth();
  const { transactions, customers } = useBusinessData();
  const { explainMetric, loading: aiLoading } = useAIAssistant();
  const metrics = useMemo(
    () => buildBusinessMetrics(transactions, customers, profile.name),
    [transactions, customers, profile.name]
  );
  const categoryData = useMemo(() => buildCategoryBreakdown(transactions), [transactions]);
  const [scores, setScores] = useState<{ growthScore: number; riskScore: number; prediction: string } | null>(null);

  useEffect(() => {
    if (!isOpenAIConfigured() || !transactions.length) return;
    generateEnterpriseForecast(metrics)
      .then((r) => setScores({ growthScore: r.growthScore, riskScore: r.riskScore, prediction: r.prediction }))
      .catch(() => undefined);
  }, [metrics, transactions.length]);

  const exportAnalytics = () => {
    exportTextPdf('Enterprise Analytics Report', [
      { heading: 'Revenue', lines: [`${currency(metrics.revenue)} (${metrics.revenueChangePercent}% change)`] },
      { heading: 'Profit', lines: [`${currency(metrics.profit)} at ${metrics.margin}% margin`] },
      { heading: 'Cashflow', lines: [`Status: ${metrics.cashflowStatus}`, `Pending: ${currency(metrics.pendingDues)}`] },
      { heading: 'AI Forecast', lines: [scores?.prediction || 'Run analytics with transaction data for AI forecast.'] },
    ]);
  };

  const channelData = categoryData.length
    ? categoryData.map((c) => ({ channel: c.name, value: c.amount }))
    : [{ channel: 'No data', value: 1 }];

  if (!isOpenAIConfigured()) {
    return (
      <div className="grid gap-6">
        <OpenAIKeyWarning />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-black">Enterprise Analytics</h1>
          <p className="mt-2 text-slate-400">
            AI-powered revenue, cashflow, retention, forecasting, and risk scoring — click any metric for voice insights.
          </p>
        </div>
        <Button onClick={exportAnalytics}>
          <Download className="h-4 w-4" /> Export PDF
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InteractiveStatCard
          title="Growth Score"
          value={scores ? String(scores.growthScore) : '—'}
          trend={scores ? 'AI-calculated from live data' : 'Add transactions to compute'}
          icon={TrendingUp}
          highlight
          loading={aiLoading}
          onAnalyze={() =>
            void explainMetric('Growth Score', { growthScore: scores?.growthScore, metrics, prediction: scores?.prediction })
          }
        />
        <InteractiveStatCard
          title="Risk Score"
          value={scores ? String(scores.riskScore) : '—'}
          trend={`${metrics.overdueCount} overdue accounts`}
          icon={Radar}
          loading={aiLoading}
          onAnalyze={() =>
            void explainMetric('Risk Score', {
              riskScore: scores?.riskScore,
              overdueCount: metrics.overdueCount,
              pendingDues: metrics.pendingDues,
              cashflowStatus: metrics.cashflowStatus,
            })
          }
        />
        <InteractiveStatCard
          title="Revenue Forecast"
          value={currency(metrics.revenue * (1 + metrics.revenueChangePercent / 100))}
          trend={`${metrics.revenueChangePercent}% momentum`}
          icon={LineChart}
          loading={aiLoading}
          onAnalyze={() => void explainMetric('Revenue Forecast', { metrics, scores })}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <InteractiveChartCard
          title="Revenue & Profit Trend"
          subtitle="Interactive — click data points for AI voice analysis"
          loading={aiLoading}
          onAnalyze={() => void explainMetric('Revenue & Profit Trend', { monthlyTrend: metrics.monthlyTrend, metrics })}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={metrics.monthlyTrend.length ? metrics.monthlyTrend : [{ month: '—', revenue: 0, profit: 0 }]}
                onClick={(s) => {
                  if (s?.activePayload?.[0]?.payload) {
                    void explainMetric('Profit Trend Point', s.activePayload[0].payload as Record<string, unknown>);
                  }
                }}
              >
                <defs>
                  <linearGradient id="cyanRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#67e8f9" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#67e8f9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis tickFormatter={(v) => `${Number(v) / 1000}k`} stroke="#64748b" />
                <Tooltip formatter={(v) => currency(Number(v))} contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
                <Area dataKey="revenue" stroke="#67e8f9" fill="url(#cyanRevenue)" strokeWidth={3} />
                <Area dataKey="profit" stroke="#22c55e" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </InteractiveChartCard>

        <InteractiveChartCard
          title="Expense by Category"
          loading={aiLoading}
          onAnalyze={() => void explainMetric('Expense Categories', { categories: categoryData, metrics })}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  dataKey="value"
                  nameKey="channel"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  onClick={(_, index) => {
                    const item = channelData[index];
                    if (item) void explainMetric(`Category: ${item.channel}`, item as Record<string, unknown>);
                  }}
                >
                  {channelData.map((_, i) => (
                    <Cell key={i} fill={CHANNEL_COLORS[i % CHANNEL_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => currency(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </InteractiveChartCard>
      </div>

      <InteractiveChartCard
        title="Cashflow by Category"
        loading={aiLoading}
        onAnalyze={() => void explainMetric('Cashflow Analysis', { categories: categoryData, cashflowStatus: metrics.cashflowStatus })}
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis tickFormatter={(v) => `${Number(v) / 1000}k`} stroke="#64748b" />
              <Tooltip formatter={(v) => currency(Number(v))} contentStyle={{ background: '#0f172a' }} />
              <Bar
                dataKey="amount"
                fill="#67e8f9"
                radius={[8, 8, 0, 0]}
                onClick={(data) => {
                  if (data?.name) void explainMetric(`Category ${data.name}`, data as Record<string, unknown>);
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </InteractiveChartCard>

      {scores?.prediction ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-5 backdrop-blur-sm"
        >
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
          <div>
            <h3 className="font-semibold text-cyan-200">90-Day AI Prediction</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{scores.prediction}</p>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
};
