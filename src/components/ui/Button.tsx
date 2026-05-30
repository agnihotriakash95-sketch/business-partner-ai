import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
}

const variants = {
  primary: 'bg-gold-400 text-black hover:bg-gold-300 shadow-glow',
  secondary: 'border border-gold-400/40 bg-white/70 text-neutral-950 hover:border-gold-400 dark:bg-white/10 dark:text-white',
  ghost: 'text-neutral-700 hover:bg-black/5 dark:text-neutral-200 dark:hover:bg-white/10',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

export const Button = ({ children, className = '', variant = 'primary', loading, disabled, ...props }: ButtonProps) => (
  <button
    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-gold-300 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
    {children}
  </button>
);
