import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { explainAnalyticsMetric, generateDashboardInsights, generateGrowthAdvisor } from '../services/openaiService';
import type { AIInsight, BusinessMetricsSnapshot, GrowthAdvisorResponse } from '../types';

type VoiceLanguage = 'English' | 'Hindi';

interface AIAssistantContextValue {
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  insight: string;
  insightTitle: string;
  loading: boolean;
  error: string;
  language: VoiceLanguage;
  setLanguage: (lang: VoiceLanguage) => void;
  autoSpeak: boolean;
  setAutoSpeak: (value: boolean) => void;
  dashboardInsights: AIInsight[];
  growthAdvisor: GrowthAdvisorResponse | null;
  explainMetric: (title: string, data: Record<string, unknown>, speak?: boolean) => Promise<void>;
  loadDashboardInsights: (metrics: BusinessMetricsSnapshot) => Promise<void>;
  loadGrowthAdvisor: (metrics: BusinessMetricsSnapshot) => Promise<void>;
  speakCurrentInsight: () => void;
  clearInsight: () => void;
}

const AIAssistantContext = createContext<AIAssistantContextValue | undefined>(undefined);

export const AIAssistantProvider = ({ children }: { children: React.ReactNode }) => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [insight, setInsight] = useState('');
  const [insightTitle, setInsightTitle] = useState('AI Business Advisor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState<VoiceLanguage>('English');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [dashboardInsights, setDashboardInsights] = useState<AIInsight[]>([]);
  const [growthAdvisor, setGrowthAdvisor] = useState<GrowthAdvisorResponse | null>(null);
  const { speak } = useSpeech();

  const explainMetric = useCallback(
    async (title: string, data: Record<string, unknown>, speakNow = true) => {
      setPanelOpen(true);
      setInsightTitle(title);
      setLoading(true);
      setError('');
      setInsight('');
      try {
        const result = await explainAnalyticsMetric(title, data, language);
        setInsight(result);
        if (speakNow && autoSpeak) speak(result, language);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'AI analysis failed');
      } finally {
        setLoading(false);
      }
    },
    [language, autoSpeak, speak]
  );

  const loadDashboardInsights = useCallback(
    async (metrics: BusinessMetricsSnapshot) => {
      setLoading(true);
      setError('');
      try {
        setDashboardInsights(await generateDashboardInsights(metrics, language));
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Failed to load insights');
      } finally {
        setLoading(false);
      }
    },
    [language]
  );

  const loadGrowthAdvisor = useCallback(async (metrics: BusinessMetricsSnapshot) => {
    setLoading(true);
    setError('');
    try {
      setGrowthAdvisor(await generateGrowthAdvisor(metrics));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Growth advisor failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const speakCurrentInsight = useCallback(() => {
    if (insight) speak(insight, language);
  }, [insight, language, speak]);

  const clearInsight = useCallback(() => {
    setInsight('');
    setInsightTitle('AI Business Advisor');
    setError('');
  }, []);

  const value = useMemo(
    () => ({
      panelOpen,
      setPanelOpen,
      insight,
      insightTitle,
      loading,
      error,
      language,
      setLanguage,
      autoSpeak,
      setAutoSpeak,
      dashboardInsights,
      growthAdvisor,
      explainMetric,
      loadDashboardInsights,
      loadGrowthAdvisor,
      speakCurrentInsight,
      clearInsight,
    }),
    [
      panelOpen,
      insight,
      insightTitle,
      loading,
      error,
      language,
      autoSpeak,
      dashboardInsights,
      growthAdvisor,
      explainMetric,
      loadDashboardInsights,
      loadGrowthAdvisor,
      speakCurrentInsight,
      clearInsight,
    ]
  );

  return <AIAssistantContext.Provider value={value}>{children}</AIAssistantContext.Provider>;
};

export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (!context) throw new Error('useAIAssistant must be used inside AIAssistantProvider');
  return context;
};
