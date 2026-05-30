import {
  BadgeDollarSign,
  BarChart3,
  Bot,
  Building2,
  FileImage,
  FileScan,
  LayoutDashboard,
  Landmark,
  MessageSquareText,
  Mic,
  ShieldCheck,
  Settings,
  Users,
  WalletCards,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/chat', label: 'AI Chat', icon: MessageSquareText },
  { to: '/dashboard/voice', label: 'AI Voice', icon: Mic },
  { to: '/dashboard/images', label: 'AI Image Generator', icon: FileImage },
  { to: '/dashboard/msme-reports', label: 'MSME Reports', icon: Landmark },
  { to: '/dashboard/finance', label: 'Finance', icon: WalletCards },
  { to: '/dashboard/customers', label: 'CRM', icon: Users },
  { to: '/dashboard/collections', label: 'Collections', icon: BadgeDollarSign },
  { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/dashboard/scanner', label: 'Scanner', icon: FileScan },
  { to: '/dashboard/analyzer', label: 'AI Analyzer', icon: Bot },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  { to: '/dashboard/admin', label: 'Admin', icon: ShieldCheck },
];

export const Sidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { profile } = useAuth();

  return (
    <>
    <button
      type="button"
      aria-label="Close navigation"
      className={`fixed inset-0 z-30 bg-black/50 lg:hidden ${open ? 'block' : 'hidden'}`}
      onClick={onClose}
    />
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-cyan-300/20 bg-slate-950 p-4 text-white transition-transform lg:static lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <NavLink to="/" className="mb-8 flex items-center gap-3 px-2" onClick={onClose}>
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-300 text-slate-950 shadow-[0_0_30px_rgba(103,232,249,.35)]">
          <Building2 className="h-6 w-6" />
        </span>
        <span>
          <span className="block font-display text-lg font-extrabold text-white">Business Partner</span>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">AI OS</span>
        </span>
      </NavLink>
      <nav className="grid max-h-[calc(100vh-14rem)] gap-1 overflow-y-auto pr-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-cyan-300 text-slate-950 shadow-[0_0_26px_rgba(103,232,249,.28)]'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-cyan-300/20 bg-slate-950 p-4 text-white shadow-glow">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-300 font-black text-slate-950">
            {profile.name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{profile.name}</p>
            <p className="truncate text-xs text-cyan-200">{profile.title}</p>
          </div>
        </div>
      </div>
    </aside>
  </>
  );
};
