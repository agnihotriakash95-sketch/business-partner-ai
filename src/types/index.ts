export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';
export type PaymentStatus = 'paid' | 'pending' | 'overdue';
export type TransactionType = 'income' | 'expense';
export type ReportPeriod = 'daily' | 'weekly' | 'monthly';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  url: string;
  type: string;
  createdAt: string;
}

export interface UploadedAsset {
  id: string;
  name: string;
  type: string;
  size: number;
  previewUrl?: string;
  extractedText: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  ownerId: string;
  plan: SubscriptionPlan;
  amount: number;
  status: 'success' | 'failed' | 'demo';
  provider: 'razorpay';
  providerPaymentId?: string;
  createdAt: string;
}

export interface MsmeReportInput {
  businessType: string;
  investmentAmount: number;
  loanAmount: number;
  location: string;
  machinery: string;
  monthlyRevenue: number;
  expenses: number;
}

export interface MsmeReport {
  title: string;
  executiveSummary: string;
  dprReport: string[];
  financialProjections: string[];
  profitAnalysis: string[];
  breakEvenAnalysis: string[];
  msmeFormat: string[];
  bankReadiness: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  email: string;
  role: 'user' | 'admin';
  plan: SubscriptionPlan;
  createdAt: string;
}

export interface BusinessProfile {
  id: string;
  ownerId: string;
  businessName: string;
  industry: string;
  monthlyRevenue: number;
  monthlyExpenses: number;
  employeeCount: number;
  location: string;
  problemsFacing: string;
  healthScore: number;
}

export interface BusinessAnalysisInput {
  businessName: string;
  industry: string;
  monthlyRevenue: number;
  monthlyExpenses: number;
  employeeCount: number;
  location: string;
  problemsFacing: string;
}

export interface AISection {
  title: string;
  points: string[];
}

export interface BusinessAnalysis {
  summary: string;
  healthScore: number;
  businessReport: AISection;
  growthOpportunities: AISection;
  riskAnalysis: AISection;
  costCutting: AISection;
  revenueIdeas: AISection;
  competitorStrategy: AISection;
  actionPlan: AISection;
}

export interface Customer {
  id: string;
  ownerId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  amountDue: number;
  paymentStatus: PaymentStatus;
  dueDate: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  ownerId: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
  note: string;
}

export interface NotificationItem {
  id: string;
  ownerId: string;
  title: string;
  message: string;
  type: 'insight' | 'payment' | 'alert';
  read: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  ownerId: string;
  period: ReportPeriod;
  title: string;
  content: string;
  createdAt: string;
}

export interface CollectionMessage {
  whatsapp: string;
  emailSubject: string;
  emailBody: string;
}
