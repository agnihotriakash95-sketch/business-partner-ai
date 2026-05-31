import type { BusinessMetricsSnapshot, Customer, Transaction } from '../types';
import { calculateHealthScore, calculateProfit, pendingDues, sumTransactions } from './calculations';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const buildMonthlyTrend = (transactions: Transaction[]) => {
  const buckets = new Map<string, { revenue: number; expense: number }>();

  transactions.forEach((tx) => {
    const date = new Date(tx.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const current = buckets.get(key) || { revenue: 0, expense: 0 };
    if (tx.type === 'income') current.revenue += tx.amount;
    else current.expense += tx.amount;
    buckets.set(key, current);
  });

  const sorted = [...buckets.entries()].sort(([a], [b]) => a.localeCompare(b));

  return sorted.map(([key, values]) => {
    const [, month] = key.split('-');
    return {
      month: MONTH_LABELS[Number(month) - 1] || key,
      revenue: values.revenue,
      expense: values.expense,
      profit: values.revenue - values.expense,
    };
  });
};

export const buildCategoryBreakdown = (transactions: Transaction[]) => {
  const map = new Map<string, number>();
  transactions.forEach((tx) => {
    map.set(tx.category, (map.get(tx.category) || 0) + tx.amount);
  });
  return [...map.entries()]
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);
};

export const computeRetentionRate = (customers: Customer[]) => {
  if (!customers.length) return 0;
  const repeat = customers.filter((c) => c.paymentStatus === 'paid').length;
  return Math.round((repeat / customers.length) * 100);
};

export const computeRevenueChange = (trend: ReturnType<typeof buildMonthlyTrend>) => {
  if (trend.length < 2) return 0;
  const prev = trend[trend.length - 2].revenue;
  const curr = trend[trend.length - 1].revenue;
  if (prev === 0) return curr > 0 ? 100 : 0;
  return Math.round(((curr - prev) / prev) * 100);
};

export const computeExpenseChange = (trend: ReturnType<typeof buildMonthlyTrend>) => {
  if (trend.length < 2) return 0;
  const prev = trend[trend.length - 2].expense;
  const curr = trend[trend.length - 1].expense;
  if (prev === 0) return curr > 0 ? 100 : 0;
  return Math.round(((curr - prev) / prev) * 100);
};

export const buildBusinessMetrics = (
  transactions: Transaction[],
  customers: Customer[],
  businessName: string
): BusinessMetricsSnapshot => {
  const trend = buildMonthlyTrend(transactions);
  const revenue = sumTransactions(transactions, 'income');
  const expenses = sumTransactions(transactions, 'expense');
  const profit = calculateProfit(revenue, expenses);
  const dues = pendingDues(customers);
  const retention = computeRetentionRate(customers);
  const revenueChange = computeRevenueChange(trend);
  const expenseChange = computeExpenseChange(trend);
  const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;
  const healthScore = calculateHealthScore(revenue, expenses, dues, customers.length || 1);
  const categories = buildCategoryBreakdown(transactions);

  return {
    businessName,
    revenue,
    expenses,
    profit,
    margin,
    pendingDues: dues,
    customerCount: customers.length,
    overdueCount: customers.filter((c) => c.paymentStatus === 'overdue').length,
    retentionRate: retention,
    revenueChangePercent: revenueChange,
    expenseChangePercent: expenseChange,
    healthScore,
    monthlyTrend: trend,
    topCategories: categories,
    cashflowStatus: profit > 0 && dues < revenue * 0.15 ? 'healthy' : profit > 0 ? 'watch' : 'critical',
  };
};
