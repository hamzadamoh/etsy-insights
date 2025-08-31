'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onLoginClick: () => void;
}

export function LandingPage({ onLoginClick }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ rotate: 360, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
          className="inline-block p-4 bg-primary rounded-full shadow-lg"
        >
          <ShoppingCart className="h-16 w-16 text-white" />
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Etsy Insights
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Unlock the secrets to Etsy success. Analyze shops, track competitors, and discover winning keywords with our powerful suite of tools.
        </p>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 1 }}
        >
          <Button 
            size="lg" 
            onClick={onLoginClick} 
            className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105">
            <LogIn className="mr-2 h-5 w-5" />
            Get Started
          </Button>
        </motion.div>
      </motion.div>

      <motion.div 
        className="absolute bottom-8 text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <p>&copy; {new Date().getFullYear()} Etsy Insights. All rights reserved.</p>
      </motion.div>
    </div>
  );
}
