import { useState } from 'react';
import { Languages, Mic, Volume2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useSpeech } from '../../hooks/useSpeech';
import { sendBusinessChatMessage } from '../../services/openaiService';

export const VoiceAssistantPage = () => {
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('Press the mic and ask a business question. I can reply in Hindi or English.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { listening, listen, speak } = useSpeech();

  const ask = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    try {
      const answer = await sendBusinessChatMessage(`${language} voice query: ${text}`, []);
      setReply(answer);
      speak(answer);
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
    });
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-black">AI Voice Assistant</h1>
        <p className="mt-2 text-slate-400">Talk with your AI business advisor in Hindi or English with voice input and voice output.</p>
      </div>
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
            className="grid h-28 w-28 place-items-center rounded-full border border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_80px_rgba(34,211,238,.26)] transition hover:scale-105"
          >
            <Mic className={`h-12 w-12 text-cyan-200 ${listening ? 'animate-pulse' : ''}`} />
          </button>
          <p className="mt-5 text-sm text-slate-400">{listening ? 'Listening...' : loading ? 'AI is thinking...' : 'Tap mic to speak'}</p>
        </div>
        {transcript ? <div className="rounded-lg bg-cyan-300 p-4 text-sm font-semibold text-slate-950">You said: {transcript}</div> : null}
        <div className="rounded-lg bg-white/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-cyan-200"><Volume2 className="h-4 w-4" /> AI Reply</div>
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-200">{reply}</p>
          <Button className="mt-4" variant="secondary" onClick={() => speak(reply)}>Speak Again</Button>
        </div>
        {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}
      </Card>
    </div>
  );
};
