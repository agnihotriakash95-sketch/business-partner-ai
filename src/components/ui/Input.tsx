import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => (
  <label className="grid gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">
    {label}
    <input
      className={`rounded-lg border border-black/10 bg-white px-3 py-3 text-neutral-950 outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-300/30 dark:border-white/10 dark:bg-white/10 dark:text-white ${className}`}
      {...props}
    />
    {error ? <span className="text-xs text-red-500">{error}</span> : null}
  </label>
);

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = ({ label, error, className = '', ...props }: TextareaProps) => (
  <label className="grid gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">
    {label}
    <textarea
      className={`min-h-28 rounded-lg border border-black/10 bg-white px-3 py-3 text-neutral-950 outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-300/30 dark:border-white/10 dark:bg-white/10 dark:text-white ${className}`}
      {...props}
    />
    {error ? <span className="text-xs text-red-500">{error}</span> : null}
  </label>
);
