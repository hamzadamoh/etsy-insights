'use client';

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

import { Auth } from '@/components/auth';
import { AdminPanel } from '@/components/admin-panel';
import { Dashboard } from '@/components/dashboard';
import { LandingPage } from '@/components/landing-page';
import { FullscreenLoader } from '@/components/ui/fullscreen-loader';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

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

  if (loading) {
    return <FullscreenLoader />;
  }

  if (!user) {
    return showLogin ? <Auth onAuthSuccess={() => {}} /> : <LandingPage onLoginClick={() => setShowLogin(true)} />;
  }

  return (
    <Dashboard user={user} isAdmin={isAdmin}>
      {children}
    </Dashboard>
  );
}
