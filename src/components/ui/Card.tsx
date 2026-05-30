import type { HTMLAttributes } from 'react';

export const Card = ({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`rounded-lg border border-black/10 bg-white/80 p-5 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/[0.06] ${className}`}
    {...props}
  />
);
