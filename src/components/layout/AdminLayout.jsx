import React, { useState } from 'react';
import { TopHeader } from './TopHeader';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileBottomNav } from './MobileBottomNav';

export function AdminLayout({ activeTab, setActiveTab, onOpenStorefront, children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950/85 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors relative z-10 backdrop-blur-[0.5px]">
      <TopHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenStorefront={onOpenStorefront}
      />
      
      <div className="flex flex-1 w-full relative">
        <DesktopSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          onOpenStorefront={onOpenStorefront}
        />

        <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8 pb-24 md:pb-12 max-w-[1680px] mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>

      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
