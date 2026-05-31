import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Mic, Send, Sparkles, Volume2 } from 'lucide-react';
import { OpenAIKeyWarning } from '../../components/ai/OpenAIKeyWarning';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useBusinessData } from '../../contexts/BusinessDataContext';
import { useSpeech } from '../../hooks/useSpeech';
import { saveChatMessage } from '../../services/firestoreService';
import { isOpenAIConfigured, sendBusinessChatMessage } from '../../services/openaiService';
import type { ChatMessage } from '../../types';
import { buildBusinessMetrics } from '../../utils/analyticsEngine';

const CHAT_STORAGE_KEY = 'business-partner-chat';

const loadMessages = (): ChatMessage[] => {
  try {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    const parsed = saved ? (JSON.parse(saved) as ChatMessage[]) : [];
    return parsed.filter((m) => m.id !== 'welcome');
  } catch {
    return [];
  }
};

export const AIChatPage = () => {
  const { profile } = useAuth();
  const { transactions, customers } = useBusinessData();
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { listening, listen, speak } = useSpeech();

  const businessContext = useMemo(
    () => ({
      userName: profile.name,
      userTitle: profile.title,
      metrics: buildBusinessMetrics(transactions, customers, profile.name),
    }),
    [profile.name, profile.title, transactions, customers]
  );

  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!input.trim() || !isOpenAIConfigured()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    const priorHistory = messages.map(({ role, content }) => ({ role, content }));

    setMessages((current) => [...current, userMessage]);
    void saveChatMessage(profile.id, userMessage);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const reply = await sendBusinessChatMessage(userMessage.content, priorHistory, businessContext);
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: reply,
        createdAt: new Date().toISOString(),
      };
      setMessages((current) => [...current, assistantMessage]);
      void saveChatMessage(profile.id, assistantMessage);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'AI chat failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid h-[calc(100vh-8rem)] gap-4">
      <div>
        <h1 className="font-display text-3xl font-black">AI Chat Assistant</h1>
        <p className="mt-2 text-slate-400">
          McKinsey-grade strategy, CA/CFO finance, and startup growth advice — powered by live OpenAI.
        </p>
      </div>
      <OpenAIKeyWarning />
      <Card className="grid min-h-0 grid-rows-[1fr_auto] border-cyan-300/20 bg-slate-950/80 text-white">
        <div className="min-h-0 overflow-y-auto pr-1">
          <div className="grid gap-4">
            {!messages.length && !loading ? (
              <p className="rounded-lg border border-dashed border-white/10 p-8 text-center text-sm text-slate-400">
                Start a conversation — AI uses your business metrics and chat history for unique, context-aware replies.
              </p>
            ) : null}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-lg p-4 text-sm leading-6 ${
                    message.role === 'user'
                      ? 'bg-cyan-300 text-slate-950'
                      : 'border border-white/10 bg-white/10 text-slate-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.role === 'assistant' ? (
                    <button
                      type="button"
                      className="mt-3 inline-flex items-center gap-2 text-xs text-cyan-200"
                      onClick={() => speak(message.content)}
                    >
                      <Volume2 className="h-3.5 w-3.5" /> Voice reply
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
            {loading ? (
              <div className="flex justify-start">
                <div className="rounded-lg border border-cyan-300/20 bg-white/10 p-4 text-sm text-cyan-100">
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-pulse" /> Consulting OpenAI...
                  </span>
                </div>
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>
        </div>
        <form
          className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-[auto_1fr_auto]"
          onSubmit={submit}
        >
          <Button type="button" variant="secondary" loading={listening} onClick={() => listen(setInput)} disabled={!isOpenAIConfigured()}>
            <Mic className="h-4 w-4" /> Voice
          </Button>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask in English, Hindi, or Hinglish..."
            disabled={!isOpenAIConfigured()}
            className="min-h-12 rounded-lg border border-cyan-300/20 bg-white/10 px-4 text-white outline-none focus:border-cyan-300 disabled:opacity-50"
          />
          <Button loading={loading} disabled={!isOpenAIConfigured()}>
            <Send className="h-4 w-4" /> Send
          </Button>
          {error ? <p className="text-sm text-red-300 sm:col-span-3">{error}</p> : null}
        </form>
      </Card>
    </div>
  );
};
