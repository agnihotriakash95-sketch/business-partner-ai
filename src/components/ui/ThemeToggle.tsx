import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === 'dark' ? Sun : Moon;

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="grid h-11 w-11 place-items-center rounded-lg border border-black/10 bg-white/80 text-neutral-800 transition hover:border-gold-400 dark:border-white/10 dark:bg-white/10 dark:text-white"
    >
      <Icon className="h-5 w-5" />
    </button>
  );
};
