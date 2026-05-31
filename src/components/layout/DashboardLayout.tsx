import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AIAssistantPanel } from '../ai/AIAssistantPanel';
import { AIAssistantProvider } from '../../contexts/AIAssistantContext';
import { BusinessDataProvider } from '../../contexts/BusinessDataContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const DashboardLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <BusinessDataProvider>
      <AIAssistantProvider>
        <div className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,.16),transparent_32%),#020617] text-white">
          <div className="lg:grid lg:grid-cols-[18rem_1fr]">
            <Sidebar open={open} onClose={() => setOpen(false)} />
            <main className="min-w-0">
              <Topbar onMenu={() => setOpen(true)} />
              <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
                <Outlet />
              </div>
            </main>
          </div>
          <AIAssistantPanel />
        </div>
      </AIAssistantProvider>
    </BusinessDataProvider>
  );
};
