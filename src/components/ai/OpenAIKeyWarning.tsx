import { AlertTriangle } from 'lucide-react';
import { isOpenAIConfigured, OPENAI_KEY_WARNING } from '../../services/openaiService';

export const OpenAIKeyWarning = () => {
  if (isOpenAIConfigured()) return null;

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-400/40 bg-amber-500/10 px-5 py-4 text-amber-100">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
      <div>
        <p className="font-semibold text-amber-200">OpenAI Not Configured</p>
        <p className="mt-1 text-sm leading-6 text-amber-100/90">{OPENAI_KEY_WARNING}</p>
      </div>
    </div>
  );
};
