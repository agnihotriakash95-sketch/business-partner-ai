import { Building2 } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

export const AuthLayout = () => (
  <div className="grid min-h-screen bg-slate-950 text-white lg:grid-cols-[.95fr_1.05fr]">
    <section className="hidden border-r border-cyan-300/20 bg-[radial-gradient(circle_at_50%_10%,rgba(34,211,238,.24),transparent_42%),linear-gradient(135deg,#020617,#0f172a_45%,#000)] p-10 text-white lg:grid lg:content-between">
      <Link to="/" className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-300 text-slate-950">
          <Building2 className="h-6 w-6" />
        </span>
        <span className="font-display text-xl font-black">Business Partner AI</span>
      </Link>
      <div>
        <p className="max-w-xl font-display text-5xl font-black leading-tight">Your AI boardroom, finance desk, and recovery coach in one SaaS app.</p>
        <p className="mt-5 max-w-lg text-slate-300">Login to analyze business health, track customers, manage dues, and generate useful reports.</p>
      </div>
      <p className="text-sm text-cyan-200">Production-ready Firebase + OpenAI architecture.</p>
    </section>
    <section className="grid content-center bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,.18),transparent_36%),#020617] px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 flex items-center justify-between lg:justify-end">
          <Link to="/" className="font-display text-lg font-black lg:hidden">Business Partner AI</Link>
          <ThemeToggle />
        </div>
        <Outlet />
      </div>
    </section>
  </div>
);
