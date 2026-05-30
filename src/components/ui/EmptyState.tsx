import type { LucideIcon } from 'lucide-react';
import { Card } from './Card';

export const EmptyState = ({ icon: Icon, title, message }: { icon: LucideIcon; title: string; message: string }) => (
  <Card className="grid place-items-center gap-3 py-10 text-center">
    <Icon className="h-9 w-9 text-gold-400" />
    <h3 className="font-semibold text-neutral-950 dark:text-white">{title}</h3>
    <p className="max-w-md text-sm text-neutral-500 dark:text-neutral-400">{message}</p>
  </Card>
);
