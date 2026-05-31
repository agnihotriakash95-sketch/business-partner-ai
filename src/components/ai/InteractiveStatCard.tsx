import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface InteractiveStatCardProps {
  title: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  onAnalyze?: () => void;
  loading?: boolean;
  highlight?: boolean;
}

export const InteractiveStatCard = ({
  title,
  value,
  trend,
  icon: Icon,
  onAnalyze,
  loading,
  highlight,
}: InteractiveStatCardProps) => (
  <motion.button
    type="button"
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onAnalyze}
    disabled={loading}
    className={`group relative w-full overflow-hidden rounded-2xl border p-5 text-left transition ${
      highlight
        ? 'border-cyan-300/50 bg-gradient-to-br from-cyan-400/10 to-slate-950/90 shadow-[0_0_40px_rgba(34,211,238,.12)]'
        : 'border-white/10 bg-slate-950/70 backdrop-blur-sm hover:border-cyan-300/30'
    } ${onAnalyze ? 'cursor-pointer' : 'cursor-default'}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 to-cyan-400/5 opacity-0 transition group-hover:opacity-100" />
    <div className="relative flex items-center justify-between">
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <span className="rounded-xl bg-cyan-300/15 p-2.5 text-cyan-300">
        <Icon className="h-5 w-5" />
      </span>
    </div>
    <div className="relative mt-4">
      <p className="font-display text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm text-emerald-400">{trend}</p>
    </div>
    {onAnalyze ? (
      <p className="relative mt-3 flex items-center gap-1.5 text-xs font-semibold text-cyan-300/80 opacity-0 transition group-hover:opacity-100">
        <Sparkles className="h-3.5 w-3.5" />
        {loading ? 'AI analyzing...' : 'Tap for AI voice insight'}
      </p>
    ) : null}
  </motion.button>
);
