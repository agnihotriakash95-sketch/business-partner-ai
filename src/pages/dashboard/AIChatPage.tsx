import { FormEvent, useEffect, useRef, useState } from 'react';
import { Mic, Send, Sparkles, Volume2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useSpeech } from '../../hooks/useSpeech';
import { sendBusinessChatMessage } from '../../services/openaiService';
import type { ChatMessage } from '../../types';

const starterMessages: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: 'Hi Akash, I am your AI business operating assistant. Ask me about finance, marketing, recovery, customers, MSME planning, or Hinglish business advice.',
    createdAt: new Date().toISOString(),
  },
];

export const AIChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('business-partner-chat');
    return saved ? (JSON.parse(saved) as ChatMessage[]) : starterMessages;
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { listening, listen, speak } = useSpeech();

  useEffect(() => {
    localStorage.setItem('business-partner-chat', JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!input.trim()) return;
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: input, createdAt: new Date().toISOString() };
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setLoading(true);
    setError('');
    try {
      const reply = await sendBusinessChatMessage(userMessage.content, messages.map(({ role, content }) => ({ role, content })));
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'assistant', content: reply, createdAt: new Date().toISOString() }]);
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
        <p className="mt-2 text-slate-400">Business advice, finance, marketing, recovery, CRM, Hindi and English support.</p>
      </div>
      <Card className="grid min-h-0 grid-rows-[1fr_auto] border-cyan-300/20 bg-slate-950/80 text-white">
        <div className="min-h-0 overflow-y-auto pr-1">
          <div className="grid gap-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] rounded-lg p-4 text-sm leading-6 ${message.role === 'user' ? 'bg-cyan-300 text-slate-950' : 'border border-white/10 bg-white/10 text-slate-100'}`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.role === 'assistant' ? (
                    <button type="button" className="mt-3 inline-flex items-center gap-2 text-xs text-cyan-200" onClick={() => speak(message.content)}>
                      <Volume2 className="h-3.5 w-3.5" /> Voice reply
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
            {loading ? (
              <div className="flex justify-start">
                <div className="rounded-lg border border-cyan-300/20 bg-white/10 p-4 text-sm text-cyan-100">
                  <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 animate-pulse" /> AI is typing...</span>
                </div>
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>
        </div>
        <form className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-[auto_1fr_auto]" onSubmit={submit}>
          <Button type="button" variant="secondary" loading={listening} onClick={() => listen(setInput)}>
            <Mic className="h-4 w-4" /> Voice
          </Button>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask in English, Hindi, or Hinglish..."
            className="min-h-12 rounded-lg border border-cyan-300/20 bg-white/10 px-4 text-white outline-none focus:border-cyan-300"
          />
          <Button loading={loading}>
            <Send className="h-4 w-4" /> Send
          </Button>
          {error ? <p className="text-sm text-red-300 sm:col-span-3">{error}</p> : null}
        </form>
      </Card>
    </div>
  );
};
