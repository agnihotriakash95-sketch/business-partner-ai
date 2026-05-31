import type {
  BusinessAnalysis,
  BusinessAnalysisInput,
  BusinessMetricsSnapshot,
  CollectionMessage,
  GeneratedImage,
  GrowthAdvisorResponse,
  MsmeReport,
  MsmeReportInput,
  ReportPeriod,
} from '../types';

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
const MODEL = 'gpt-4o-mini';
const IMAGE_MODEL = 'dall-e-3';
const CHAT_TEMPERATURE = 0.9;
const MAX_TOKENS = 1200;

export const OPENAI_KEY_WARNING = 'OpenAI API key missing. Add VITE_OPENAI_API_KEY in Vercel.';

export interface ChatBusinessContext {
  userName?: string;
  userTitle?: string;
  businessType?: string;
  metrics?: BusinessMetricsSnapshot;
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

const CONSULTANT_SYSTEM = `You are Business Partner AI — a senior advisory team combining McKinsey strategy, CA audit rigor, CFO financial discipline, startup mentorship, and marketing leadership for Indian MSMEs and growth-stage companies.

Behavior:
- Every reply must be unique, specific, and grounded in the user's context and numbers.
- Explain financial logic: WHY profit, cashflow, or sales moved — not generic tips.
- Give concrete strategies with timelines, metrics, and trade-offs.
- Match the user's language (English, Hindi, or Hinglish).
- Never use placeholder text, lorem ipsum, or copy-paste templates.
- Vary structure and examples every response — avoid repeating prior phrasing.`;

const log = {
  request: (label: string, detail?: unknown) => console.log(`[OpenAI] → ${label}`, detail ?? ''),
  response: (label: string, status: number, preview?: string) =>
    console.log(`[OpenAI] ← ${label} status=${status}`, preview ? preview.slice(0, 120) : ''),
  error: (label: string, err: unknown) => console.error(`[OpenAI] ✗ ${label}`, err),
  warn: (msg: string) => console.warn(`[OpenAI] ⚠ ${msg}`),
};

export const isOpenAIConfigured = (): boolean => Boolean(openaiApiKey?.trim());

const requireApiKey = (): string => {
  if (!openaiApiKey?.trim()) {
    log.warn(OPENAI_KEY_WARNING);
    throw new Error(OPENAI_KEY_WARNING);
  }
  return openaiApiKey.trim();
};

const parseJson = <T>(text: string): T => {
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  return JSON.parse(cleaned) as T;
};

const buildContextBlock = (ctx?: ChatBusinessContext): string => {
  if (!ctx) return '';
  const parts: string[] = [];
  if (ctx.userName) parts.push(`Founder: ${ctx.userName}${ctx.userTitle ? ` (${ctx.userTitle})` : ''}`);
  if (ctx.businessType) parts.push(`Business type: ${ctx.businessType}`);
  if (ctx.metrics) {
    parts.push(
      `Live metrics — Revenue: INR ${ctx.metrics.revenue}, Expenses: INR ${ctx.metrics.expenses}, Profit: INR ${ctx.metrics.profit}, Margin: ${ctx.metrics.margin}%, Pending dues: INR ${ctx.metrics.pendingDues}, Health score: ${ctx.metrics.healthScore}/100, Cashflow: ${ctx.metrics.cashflowStatus}`
    );
  }
  return parts.length ? `\n\nBusiness context:\n${parts.join('\n')}` : '';
};

async function chatCompletion(
  taskPrompt: string,
  userContent: string,
  history: ChatHistoryMessage[] = [],
  businessContext?: ChatBusinessContext,
  temperature = CHAT_TEMPERATURE
): Promise<string> {
  const key = requireApiKey();
  const contextBlock = buildContextBlock(businessContext);
  const messages = [
    { role: 'system' as const, content: `${CONSULTANT_SYSTEM}\n\n${taskPrompt}${contextBlock}` },
    ...history.slice(-16).map((m) => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content: userContent },
  ];

  log.request('chat/completions', { model: MODEL, messages: messages.length, temperature, max_tokens: MAX_TOKENS });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature,
      max_tokens: MAX_TOKENS,
    }),
  });

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
  };

  log.response('chat/completions', response.status, data.choices?.[0]?.message?.content);

  if (!response.ok) {
    const msg = data.error?.message || `OpenAI HTTP ${response.status}`;
    log.error('chat/completions', msg);
    throw new Error(msg);
  }

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    log.error('chat/completions', 'Empty response body');
    throw new Error('OpenAI returned an empty response.');
  }

  return content;
}

async function jsonCompletion<T>(
  taskPrompt: string,
  userContent: string,
  businessContext?: ChatBusinessContext
): Promise<T> {
  const text = await chatCompletion(
    `${taskPrompt}\n\nReturn ONLY valid JSON. No markdown fences.`,
    userContent,
    [],
    businessContext,
    0.75
  );
  try {
    return parseJson<T>(text);
  } catch (err) {
    log.error('json parse', err);
    throw new Error('AI returned invalid JSON. Please retry.');
  }
}

export const sendBusinessChatMessage = async (
  message: string,
  history: ChatHistoryMessage[] = [],
  businessContext?: ChatBusinessContext
): Promise<string> => {
  return chatCompletion(
    'You are in a live business chat. Use conversation history and business context. Be direct, strategic, and actionable.',
    message,
    history,
    businessContext,
    CHAT_TEMPERATURE
  );
};

