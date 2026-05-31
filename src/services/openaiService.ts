import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';
import { demoAnalysis } from '../data/demoData';
import type {
  BusinessAnalysis,
  BusinessAnalysisInput,
  CollectionMessage,
  GeneratedImage,
  MsmeReport,
  MsmeReportInput,
  ReportPeriod,
} from '../types';

const useDemoAI = import.meta.env.VITE_USE_DEMO_AI !== 'false';
const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldUseFirebase = () => !useDemoAI && Boolean(functions);
const shouldUseDirectOpenAI = () => !useDemoAI && !functions && Boolean(openaiApiKey);

const parseJson = <T>(text: string): T => {
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  return JSON.parse(cleaned) as T;
};

async function directChatCompletion(
  systemPrompt: string,
  userContent: string,
  history: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<string> {
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured. Set VITE_OPENAI_API_KEY or deploy Firebase Functions.');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.slice(-12),
        { role: 'user', content: userContent },
      ],
      temperature: 0.7,
    }),
  });

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(data.error?.message || 'OpenAI request failed');
  }

  return data.choices?.[0]?.message?.content || 'No response';
}

async function directJsonCompletion<T>(systemPrompt: string, userContent: string): Promise<T> {
  const text = await directChatCompletion(`${systemPrompt} Return only valid JSON.`, userContent);
  return parseJson<T>(text);
}

const demoImageSvg = (prompt: string, type: string, index: number) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <defs>
        <radialGradient id="g" cx="50%" cy="20%" r="70%">
          <stop offset="0%" stop-color="#22d3ee" stop-opacity=".9"/>
          <stop offset="45%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#020617"/>
        </radialGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#g)"/>
      <rect x="86" y="86" width="852" height="852" rx="52" fill="none" stroke="#67e8f9" stroke-width="6" opacity=".45"/>
      <text x="512" y="420" text-anchor="middle" font-family="Arial" font-size="70" font-weight="800" fill="#ffffff">Business Partner AI</text>
      <text x="512" y="510" text-anchor="middle" font-family="Arial" font-size="44" fill="#a5f3fc">${type}</text>
      <text x="512" y="604" text-anchor="middle" font-family="Arial" font-size="28" fill="#cbd5e1">${prompt.slice(0, 60)}</text>
      <circle cx="${260 + index * 120}" cy="735" r="58" fill="#22d3ee" opacity=".22"/>
    </svg>
  `)}`;

export const analyzeBusiness = async (input: BusinessAnalysisInput): Promise<BusinessAnalysis> => {
  if (shouldUseFirebase()) {
    const callable = httpsCallable<BusinessAnalysisInput, BusinessAnalysis>(functions!, 'analyzeBusiness');
    const result = await callable(input);
    return result.data;
  }

  if (shouldUseDirectOpenAI()) {
    return directJsonCompletion<BusinessAnalysis>(
      'You are Business Partner AI. Analyze the business and return JSON with keys summary, healthScore, businessReport, growthOpportunities, riskAnalysis, costCutting, revenueIdeas, competitorStrategy, actionPlan. Each section must have title and points array.',
      JSON.stringify(input)
    );
  }

  await wait(900);
  const profit = input.monthlyRevenue - input.monthlyExpenses;
  return {
    ...demoAnalysis,
    summary: `${input.businessName} has ${profit >= 0 ? 'positive' : 'negative'} monthly profit momentum in ${input.industry}. The main growth work is to improve cash conversion, sharpen positioning, and convert operational data into weekly decisions.`,
    healthScore: Math.max(10, Math.min(96, Math.round(62 + (profit / Math.max(input.monthlyRevenue, 1)) * 40))),
  };
};

