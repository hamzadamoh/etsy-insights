'use client';

import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { AdminPanel } from '@/components/admin-panel';
import { Button } from '@/components/ui/button';
import { EtsyInsightsPage } from '@/components/etsy/etsy-insights-page';
import { Header } from '@/components/layout/header';

interface DashboardProps {
  user: User;
  isAdmin: boolean;
}

export function Dashboard({ user, isAdmin }: DashboardProps) {
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header user={user} onAdminPanelClick={() => setIsAdminPanelOpen(true)} isAdmin={isAdmin} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <EtsyInsightsPage />
      </main>
      {isAdminPanelOpen && <AdminPanel onClose={() => setIsAdminPanelOpen(false)} />}
      <footer className="py-6 text-center text-sm text-muted-foreground no-print">
        Etsy Insights © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