export const analyzeBusiness = async (
  input: BusinessAnalysisInput,
  businessContext?: ChatBusinessContext
): Promise<BusinessAnalysis> => {
  return jsonCompletion<BusinessAnalysis>(
    `Deep business analysis. JSON keys: summary, healthScore (0-100), businessReport, growthOpportunities, riskAnalysis, costCutting, revenueIdeas, competitorStrategy, actionPlan. Each section: { title, points: string[] }. Explain WHY performance changed.`,
    JSON.stringify(input),
    businessContext
  );
};

export const generateReport = async (
  period: ReportPeriod,
  businessName: string,
  businessContext?: ChatBusinessContext
): Promise<string> => {
  return chatCompletion(
    'Write an executive business report with revenue analysis, cash flow, risks, and prioritized actions.',
    `Create a ${period} report for: ${businessName}`,
    [],
    businessContext
  );
};

export const generateRecoveryPlan = async (
  problem: string,
  businessContext?: ChatBusinessContext
): Promise<string[]> => {
  const parsed = await jsonCompletion<{ steps: string[] }>(
    'Recovery plan JSON: { steps: string[3] } — diagnosis, strategy, 7-day action plan.',
    problem,
    businessContext
  );
  return parsed.steps;
};

export const generateCollectionMessage = async (
  customerName: string,
  amountDue: number,
  businessContext?: ChatBusinessContext
): Promise<CollectionMessage> => {
  return jsonCompletion<CollectionMessage>(
    'Collection reminder JSON: { whatsapp, emailSubject, emailBody }',
    `Reminder for ${customerName}, INR ${amountDue} pending.`,
    businessContext
  );
};

export const generateBusinessImages = async (prompt: string, type: string): Promise<GeneratedImage[]> => {
  const key = requireApiKey();
  const imagePrompt = `Professional HD ${type} for a premium Indian business. ${prompt}`;

  log.request('images/generations', { model: IMAGE_MODEL, type });

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: IMAGE_MODEL,
      prompt: imagePrompt,
      n: 2,
      size: '1024x1024',
      quality: 'hd',
    }),
  });

  const data = (await response.json()) as {
    data?: { url?: string; revised_prompt?: string }[];
    error?: { message?: string };
  };

  log.response('images/generations', response.status);

  if (!response.ok) {
    const msg = data.error?.message || 'Image generation failed';
    log.error('images/generations', msg);
    throw new Error(msg);
  }

  const images = (data.data || [])
    .filter((image) => image.url)
    .map((image, index) => ({
      id: `${Date.now()}-${index}`,
      prompt: image.revised_prompt || prompt,
      type,
      url: String(image.url),
      createdAt: new Date().toISOString(),
    }));

  if (!images.length) throw new Error('OpenAI returned no images.');
  return images;
};

export const generateMsmeReport = async (
  input: MsmeReportInput,
  businessContext?: ChatBusinessContext
): Promise<MsmeReport> => {
  return jsonCompletion<MsmeReport>(
    'MSME bank report JSON: title, executiveSummary, dprReport[], financialProjections[], profitAnalysis[], breakEvenAnalysis[], msmeFormat[], bankReadiness[]',
    JSON.stringify(input),
    businessContext
  );
};

export const explainAnalyticsMetric = async (
  metricName: string,
  metricData: Record<string, unknown>,
  language: 'English' | 'Hindi' = 'English',
  businessContext?: ChatBusinessContext
): Promise<string> => {
  return chatCompletion(
    `CFO-style analytics briefing. ${language === 'Hindi' ? 'Respond in Hindi.' : 'English.'} Under 150 words: what data shows, WHY it changed, risks, 2 actions.`,
    `Metric "${metricName}":\n${JSON.stringify(metricData, null, 2)}`,
    [],
    businessContext
  );
};

export const generateDashboardInsights = async (
  metrics: BusinessMetricsSnapshot,
  language: 'English' | 'Hindi' = 'English'
): Promise<{ title: string; insight: string }[]> => {
  const result = await jsonCompletion<{ insights: { title: string; insight: string }[] }>(
    `3 unique dashboard insights JSON. ${language === 'Hindi' ? 'Hindi text.' : 'English.'} Use exact numbers from input.`,
    JSON.stringify(metrics),
    { metrics }
  );
  return result.insights;
};

export const generateGrowthAdvisor = async (metrics: BusinessMetricsSnapshot): Promise<GrowthAdvisorResponse> => {
  return jsonCompletion<GrowthAdvisorResponse>(
    'Growth advisor JSON: growthStrategies[], marketingPlans[], salesImprovements[], hiringRecommendations[], costReduction[], scalingOpportunities[], fundingReadiness[], investorPrep[] — 2-3 unique items each.',
    JSON.stringify(metrics),
    { metrics }
  );
};

export const generateEnterpriseForecast = async (
  metrics: BusinessMetricsSnapshot
): Promise<{ forecast: string; growthScore: number; riskScore: number; prediction: string }> => {
  return jsonCompletion<{ forecast: string; growthScore: number; riskScore: number; prediction: string }>(
    'Forecast JSON: forecast (INR string), growthScore 0-100, riskScore 0-100, prediction (2 sentences).',
    JSON.stringify(metrics),
    { metrics }
  );
};

if (!openaiApiKey?.trim() && import.meta.env.DEV) {
  log.warn(OPENAI_KEY_WARNING);
}
