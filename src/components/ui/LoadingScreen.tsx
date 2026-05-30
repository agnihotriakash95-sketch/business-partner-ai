import { Loader2 } from 'lucide-react';

export const LoadingScreen = () => (
  <div className="grid min-h-screen place-items-center bg-neutral-50 text-neutral-950 dark:bg-obsidian dark:text-white">
    <div className="flex items-center gap-3 rounded-lg border border-gold-400/30 px-5 py-4">
      <Loader2 className="h-5 w-5 animate-spin text-gold-400" />
      <span className="font-medium">Loading Business Partner AI</span>
    </div>
  </div>
);
