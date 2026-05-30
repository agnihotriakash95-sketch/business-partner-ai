import { FormEvent, useMemo, useState } from 'react';
import { Plus, TrendingUp, Wallet } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { StatCard } from '../../components/ui/StatCard';
import { demoTransactions } from '../../data/demoData';
import type { TransactionType } from '../../types';
import { sumTransactions } from '../../utils/calculations';
import { currency } from '../../utils/formatters';

export const FinancePage = () => {
  const [transactions, setTransactions] = useState(demoTransactions);
  const [type, setType] = useState<TransactionType>('income');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');

  const revenue = sumTransactions(transactions, 'income');
  const expenses = sumTransactions(transactions, 'expense');
  const profit = revenue - expenses;
  const chartData = useMemo(
    () =>
      ['Sales', 'Services', 'Payroll', 'Marketing', 'Operations'].map((name) => ({
        name,
        amount: transactions.filter((item) => item.category === name).reduce((sum, item) => sum + item.amount, 0),
      })),
    [transactions],
  );

  const add = (event: FormEvent) => {
    event.preventDefault();
    setTransactions((items) => [
      {
        id: crypto.randomUUID(),
        ownerId: 'demo-user',
        type,
        category: category || (type === 'income' ? 'Sales' : 'Operations'),
        amount,
        date: new Date().toISOString(),
        note: 'Manual entry',
      },
      ...items,
    ]);
    setAmount(0);
    setCategory('');
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-black">Finance Manager</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">Income entry, expense entry, cash flow, and profit/loss analytics.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Income" value={currency(revenue)} trend="Tracked this month" icon={TrendingUp} />
        <StatCard title="Expense" value={currency(expenses)} trend="Control high categories" icon={Wallet} />
        <StatCard title="Profit/Loss" value={currency(profit)} trend={profit >= 0 ? 'Business is profitable' : 'Loss recovery required'} icon={Plus} />
      </div>
      <Card>
        <form className="grid gap-4 lg:grid-cols-[180px_1fr_180px_auto]" onSubmit={add}>
          <label className="grid gap-2 text-sm font-medium">
            Type
            <select className="rounded-lg border border-black/10 bg-white px-3 py-3 dark:border-white/10 dark:bg-white/10" value={type} onChange={(event) => setType(event.target.value as TransactionType)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
          <Input label="Category" value={category} onChange={(event) => setCategory(event.target.value)} />
          <Input label="Amount" type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} required />
          <Button className="self-end"><Plus className="h-4 w-4" /> Add</Button>
        </form>
      </Card>
      <div className="grid gap-6 xl:grid-cols-[1fr_.75fr]">
        <Card>
          <h2 className="font-display text-xl font-bold">Cash Flow by Category</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
                <Tooltip formatter={(value) => currency(Number(value))} />
                <Bar dataKey="amount" fill="#f5a90b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="font-display text-xl font-bold">Recent Entries</h2>
          <div className="mt-4 grid gap-3">
            {transactions.slice(0, 7).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between rounded-lg bg-black/[0.04] p-3 text-sm dark:bg-white/10">
                <div>
                  <p className="font-semibold">{transaction.category}</p>
                  <p className="text-neutral-500 dark:text-neutral-400">{transaction.note}</p>
                </div>
                <span className={transaction.type === 'income' ? 'text-emerald-500' : 'text-red-500'}>{transaction.type === 'income' ? '+' : '-'}{currency(transaction.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
