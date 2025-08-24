'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordProtectionProps {
  children: React.ReactNode;
}

export function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  // Check if already authenticated on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('etsy-insights-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple password check - you can change this to any password you want
    const correctPassword = 'etsy2024'; // Change this to your desired password
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('etsy-insights-auth', 'true');
      setError('');
      setAttempts(0);
    } else {
      setAttempts(prev => prev + 1);
      setError(`Incorrect password. Attempts: ${attempts + 1}`);
      
      // Lock out after 5 attempts for 5 minutes
      if (attempts >= 4) {
        setError('Too many failed attempts. Please wait 5 minutes before trying again.');
        setTimeout(() => {
          setAttempts(0);
          setError('');
        }, 5 * 60 * 1000);
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('etsy-insights-auth');
    setPassword('');
  };

  if (isAuthenticated) {
    return (
      <div>
        <div className="fixed top-4 right-4 z-50">
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
            Enter password to access the tool
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                disabled={attempts >= 5}
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
            
            <Button
              type="submit"
              className="w-full"
              disabled={attempts >= 5 || !password.trim()}
            >
              <Lock className="h-4 w-4 mr-2" />
              Access Tool
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Password: <code className="bg-muted px-1 py-0.5 rounded">etsy2024</code>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Change this in the code for production use
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
