import { CheckCircle2, XCircle } from 'lucide-react';

export const Toast = ({ type, message, onClose }: { type: 'success' | 'error'; message: string; onClose: () => void }) => {
  const Icon = type === 'success' ? CheckCircle2 : XCircle;
  return (
    <div className="fixed right-4 top-4 z-50 max-w-sm rounded-lg border border-white/10 bg-slate-950/95 p-4 text-white shadow-glow backdrop-blur">
      <div className="flex gap-3">
        <Icon className={`mt-0.5 h-5 w-5 ${type === 'success' ? 'text-cyan-300' : 'text-red-400'}`} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{type === 'success' ? 'Success' : 'Authentication issue'}</p>
          <p className="mt-1 text-sm leading-5 text-slate-300">{message}</p>
        </div>
        <button type="button" className="text-slate-400 hover:text-white" onClick={onClose} aria-label="Dismiss notification">
          x
        </button>
      </div>
    </div>
  );
};