export const generateReport = async (period: ReportPeriod, businessName = 'Business'): Promise<string> => {
  if (shouldUseFirebase()) {
    const callable = httpsCallable<{ period: ReportPeriod; businessName: string }, { content: string }>(
      functions!,
      'generateReport'
    );
    const result = await callable({ period, businessName });
    return result.data.content;
  }

  if (shouldUseDirectOpenAI()) {
    return directChatCompletion(
      'You are Business Partner AI. Create concise business reports with revenue focus, cash flow, risks, and top 3 actions.',
      `Create a ${period} business report for ${businessName}. Keep it under 220 words.`
    );
  }

  await wait(600);
  return `${period.toUpperCase()} REPORT: ${businessName} should prioritize revenue quality, overdue collection, and expense discipline. Top action: review cash flow, follow up unpaid invoices, and move one high-margin offer into active promotion.`;
};

export const generateRecoveryPlan = async (problem: string): Promise<string[]> => {
  if (shouldUseFirebase()) {
    const callable = httpsCallable<{ problem: string }, { steps: string[] }>(functions!, 'generateRecoveryPlan');
    const result = await callable({ problem });
    return result.data.steps;
  }

  if (shouldUseDirectOpenAI()) {
    const parsed = await directJsonCompletion<{ steps: string[] }>(
      'Return only JSON with key steps as an array of exactly 3 strings covering problem diagnosis, solution, and action plan.',
      `Why is this business not growing, and how should it recover?\n${problem}`
    );
    return parsed.steps;
  }

  await wait(700);
  return [
    `Root problem: ${problem || 'growth has slowed because sales, collections, and cost control are not aligned.'}`,
    'Solution: pick one profitable customer segment and build a 14-day campaign around it.',
    'Action plan: recover overdue dues, cut one low-return expense, and track daily lead-to-cash conversion.',
  ];
};

export const generateCollectionMessage = async (
  customerName: string,
  amountDue: number
): Promise<CollectionMessage> => {
  if (shouldUseFirebase()) {
    const callable = httpsCallable<{ customerName: string; amountDue: number }, CollectionMessage>(
      functions!,
      'generateCollectionMessage'
    );
    const result = await callable({ customerName, amountDue });
    return result.data;
  }

  if (shouldUseDirectOpenAI()) {
    return directJsonCompletion<CollectionMessage>(
      'Return only JSON with keys whatsapp, emailSubject, emailBody. Tone must be polite, professional, and firm.',
      `Create a payment reminder for ${customerName}. Pending amount: INR ${amountDue}.`
    );
  }

  await wait(500);
  return {
    whatsapp: `Hi ${customerName}, gentle reminder that INR ${amountDue.toLocaleString('en-IN')} is pending. Please share the payment update today. Thank you.`,
    emailSubject: 'Payment reminder for pending invoice',
    emailBody: `Dear ${customerName},\n\nI hope you are well. This is a polite reminder that INR ${amountDue.toLocaleString('en-IN')} is pending against your account. Please process the payment or share an expected payment date.\n\nRegards,\nBusiness Partner AI`,
  };
};

