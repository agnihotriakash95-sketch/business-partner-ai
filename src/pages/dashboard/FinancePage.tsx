import { FormEvent, useMemo, useState } from 'react';
import { Plus, TrendingUp, Wallet } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { InteractiveChartCard } from '../../components/ai/InteractiveChartCard';
import { InteractiveStatCard } from '../../components/ai/InteractiveStatCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAIAssistant } from '../../contexts/AIAssistantContext';
import { useBusinessData } from '../../contexts/BusinessDataContext';
import type { TransactionType } from '../../types';
import { buildCategoryBreakdown } from '../../utils/analyticsEngine';
import { sumTransactions } from '../../utils/calculations';
import { currency } from '../../utils/formatters';

export const FinancePage = () => {
  const { transactions, addTransaction } = useBusinessData();
  const { explainMetric, loading: aiLoading } = useAIAssistant();
  const [type, setType] = useState<TransactionType>('income');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');

  const revenue = sumTransactions(transactions, 'income');
  const expenses = sumTransactions(transactions, 'expense');
  const profit = revenue - expenses;
  const chartData = useMemo(() => buildCategoryBreakdown(transactions), [transactions]);

  const add = (event: FormEvent) => {
    event.preventDefault();
    if (!amount) return;
    addTransaction({
      type,
      category: category || (type === 'income' ? 'Sales' : 'Operations'),
      amount,
      date: new Date().toISOString(),
      note: 'Manual entry',
    });
    setAmount(0);
    setCategory('');
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-black">Finance Manager</h1>
        <p className="mt-2 text-slate-400">Live income, expense, cash flow, and AI-powered profit analysis.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <InteractiveStatCard
          title="Income"
          value={currency(revenue)}
          trend="From your transaction ledger"
          icon={TrendingUp}
          loading={aiLoading}
          onAnalyze={() => void explainMetric('Income', { revenue, transactions: transactions.filter((t) => t.type === 'income') })}
        />
        <InteractiveStatCard
          title="Expense"
          value={currency(expenses)}
          trend="Category breakdown available"
          icon={Wallet}
          loading={aiLoading}
          onAnalyze={() => void explainMetric('Expenses', { expenses, categories: chartData })}
        />
        <InteractiveStatCard
          title="Profit/Loss"
          value={currency(profit)}
          trend={profit >= 0 ? 'Profitable' : 'Loss — AI recovery recommended'}
          icon={Plus}
          highlight={profit < 0}
          loading={aiLoading}
          onAnalyze={() => void explainMetric('Profit/Loss', { profit, revenue, expenses })}
        />
      </div>
      <Card className="border-cyan-300/20 bg-slate-950/80 text-white">
        <form className="grid gap-4 lg:grid-cols-[180px_1fr_180px_auto]" onSubmit={add}>
          <label className="grid gap-2 text-sm font-medium">
            Type
            <select
              className="rounded-lg border border-white/10 bg-white/10 px-3 py-3 text-white"
              value={type}
              onChange={(event) => setType(event.target.value as TransactionType)}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
          <Input label="Category" value={category} onChange={(event) => setCategory(event.target.value)} />
          <Input label="Amount" type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} required />
          <Button className="self-end">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </form>
      </Card>
      <div className="grid gap-6 xl:grid-cols-[1fr_.75fr]">
        <InteractiveChartCard
          title="Cash Flow by Category"
          loading={aiLoading}
          onAnalyze={() => void explainMetric('Cash Flow Categories', { chartData, profit })}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} stroke="#64748b" />
                <Tooltip formatter={(value) => currency(Number(value))} contentStyle={{ background: '#0f172a' }} />
                <Bar dataKey="amount" fill="#67e8f9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </InteractiveChartCard>
        <Card className="border-cyan-300/20 bg-slate-950/80 text-white">
          <h2 className="font-display text-xl font-bold">Recent Entries</h2>
          <div className="mt-4 grid gap-3">
            {transactions.length ? (
              transactions.slice(0, 7).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between rounded-lg bg-white/10 p-3 text-sm">
                  <div>
                    <p className="font-semibold">{transaction.category}</p>
                    <p className="text-slate-400">{transaction.note}</p>
                  </div>
                  <span className={transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {currency(transaction.amount)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No transactions yet. Add your first entry above.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
