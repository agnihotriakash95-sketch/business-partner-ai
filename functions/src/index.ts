import OpenAI from 'openai';
import { initializeApp } from 'firebase-admin/app';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';

initializeApp();

const openaiApiKey = defineSecret('OPENAI_API_KEY');
const model = 'gpt-4.1-mini';
const advancedModel = 'gpt-5.2';

interface BusinessAnalysisInput {
  businessName: string;
  industry: string;
  monthlyRevenue: number;
  monthlyExpenses: number;
  employeeCount: number;
  location: string;
  problemsFacing: string;
}

interface MsmeReportInput {
  businessType: string;
  investmentAmount: number;
  loanAmount: number;
  location: string;
  machinery: string;
  monthlyRevenue: number;
  expenses: number;
}

const requireAuth = (uid?: string) => {
  if (!uid) {
    throw new HttpsError('unauthenticated', 'Login is required to use AI features.');
  }
};

const parseJson = <T>(text: string): T => {
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  return JSON.parse(cleaned) as T;
};

const client = () => new OpenAI({ apiKey: openaiApiKey.value() });

export const analyzeBusiness = onCall({ secrets: [openaiApiKey], timeoutSeconds: 60 }, async (request) => {
  requireAuth(request.auth?.uid);
  const input = request.data as BusinessAnalysisInput;
  if (!input.businessName || !input.industry || input.monthlyRevenue < 0 || input.monthlyExpenses < 0) {
    throw new HttpsError('invalid-argument', 'Valid business details are required.');
  }

  const response = await client().responses.create({
    model,
    input: [
      {
        role: 'system',
        content:
          'You are Business Partner AI, a practical business advisor. Return only valid JSON matching the requested schema. Be specific, concise, ethical, and action-oriented.',
      },
      {
        role: 'user',
        content: `Analyze this business and return JSON with keys summary, healthScore, businessReport, growthOpportunities, riskAnalysis, costCutting, revenueIdeas, competitorStrategy, actionPlan. Each section must have title and points array.\n\n${JSON.stringify(input)}`,
      },
    ],
  });

  try {
    return parseJson(response.output_text);
  } catch {
    throw new HttpsError('internal', 'AI response could not be parsed.');
  }
});

export const generateReport = onCall({ secrets: [openaiApiKey], timeoutSeconds: 45 }, async (request) => {
  requireAuth(request.auth?.uid);
  const { period, businessName } = request.data as { period: string; businessName: string };
  if (!['daily', 'weekly', 'monthly'].includes(period)) {
    throw new HttpsError('invalid-argument', 'Report period must be daily, weekly, or monthly.');
  }

  const response = await client().responses.create({
    model,
    input: `Create a ${period} business report for ${businessName || 'the business'}. Include revenue focus, cash flow, risks, and top 3 actions. Keep it under 220 words.`,
  });

  return { content: response.output_text };
});

export const generateRecoveryPlan = onCall({ secrets: [openaiApiKey], timeoutSeconds: 45 }, async (request) => {
  requireAuth(request.auth?.uid);
  const { problem } = request.data as { problem: string };
  if (!problem?.trim()) {
    throw new HttpsError('invalid-argument', 'Problem description is required.');
  }

  const response = await client().responses.create({
    model,
    input: [
      {
        role: 'system',
        content: 'Return only JSON with key steps as an array of exactly 3 strings: problems, solutions, action plan.',
      },
      {
        role: 'user',
        content: `Why is this business not growing, and how should it recover?\n${problem}`,
      },
    ],
  });

  try {
    return parseJson<{ steps: string[] }>(response.output_text);
  } catch {
    throw new HttpsError('internal', 'AI recovery response could not be parsed.');
  }
});

export const generateCollectionMessage = onCall({ secrets: [openaiApiKey], timeoutSeconds: 45 }, async (request) => {
  requireAuth(request.auth?.uid);
  const { customerName, amountDue } = request.data as { customerName: string; amountDue: number };
  if (!customerName || amountDue <= 0) {
    throw new HttpsError('invalid-argument', 'Customer name and amount due are required.');
  }

  const response = await client().responses.create({
    model,
    input: [
      {
        role: 'system',
        content:
          'Return only JSON with keys whatsapp, emailSubject, emailBody. The tone must be polite, professional, and firm. Do not threaten or harass.',
      },
      {
        role: 'user',
        content: `Create a payment reminder for ${customerName}. Pending amount: INR ${amountDue}.`,
      },
    ],
  });

  try {
    return parseJson(response.output_text);
  } catch {
    throw new HttpsError('internal', 'AI collection response could not be parsed.');
  }
});

export const chatAssistant = onCall({ secrets: [openaiApiKey], timeoutSeconds: 60 }, async (request) => {
  requireAuth(request.auth?.uid);
  const { message, history } = request.data as { message: string; history: { role: 'user' | 'assistant'; content: string }[] };
  if (!message?.trim()) {
    throw new HttpsError('invalid-argument', 'Message is required.');
  }

  const response = await client().responses.create({
    model: advancedModel,
    instructions:
      'You are Business Partner AI, a futuristic business operating assistant for Indian founders. Help with finance, marketing, recovery, customers, MSME reports, and growth. Reply in the same language as the user, including Hindi or Hinglish when used. Be practical and concise.',
    input: [
      ...(history || []).slice(-12).map((item) => ({
        role: item.role,
        content: item.content,
      })),
      { role: 'user', content: message },
    ],
  });

  return { reply: response.output_text };
});

export const generateBusinessImages = onCall({ secrets: [openaiApiKey], timeoutSeconds: 120, memory: '1GiB' }, async (request) => {
  requireAuth(request.auth?.uid);
  const { prompt, type } = request.data as { prompt: string; type: string };
  if (!prompt?.trim()) {
    throw new HttpsError('invalid-argument', 'Image prompt is required.');
  }

  const response = await client().responses.create({
    model: advancedModel,
    input: `Create ${type || 'business creative'} for Business Partner AI. Prompt: ${prompt}`,
    tools: [{ type: 'image_generation' }],
  });

  const images = response.output
    .filter((output) => output.type === 'image_generation_call')
    .map((output) => {
      const result = (output as unknown as { result?: string }).result;
      return result;
    })
    .filter((result): result is string => Boolean(result))
    .map((base64, index) => ({
      id: `${Date.now()}-${index}`,
      prompt,
      type,
      url: `data:image/png;base64,${base64}`,
      createdAt: new Date().toISOString(),
    }));

  if (!images.length) {
    throw new HttpsError('internal', 'No image was returned by the model.');
  }

  return { images };
});

export const generateMsmeReport = onCall({ secrets: [openaiApiKey], timeoutSeconds: 60 }, async (request) => {
  requireAuth(request.auth?.uid);
  const input = request.data as MsmeReportInput;
  if (!input.businessType || input.investmentAmount <= 0 || input.loanAmount <= 0) {
    throw new HttpsError('invalid-argument', 'Valid MSME project inputs are required.');
  }

  const response = await client().responses.create({
    model,
    input: [
      {
        role: 'system',
        content:
          'Return only valid JSON with keys title, executiveSummary, dprReport, financialProjections, profitAnalysis, breakEvenAnalysis, msmeFormat, bankReadiness. Array sections must contain practical bank-ready points for PMEGP/MSME style project reports.',
      },
      {
        role: 'user',
        content: JSON.stringify(input),
      },
    ],
  });

  try {
    return parseJson(response.output_text);
  } catch {
    throw new HttpsError('internal', 'AI MSME report response could not be parsed.');
  }
});
