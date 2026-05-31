import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Languages, Volume2, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAIAssistant } from '../../contexts/AIAssistantContext';

export const AIAssistantPanel = () => {
  const {
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
    speakCurrentInsight,
    clearInsight,
  } = useAIAssistant();

  return (
    <AnimatePresence>
      {panelOpen ? (
        <motion.aside
          initial={{ x: 420, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 420, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="fixed bottom-4 right-4 top-20 z-50 flex w-[min(100vw-2rem,24rem)] flex-col overflow-hidden rounded-2xl border border-cyan-400/25 bg-slate-950/85 shadow-[0_0_80px_rgba(34,211,238,.18)] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-300/20">
                <Bot className="h-5 w-5 text-cyan-300" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">AI Advisor</p>
                <p className="text-sm font-semibold text-white">{insightTitle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-white/10 px-4 py-3">
            <Button
              variant={language === 'English' ? 'primary' : 'secondary'}
              className="!py-1.5 !text-xs"
              onClick={() => setLanguage('English')}
            >
              <Languages className="h-3.5 w-3.5" /> EN
            </Button>
            <Button
              variant={language === 'Hindi' ? 'primary' : 'secondary'}
              className="!py-1.5 !text-xs"
              onClick={() => setLanguage('Hindi')}
            >
              <Languages className="h-3.5 w-3.5" /> HI
            </Button>
            <button
              type="button"
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${autoSpeak ? 'bg-cyan-300/20 text-cyan-200' : 'bg-white/10 text-slate-400'}`}
            >
              Auto Voice {autoSpeak ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="grid gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-4 animate-pulse rounded bg-white/10" style={{ width: `${90 - i * 15}%` }} />
                ))}
                <p className="text-sm text-cyan-200">Analyzing business data...</p>
              </div>
            ) : error ? (
              <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p>
            ) : insight ? (
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">{insight}</p>
            ) : (
              <p className="text-sm text-slate-400">
                Click any chart, stat card, or analytics metric to get AI-powered voice insights.
              </p>
            )}
          </div>

          <div className="flex gap-2 border-t border-white/10 p-4">
            <Button variant="secondary" className="flex-1" onClick={speakCurrentInsight} disabled={!insight}>
              <Volume2 className="h-4 w-4" /> Speak
            </Button>
            <Button variant="secondary" onClick={clearInsight}>
              Clear
            </Button>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
};
