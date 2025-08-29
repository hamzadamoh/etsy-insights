'use client';

import React, { useState, useEffect } from 'react';
import EtsyInsightsPage from '@/components/etsy/etsy-insights-page';
import { Auth } from '@/components/auth';
import { Store } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { AdminPanel } from '@/components/admin-panel';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthSuccess, setIsAuthSuccess] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().role === 'admin') {
          setIsAdmin(true);
        }
        setUser(user);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthSuccess(true);
  };

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!user || !isAuthSuccess) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
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
            {isAdmin && (
              <Button onClick={() => setIsAdminPanelOpen(true)} className="mt-4">
                Admin Panel
              </Button>
            )}
          </header>

          <div className="printable-area">
            <EtsyInsightsPage />
          </div>
        </div>
      </main>
      {isAdminPanelOpen && <AdminPanel onClose={() => setIsAdminPanelOpen(false)} />}
      <footer className="py-6 text-center text-sm text-muted-foreground no-print">
        Etsy Insights © {new Date().getFullYear()}
      </footer>
    </>
  );
}
