import { useMemo, useState } from 'react';
import { Languages, Mic, Volume2 } from 'lucide-react';
import { OpenAIKeyWarning } from '../../components/ai/OpenAIKeyWarning';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useBusinessData } from '../../contexts/BusinessDataContext';
import { useSpeech } from '../../hooks/useSpeech';
import { isOpenAIConfigured, sendBusinessChatMessage, type ChatHistoryMessage } from '../../services/openaiService';
import { buildBusinessMetrics } from '../../utils/analyticsEngine';

export const VoiceAssistantPage = () => {
  const { profile } = useAuth();
  const { transactions, customers } = useBusinessData();
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('');
  const [history, setHistory] = useState<ChatHistoryMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { listening, listen, speak } = useSpeech();

  const businessContext = useMemo(
    () => ({
      userName: profile.name,
      userTitle: profile.title,
      metrics: buildBusinessMetrics(transactions, customers, profile.name),
    }),
    [profile.name, profile.title, transactions, customers]
  );

  const ask = async (text: string) => {
    if (!text.trim() || !isOpenAIConfigured()) return;
    setLoading(true);
    setError('');
    try {
      const query = `[${language} voice] ${text}`;
      const answer = await sendBusinessChatMessage(query, history, businessContext);
      setReply(answer);
      setHistory((prev) => [
        ...prev.slice(-14),
        { role: 'user', content: text },
        { role: 'assistant', content: answer },
      ]);
      speak(answer, language);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Voice assistant failed');
    } finally {
      setLoading(false);
    }
  };

  const start = () => {
    listen((text) => {
      setTranscript(text);
      void ask(text);
    }, language);
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-black">AI Voice Assistant</h1>
        <p className="mt-2 text-slate-400">Live OpenAI voice briefings with conversation memory.</p>
      </div>
      <OpenAIKeyWarning />
      <Card className="grid gap-6 border-cyan-300/20 bg-slate-950/80 text-white">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant={language === 'English' ? 'primary' : 'secondary'} onClick={() => setLanguage('English')}>
            <Languages className="h-4 w-4" /> English
          </Button>
          <Button variant={language === 'Hindi' ? 'primary' : 'secondary'} onClick={() => setLanguage('Hindi')}>
            <Languages className="h-4 w-4" /> Hindi
          </Button>
        </div>
        <div className="grid place-items-center rounded-lg border border-cyan-300/20 bg-white/5 p-10 text-center">
          <button
            type="button"
            onClick={start}
            disabled={!isOpenAIConfigured() || loading}
            className="grid h-28 w-28 place-items-center rounded-full border border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_80px_rgba(34,211,238,.26)] transition hover:scale-105 disabled:opacity-50"
          >
            <Mic className={`h-12 w-12 text-cyan-200 ${listening ? 'animate-pulse' : ''}`} />
          </button>
          <p className="mt-5 text-sm text-slate-400">
            {listening ? 'Listening...' : loading ? 'OpenAI is analyzing...' : 'Tap mic to speak'}
          </p>
        </div>
        {transcript ? (
          <div className="rounded-lg bg-cyan-300 p-4 text-sm font-semibold text-slate-950">You said: {transcript}</div>
        ) : null}
        <div className="rounded-lg bg-white/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-cyan-200">
            <Volume2 className="h-4 w-4" /> AI Reply
          </div>
          {reply ? (
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-200">{reply}</p>
          ) : (
            <p className="text-sm text-slate-500">AI response will appear after your first question.</p>
          )}
          {reply ? (
            <Button className="mt-4" variant="secondary" onClick={() => speak(reply, language)}>
              Speak Again
            </Button>
          ) : null}
        </div>
        {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}
      </Card>
    </div>
  );
};
