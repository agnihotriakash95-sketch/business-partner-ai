import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

interface InteractiveChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onAnalyze?: () => void;
  loading?: boolean;
}

export const InteractiveChartCard = ({
  title,
  subtitle,
  children,
  onAnalyze,
  loading,
}: InteractiveChartCardProps) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-sm transition hover:border-cyan-300/30"
  >
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h2 className="font-display text-xl font-bold text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
      </div>
      {onAnalyze ? (
        <button
          type="button"
          onClick={onAnalyze}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-300/20 disabled:opacity-50"
        >
          <Sparkles className={`h-3.5 w-3.5 ${loading ? 'animate-pulse' : ''}`} />
          {loading ? 'Analyzing...' : 'AI Explain'}
        </button>
      ) : null}
    </div>
    <div className="cursor-crosshair">{children}</div>
    <p className="mt-3 text-xs text-slate-500 opacity-0 transition group-hover:opacity-100">
      Click chart data points for instant AI voice analysis
    </p>
  </motion.div>
);
