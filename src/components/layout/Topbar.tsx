import { Bell, LogOut, Menu, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { ThemeToggle } from '../ui/ThemeToggle';

export const Topbar = ({ onMenu }: { onMenu: () => void }) => {
  const { profile, signOutUser } = useAuth();
  const { unreadCount, markAllRead } = useNotifications();

  return (
    <header className="sticky top-0 z-20 border-b border-cyan-300/20 bg-slate-950/85 px-4 py-3 text-white backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenu}
          className="grid h-11 w-11 place-items-center rounded-lg border border-cyan-300/20 bg-white/10 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-lg border border-cyan-300/20 bg-white/10 px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-neutral-400" />
          <input className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" placeholder="Search customers, reports, insights..." />
        </div>
        <ThemeToggle />
        <button
          type="button"
          aria-label="Notifications"
          onClick={markAllRead}
          className="relative grid h-11 w-11 place-items-center rounded-lg border border-cyan-300/20 bg-white/10"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 ? <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-cyan-300" /> : null}
        </button>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-white">{profile.name}</p>
          <p className="text-xs text-cyan-600 dark:text-cyan-300">{profile.title} · {profile.plan.toUpperCase()}</p>
        </div>
        <button
          type="button"
          aria-label="Sign out"
          onClick={signOutUser}
          className="grid h-11 w-11 place-items-center rounded-lg border border-cyan-300/20 bg-white/10"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};
