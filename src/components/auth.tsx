'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';

interface AuthProps {
  onAuthSuccess: () => void;
}

export function Auth({ onAuthSuccess }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', user.uid), { email: user.email, role: 'user' });
      onAuthSuccess();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onAuthSuccess();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      setForgotPasswordMessage('Please enter your email.');
      return;
    }

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', forgotPasswordEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setForgotPasswordMessage('This email is not registered.');
      } else {
        await sendPasswordResetEmail(auth, forgotPasswordEmail);
        setForgotPasswordMessage('A password reset link has been sent to your email.');
      }
    } catch (error: any) {
      setForgotPasswordMessage(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card text-card-foreground rounded-lg shadow-lg">
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button type="submit" className="w-full">Login</Button>
            </form>
            <Button variant="link" onClick={() => setIsForgotPasswordDialogOpen(true)} className="mt-4">
              Forgot Password?
            </Button>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button type="submit" className="w-full">Sign Up</Button>
            </form>
          </TabsContent>
        </Tabs>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>

      <Dialog open={isForgotPasswordDialogOpen} onOpenChange={setIsForgotPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogDescription>
              Enter your email to receive a password reset link.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input type="email" placeholder="Email" value={forgotPasswordEmail} onChange={(e) => setForgotPasswordEmail(e.target.value)} />
            <Button onClick={handleForgotPassword} className="w-full">Send Reset Link</Button>
            {forgotPasswordMessage && <p className="text-center text-sm">{forgotPasswordMessage}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsForgotPasswordDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
