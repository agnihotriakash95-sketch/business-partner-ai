import type { Customer, Transaction } from '../types';

export const sumTransactions = (transactions: Transaction[], type: 'income' | 'expense') =>
  transactions.filter((item) => item.type === type).reduce((total, item) => total + item.amount, 0);

export const calculateProfit = (revenue: number, expenses: number) => revenue - expenses;

export const calculateHealthScore = (revenue: number, expenses: number, overdueDue: number, employeeCount: number) => {
  const margin = revenue > 0 ? (revenue - expenses) / revenue : 0;
  const overdueRatio = revenue > 0 ? overdueDue / revenue : 0;
  const scalePenalty = employeeCount > 0 && revenue / employeeCount < 75000 ? 8 : 0;
  const score = 58 + margin * 55 - overdueRatio * 35 - scalePenalty;
  return Math.max(5, Math.min(98, Math.round(score)));
};

export const pendingDues = (customers: Customer[]) =>
  customers.filter((customer) => customer.paymentStatus !== 'paid').reduce((total, customer) => total + customer.amountDue, 0);
