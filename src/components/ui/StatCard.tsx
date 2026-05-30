import type { LucideIcon } from 'lucide-react';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  icon: LucideIcon;
}

export const StatCard = ({ title, value, trend, icon: Icon }: StatCardProps) => (
  <Card className="grid gap-4">
    <div className="flex items-center justify-between">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">{title}</p>
      <span className="rounded-lg bg-gold-400/15 p-2 text-gold-500 dark:text-gold-300">
        <Icon className="h-5 w-5" />
      </span>
    </div>
    <div>
      <p className="text-2xl font-bold text-neutral-950 dark:text-white">{value}</p>
      <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-300">{trend}</p>
    </div>
  </Card>
);
