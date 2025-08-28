'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { AdminPanel } from './admin-panel';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface PasswordProtectionProps {
  children: React.ReactNode;
}

export function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser({ ...user, ...userData });
          setIsAuthenticated(true);
        } else {
          // Handle case where user exists in Auth but not in Firestore
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.status === 'active') {
          setCurrentUser({ ...user, ...userData });
          setIsAuthenticated(true);
        } else {
          setError('Your account is inactive. Please contact an admin.');
        }
      } else {
        setError('User data not found.');
      }
    } catch (error) {
      setError('Invalid email or password.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  if (isAuthenticated) {
    return (
      <div>
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          {currentUser?.role === 'admin' && (
            <Button
              onClick={() => setShowAdminPanel(true)}
              variant="outline"
              size="sm"
              className="bg-background/80 backdrop-blur-sm"
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin
            </Button>
          )}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
          >
            <Lock className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
        
        {showAdminPanel && (
          <AdminPanel onClose={() => setShowAdminPanel(false)} />
        )}
        
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Etsy Insights</CardTitle>
          <p className="text-muted-foreground">
            Enter your credentials to access the tool
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
             <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {error && (
              <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/20 p-2 rounded border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full">
              <Lock className="h-4 w-4 mr-2" />
              Access Tool
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
