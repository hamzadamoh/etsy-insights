'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff, Shield, Users } from 'lucide-react';
import { AdminPanel } from './admin-panel';

interface PasswordProtectionProps {
  children: React.ReactNode;
}

export function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Check if already authenticated on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('etsy-insights-auth');
    const userData = localStorage.getItem('etsy-insights-user');
    if (authStatus === 'true' && userData) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(userData));
    }
    
    // Initialize default team data if it doesn't exist
    const teamMembersData = localStorage.getItem('etsy-insights-team');
    if (!teamMembersData) {
      const defaultMembers = [
        {
          id: 'admin-001',
          name: 'Admin User',
          email: 'admin@etsyinsights.com',
          password: 'admin123',
          role: 'admin',
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'user-001',
          name: 'John Doe',
          email: 'john@company.com',
          password: 'team2024',
          role: 'user',
          status: 'active',
          createdAt: new Date().toISOString(),
        }
      ];
      localStorage.setItem('etsy-insights-team', JSON.stringify(defaultMembers));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get team members from localStorage
    const teamMembersData = localStorage.getItem('etsy-insights-team');
    if (!teamMembersData) {
      setError('Team data not found. Please contact admin.');
      return;
    }
    
    const teamMembers = JSON.parse(teamMembersData);
    const user = teamMembers.find((member: any) => 
      member.password === password && member.status === 'active'
    );
    
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      localStorage.setItem('etsy-insights-auth', 'true');
      localStorage.setItem('etsy-insights-user', JSON.stringify(user));
      
      // Update last login
      const updatedMembers = teamMembers.map((member: any) =>
        member.id === user.id 
          ? { ...member, lastLogin: new Date().toISOString() }
          : member
      );
      localStorage.setItem('etsy-insights-team', JSON.stringify(updatedMembers));
      
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
    setCurrentUser(null);
    localStorage.removeItem('etsy-insights-auth');
    localStorage.removeItem('etsy-insights-user');
    setPassword('');
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
              Contact your admin for login credentials
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Default admin: admin@etsyinsights.com / admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
