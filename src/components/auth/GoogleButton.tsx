import { Loader2 } from 'lucide-react';

export const GoogleButton = ({ children, loading, onClick }: { children: string; loading?: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="group relative inline-flex min-h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-lg border border-cyan-300/30 bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-[0_18px_50px_rgba(14,165,233,0.18)] transition hover:border-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
  >
    <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,.22),transparent_45%)] opacity-80 transition group-hover:opacity-100" />
    {loading ? (
      <Loader2 className="relative h-5 w-5 animate-spin text-cyan-200" />
    ) : (
      <span className="relative grid h-6 w-6 place-items-center rounded-full bg-white">
        <span className="font-black text-blue-600">G</span>
      </span>
    )}
    <span className="relative">{children}</span>
  </button>
);