export const sendBusinessChatMessage = async (
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<string> => {
  if (shouldUseFirebase()) {
    const callable = httpsCallable<
      { message: string; history: { role: 'user' | 'assistant'; content: string }[] },
      { reply: string }
    >(functions!, 'chatAssistant');
    const result = await callable({ message, history });
    return result.data.reply;
  }

  if (shouldUseDirectOpenAI()) {
    return directChatCompletion(
      'You are Business Partner AI, a business operating assistant for Indian founders. Help with finance, marketing, recovery, customers, MSME reports, and growth. Reply in the same language as the user, including Hindi or Hinglish when used. Be practical and concise.',
      message,
      history
    );
  }

  await wait(850);
  const isHindi = /[\u0900-\u097F]|hindi|hinglish/i.test(message);
  return isHindi
    ? 'Bilkul. Aapke business ke liye sabse pehle cash-flow, repeat customers, aur pending payment recovery par focus karein. 7 din ka action: overdue clients ko follow-up, high-margin product bundle, aur daily sales/expense tracking.'
    : 'Here is a practical business move: protect cash flow first, then improve profitable repeat sales. For the next 7 days, recover overdue dues, pause low-return marketing, and push one high-margin offer to existing customers.';
};

export const generateBusinessImages = async (prompt: string, type: string): Promise<GeneratedImage[]> => {
  if (shouldUseFirebase()) {
    const callable = httpsCallable<{ prompt: string; type: string }, { images: GeneratedImage[] }>(
      functions!,
      'generateBusinessImages'
    );
    const result = await callable({ prompt, type });
    return result.data.images;
  }

  if (shouldUseDirectOpenAI()) {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: `Create a premium production-quality ${type} for Business Partner AI. Blue-black futuristic SaaS aesthetic, polished startup branding, no fake contact details. ${prompt}`,
        n: 1,
        size: '1024x1024',
      }),
    });

    const data = (await response.json()) as {
      data?: { url?: string }[];
      error?: { message?: string };
    };

    if (!response.ok) {
      throw new Error(data.error?.message || 'Image generation failed');
    }

    return (data.data || [])
      .filter((image) => image.url)
      .map((image, index) => ({
        id: `${Date.now()}-${index}`,
        prompt,
        type,
        url: String(image.url),
        createdAt: new Date().toISOString(),
      }));
  }

  await wait(1000);
  return [0, 1, 2, 3].map((index) => ({
    id: crypto.randomUUID(),
    prompt,
    type,
    url: demoImageSvg(prompt, type, index),
    createdAt: new Date().toISOString(),
  }));
};

export const generateMsmeReport = async (input: MsmeReportInput): Promise<MsmeReport> => {
  if (shouldUseFirebase()) {
    const callable = httpsCallable<MsmeReportInput, MsmeReport>(functions!, 'generateMsmeReport');
    const result = await callable(input);
    return result.data;
  }

  if (shouldUseDirectOpenAI()) {
    return directJsonCompletion<MsmeReport>(
      'Return only valid JSON with keys title, executiveSummary, dprReport, financialProjections, profitAnalysis, breakEvenAnalysis, msmeFormat, bankReadiness. Array sections must contain practical bank-ready points for PMEGP/MSME style project reports.',
      JSON.stringify(input)
    );
  }

  await wait(900);
  const monthlyProfit = input.monthlyRevenue - input.expenses;
  return {
    title: `${input.businessType} MSME Project Report`,
    executiveSummary: `Bank-ready DPR for ${input.businessType} in ${input.location}, requiring INR ${input.loanAmount.toLocaleString('en-IN')} loan support against INR ${input.investmentAmount.toLocaleString('en-IN')} total investment.`,
    dprReport: [
      'Promoter profile and business model are suitable for MSME funding.',
      `Machinery requirement: ${input.machinery}.`,
      'Project focuses on local demand, job creation, and scalable operations.',
    ],
    financialProjections: [
      `Monthly revenue: INR ${input.monthlyRevenue.toLocaleString('en-IN')}.`,
      `Monthly expenses: INR ${input.expenses.toLocaleString('en-IN')}.`,
      `Estimated annual turnover: INR ${(input.monthlyRevenue * 12).toLocaleString('en-IN')}.`,
    ],
    profitAnalysis: [
      `Estimated monthly profit: INR ${monthlyProfit.toLocaleString('en-IN')}.`,
      `Estimated annual profit: INR ${(monthlyProfit * 12).toLocaleString('en-IN')}.`,
      'Profitability improves with better capacity utilization and direct sales.',
    ],
    breakEvenAnalysis: [
      `Indicative break-even period: ${Math.max(6, Math.ceil(input.investmentAmount / Math.max(monthlyProfit, 1)))} months.`,
      'Break-even depends on loan tenure, subsidy eligibility, and working capital cycle.',
    ],
    msmeFormat: [
      'PMEGP/MSME sections: promoter, project cost, means of finance, market demand, employment, profitability.',
      'Attach KYC, quotations, Udyam registration, rent agreement, and bank statements.',
    ],
    bankReadiness: [
      'Use CA-certified projections before final submission.',
      'Add machinery quotations and collateral/guarantee details.',
      'Export this report as PDF for bank discussion.',
    ],
  };
};
