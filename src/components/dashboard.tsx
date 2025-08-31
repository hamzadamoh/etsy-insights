'use client';

import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { AdminPanel } from '@/components/admin-panel';
import { Button } from '@/components/ui/button';
import { EtsyInsightsPage } from '@/components/etsy/etsy-insights-page';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';

interface DashboardProps {
  user: User;
  isAdmin: boolean;
  children?: React.ReactNode;
}

export function Dashboard({ user, isAdmin, children }: DashboardProps) {
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-col flex-1">
        <Header 
          user={user} 
          onAdminPanelClick={() => setIsAdminPanelOpen(true)} 
          isAdmin={isAdmin}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children || <EtsyInsightsPage />}
        </main>
        {isAdminPanelOpen && <AdminPanel onClose={() => setIsAdminPanelOpen(false)} />}
        <footer className="py-6 text-center text-sm text-muted-foreground no-print">
          Etsy Insights © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
