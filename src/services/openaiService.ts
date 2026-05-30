import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';
import { demoAnalysis } from '../data/demoData';
import type { BusinessAnalysis, BusinessAnalysisInput, CollectionMessage, GeneratedImage, MsmeReport, MsmeReportInput, ReportPeriod } from '../types';

const useDemoAI = import.meta.env.VITE_USE_DEMO_AI !== 'false';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const analyzeBusiness = async (input: BusinessAnalysisInput): Promise<BusinessAnalysis> => {
  if (useDemoAI || !functions) {
    await wait(900);
    const profit = input.monthlyRevenue - input.monthlyExpenses;
    return {
      ...demoAnalysis,
      summary: `${input.businessName} has ${profit >= 0 ? 'positive' : 'negative'} monthly profit momentum in ${input.industry}. The main growth work is to improve cash conversion, sharpen positioning, and convert operational data into weekly decisions.`,
      healthScore: Math.max(10, Math.min(96, Math.round(62 + (profit / Math.max(input.monthlyRevenue, 1)) * 40))),
    };
  }

  const callable = httpsCallable<BusinessAnalysisInput, BusinessAnalysis>(functions, 'analyzeBusiness');
  const result = await callable(input);
  return result.data;
};

export const generateReport = async (period: ReportPeriod, businessName = 'Business'): Promise<string> => {
  if (useDemoAI || !functions) {
    await wait(600);
    return `${period.toUpperCase()} REPORT: ${businessName} should prioritize revenue quality, overdue collection, and expense discipline. Top action: review cash flow, follow up unpaid invoices, and move one high-margin offer into active promotion.`;
  }
  const callable = httpsCallable<{ period: ReportPeriod; businessName: string }, { content: string }>(functions, 'generateReport');
  const result = await callable({ period, businessName });
  return result.data.content;
};

export const generateRecoveryPlan = async (problem: string): Promise<string[]> => {
  if (useDemoAI || !functions) {
    await wait(700);
    return [
      `Root problem: ${problem || 'growth has slowed because sales, collections, and cost control are not aligned.'}`,
      'Solution: pick one profitable customer segment and build a 14-day campaign around it.',
      'Action plan: recover overdue dues, cut one low-return expense, and track daily lead-to-cash conversion.',
    ];
  }
  const callable = httpsCallable<{ problem: string }, { steps: string[] }>(functions, 'generateRecoveryPlan');
  const result = await callable({ problem });
  return result.data.steps;
};

export const generateCollectionMessage = async (customerName: string, amountDue: number): Promise<CollectionMessage> => {
  if (useDemoAI || !functions) {
    await wait(500);
    return {
      whatsapp: `Hi ${customerName}, gentle reminder that INR ${amountDue.toLocaleString('en-IN')} is pending. Please share the payment update today. Thank you.`,
      emailSubject: `Payment reminder for pending invoice`,
      emailBody: `Dear ${customerName},\n\nI hope you are well. This is a polite reminder that INR ${amountDue.toLocaleString('en-IN')} is pending against your account. Please process the payment or share an expected payment date.\n\nRegards,\nBusiness Partner AI`,
    };
  }
  const callable = httpsCallable<{ customerName: string; amountDue: number }, CollectionMessage>(functions, 'generateCollectionMessage');
  const result = await callable({ customerName, amountDue });
  return result.data;
};

export const sendBusinessChatMessage = async (message: string, history: { role: 'user' | 'assistant'; content: string }[]): Promise<string> => {
  if (useDemoAI || !functions) {
    await wait(850);
    const isHindi = /[\u0900-\u097F]|hindi|hinglish/i.test(message);
    return isHindi
      ? `Bilkul. Aapke business ke liye sabse pehle cash-flow, repeat customers, aur pending payment recovery par focus karein. 7 din ka action: overdue clients ko follow-up, high-margin product bundle, aur daily sales/expense tracking.`
      : `Here is a practical business move: protect cash flow first, then improve profitable repeat sales. For the next 7 days, recover overdue dues, pause low-return marketing, and push one high-margin offer to existing customers.`;
  }
  const callable = httpsCallable<{ message: string; history: { role: 'user' | 'assistant'; content: string }[] }, { reply: string }>(functions, 'chatAssistant');
  const result = await callable({ message, history });
  return result.data.reply;
};

export const generateBusinessImages = async (prompt: string, type: string): Promise<GeneratedImage[]> => {
  if (useDemoAI || !functions) {
    await wait(1000);
    const encoded = encodeURIComponent(`${type}: ${prompt}`);
    return [0, 1, 2, 3].map((index) => ({
      id: crypto.randomUUID(),
      prompt,
      type,
      url: `https://dummyimage.com/1024x1024/020617/67e8f9.png&text=${encoded}+${index + 1}`,
      createdAt: new Date().toISOString(),
    }));
  }
  const callable = httpsCallable<{ prompt: string; type: string }, { images: GeneratedImage[] }>(functions, 'generateBusinessImages');
  const result = await callable({ prompt, type });
  return result.data.images;
};

export const generateMsmeReport = async (input: MsmeReportInput): Promise<MsmeReport> => {
  if (useDemoAI || !functions) {
    await wait(900);
    const monthlyProfit = input.monthlyRevenue - input.expenses;
    return {
      title: `${input.businessType} MSME Project Report`,
      executiveSummary: `Bank-ready DPR for ${input.businessType} in ${input.location}, requiring INR ${input.loanAmount.toLocaleString('en-IN')} loan support against INR ${input.investmentAmount.toLocaleString('en-IN')} total investment.`,
      dprReport: ['Promoter profile and business model are suitable for MSME funding.', `Machinery requirement: ${input.machinery}.`, 'Project focuses on local demand, job creation, and scalable operations.'],
      financialProjections: [`Monthly revenue: INR ${input.monthlyRevenue.toLocaleString('en-IN')}.`, `Monthly expenses: INR ${input.expenses.toLocaleString('en-IN')}.`, `Estimated annual turnover: INR ${(input.monthlyRevenue * 12).toLocaleString('en-IN')}.`],
      profitAnalysis: [`Estimated monthly profit: INR ${monthlyProfit.toLocaleString('en-IN')}.`, `Estimated annual profit: INR ${(monthlyProfit * 12).toLocaleString('en-IN')}.`, 'Profitability improves with better capacity utilization and direct sales.'],
      breakEvenAnalysis: [`Indicative break-even period: ${Math.max(6, Math.ceil(input.investmentAmount / Math.max(monthlyProfit, 1)))} months.`, 'Break-even depends on loan tenure, subsidy eligibility, and working capital cycle.'],
      msmeFormat: ['PMEGP/MSME sections: promoter, project cost, means of finance, market demand, employment, profitability.', 'Attach KYC, quotations, Udyam registration, rent agreement, and bank statements.'],
      bankReadiness: ['Use CA-certified projections before final submission.', 'Add machinery quotations and collateral/guarantee details.', 'Export this report as PDF for bank discussion.'],
    };
  }
  const callable = httpsCallable<MsmeReportInput, MsmeReport>(functions, 'generateMsmeReport');
  const result = await callable(input);
  return result.data;
};
