import type { BusinessAnalysis, Customer, NotificationItem, Report, Transaction, UserProfile } from '../types';

export const demoUser: UserProfile = {
  id: 'demo-user',
  name: 'Akash Agnihotri',
  title: 'CEO & Founder',
  email: 'akash@businesspartner.ai',
  role: 'admin',
  plan: 'pro',
  createdAt: '2026-05-01T10:00:00.000Z',
};

export const demoCustomers: Customer[] = [
  {
    id: 'c1',
    ownerId: 'demo-user',
    name: 'Priya Foods',
    email: 'accounts@priyafoods.in',
    phone: '+91 98765 43210',
    company: 'Priya Foods Pvt Ltd',
    amountDue: 84000,
    paymentStatus: 'overdue',
    dueDate: '2026-05-24',
    notes: 'Repeat customer, prefers WhatsApp reminders.',
  },
  {
    id: 'c2',
    ownerId: 'demo-user',
    name: 'Metro Retail',
    email: 'finance@metroretail.in',
    phone: '+91 99887 76655',
    company: 'Metro Retail',
    amountDue: 42000,
    paymentStatus: 'pending',
    dueDate: '2026-06-03',
  },
  {
    id: 'c3',
    ownerId: 'demo-user',
    name: 'Nova Kitchens',
    email: 'owner@novakitchens.in',
    phone: '+91 91234 56789',
    company: 'Nova Kitchens',
    amountDue: 0,
    paymentStatus: 'paid',
    dueDate: '2026-05-20',
  },
];

export const demoTransactions: Transaction[] = [
  { id: 't1', ownerId: 'demo-user', type: 'income', category: 'Sales', amount: 680000, date: '2026-05-28', note: 'Monthly product sales' },
  { id: 't2', ownerId: 'demo-user', type: 'income', category: 'Services', amount: 180000, date: '2026-05-25', note: 'Consulting packages' },
  { id: 't3', ownerId: 'demo-user', type: 'expense', category: 'Payroll', amount: 260000, date: '2026-05-26', note: 'Team salaries' },
  { id: 't4', ownerId: 'demo-user', type: 'expense', category: 'Marketing', amount: 74000, date: '2026-05-22', note: 'Meta ads and creators' },
  { id: 't5', ownerId: 'demo-user', type: 'expense', category: 'Operations', amount: 135000, date: '2026-05-21', note: 'Rent, logistics, tools' },
];

export const demoNotifications: NotificationItem[] = [
  {
    id: 'n1',
    ownerId: 'demo-user',
    title: 'Margin improved',
    message: 'Your gross margin is 8% better than the previous month.',
    type: 'insight',
    read: false,
    createdAt: '2026-05-30T08:30:00.000Z',
  },
  {
    id: 'n2',
    ownerId: 'demo-user',
    title: 'Payment overdue',
    message: 'Priya Foods has an overdue amount of INR 84,000.',
    type: 'payment',
    read: false,
    createdAt: '2026-05-29T11:00:00.000Z',
  },
  {
    id: 'n3',
    ownerId: 'demo-user',
    title: 'Growth risk',
    message: 'Marketing spend is rising faster than repeat purchase revenue.',
    type: 'alert',
    read: true,
    createdAt: '2026-05-28T18:00:00.000Z',
  },
];

export const demoReports: Report[] = [
  {
    id: 'r1',
    ownerId: 'demo-user',
    period: 'daily',
    title: 'Daily Business Pulse',
    content: 'Revenue is stable today. Focus on overdue collection and high-intent leads.',
    createdAt: '2026-05-30T09:00:00.000Z',
  },
  {
    id: 'r2',
    ownerId: 'demo-user',
    period: 'weekly',
    title: 'Weekly Growth Report',
    content: 'Repeat customers are driving profit. New acquisition needs tighter CAC tracking.',
    createdAt: '2026-05-27T09:00:00.000Z',
  },
  {
    id: 'r3',
    ownerId: 'demo-user',
    period: 'monthly',
    title: 'Monthly Strategy Report',
    content: 'The business can improve net profit by renegotiating vendor terms and bundling premium service packages.',
    createdAt: '2026-05-01T09:00:00.000Z',
  },
];

export const demoAnalysis: BusinessAnalysis = {
  summary: 'The business is profitable but collection delays and rising operating costs are limiting growth velocity.',
  healthScore: 78,
  businessReport: {
    title: 'Business Report',
    points: ['Revenue base is strong for the current team size.', 'Cash conversion needs attention because overdue dues are material.', 'Marketing spend should be tied to repeat purchase cohorts.'],
  },
  growthOpportunities: {
    title: 'Growth Opportunities',
    points: ['Launch a premium bundle for high-repeat customers.', 'Create a referral offer for existing customers.', 'Track lead source profitability weekly.'],
  },
  riskAnalysis: {
    title: 'Risk Analysis',
    points: ['High pending dues can pressure cash flow.', 'Payroll and operations together consume a large share of revenue.', 'Competitors can undercut price if differentiation is weak.'],
  },
  costCutting: {
    title: 'Cost Cutting Suggestions',
    points: ['Renegotiate logistics and vendor contracts.', 'Pause campaigns below target ROAS.', 'Automate manual reporting and payment reminders.'],
  },
  revenueIdeas: {
    title: 'Revenue Improvement Ideas',
    points: ['Add advance-payment discounts.', 'Introduce monthly retainers.', 'Upsell service add-ons to paid customers.'],
  },
  competitorStrategy: {
    title: 'Competitor Strategy Suggestions',
    points: ['Position on reliability and speed, not only price.', 'Publish proof-driven case studies.', 'Monitor competitor pricing and offers twice per month.'],
  },
  actionPlan: {
    title: '30-Day Action Plan',
    points: ['Recover overdue dues in week one.', 'Cut low-return expenses in week two.', 'Launch premium bundle and referral campaign in week three.', 'Review KPIs and reset targets in week four.'],
  },
};
