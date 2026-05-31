import {
  BadgeDollarSign,
  BarChart3,
  Bot,
  Building2,
  FileImage,
  FileScan,
  FileText,
  LayoutDashboard,
  Landmark,
  LifeBuoy,
  MessageSquareText,
  Mic,
  CreditCard,
  ShieldCheck,
  Settings,
  Users,
  WalletCards,
} from 'lucide-react';

import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },

  {
    to: '/dashboard/chat',
    label: 'AI Chat',
    icon: MessageSquareText,
  },

  {
    to: '/dashboard/voice',
    label: 'AI Voice',
    icon: Mic,
  },

  {
    to: '/dashboard/images',
    label: 'AI Image Generator',
    icon: FileImage,
  },

  {
    to: '/dashboard/msme-reports',
    label: 'MSME Reports',
    icon: Landmark,
  },

  {
    to: '/dashboard/dpr',
    label: 'DPR Reports',
    icon: FileText,
  },

  {
    to: '/dashboard/payment',
    label: 'Payments',
    icon: CreditCard,
  },

  {
    to: '/dashboard/subscription',
    label: 'Upgrade Plans',
    icon: WalletCards,
  },

  {
    to: '/dashboard/finance',
    label: 'Finance',
    icon: WalletCards,
  },

  {
    to: '/dashboard/customers',
    label: 'CRM',
    icon: Users,
  },

  {
    to: '/dashboard/collections',
    label: 'Collections',
    icon: BadgeDollarSign,
  },

  {
    to: '/dashboard/analytics',
    label: 'Analytics',
    icon: BarChart3,
  },

  {
    to: '/dashboard/reports',
    label: 'Reports',
    icon: FileText,
  },

  {
    to: '/dashboard/recovery',
    label: 'Recovery',
    icon: LifeBuoy,
  },

  {
    to: '/dashboard/scanner',
    label: 'Scanner',
    icon: FileScan,
  },

  {
    to: '/dashboard/analyzer',
    label: 'AI Analyzer',
    icon: Bot,
  },

  {
    to: '/dashboard/settings',
    label: 'Settings',
    icon: Settings,
  },

  {
    to: '/dashboard/admin',
    label: 'Admin',
    icon: ShieldCheck,
  },
];

export const Sidebar = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { profile } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      <button
        type="button"
        aria-label="Close navigation"
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden ${
          open ? 'block' : 'hidden'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-cyan-400/20 bg-slate-950 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="border-b border-cyan-400/10 px-5 py-6">
          <NavLink
            to="/"
            className="flex items-center gap-3"
            onClick={onClose}
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-300 text-slate-950 shadow-[0_0_35px_rgba(103,232,249,.35)]">
              <Building2 className="h-6 w-6" />
            </span>

            <div>
              <h1 className="font-display text-xl font-black text-white">
                Business Partner
              </h1>

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                AI OS
              </p>
            </div>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="flex max-h-[calc(100vh-220px)] flex-col gap-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-300 text-slate-950 shadow-[0_0_25px_rgba(103,232,249,.25)]'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5" />

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Profile */}
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-cyan-400/20 bg-slate-900 p-4 shadow-[0_0_25px_rgba(0,255,255,.08)]">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-300 font-black text-slate-950">
              {profile?.name
                ?.split(' ')
                ?.map((part: string) => part[0])
                ?.join('')
                ?.slice(0, 2) || 'AA'}
            </span>

            {/* User Info */}
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                {profile?.name || 'Akash Agnihotri'}
              </p>

              <p className="truncate text-xs text-cyan-200">
                {profile?.title || 'CEO & Founder'}
              </p>
            </div>
          </div>

          {/* Upgrade Button */}
          <NavLink
            to="/dashboard/subscription"
            className="mt-4 flex items-center justify-center rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.02]"
          >
            Upgrade Plan
          </NavLink>
        </div>
      </aside>
    </>
  );
};