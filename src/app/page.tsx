'use client';

import React, { useState, useEffect } from 'react';
import EtsyInsightsPage from '@/components/etsy/etsy-insights-page';
import { Auth } from '@/components/auth';
import { Store } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!user) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8 no-print">
            <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-lg mb-4">
              <Store className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground">
              Etsy Insights
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Analyze individual Etsy stores or bulk analyze multiple shops. Get shop insights, sales data, and copy results to Google Sheets.
            </p>
          </header>

          <div className="printable-area">
            <EtsyInsightsPage />
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground no-print">
        Etsy Insights © {new Date().getFullYear()}
      </footer>
    </>
  );
}
