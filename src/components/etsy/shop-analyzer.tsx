'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Store, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ShopDetails } from './shop-details';
import { motion, AnimatePresence } from 'framer-motion';
import type { EtsyShop, FilterState, Listing } from '@/lib/types';

export function ShopAnalyzer() {
  const { toast } = useToast();
  const [shopName, setShopName] = useState('');
  const [shop, setShop] = useState<EtsyShop | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ age: 365, favorites: 100, views: 1000 });

  const analyzeShop = async () => {
    if (!shopName.trim()) {
      toast({
        title: "Shop name is missing",
        description: "Please enter a shop name to begin the analysis.",
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setShop(null);
    setListings([]);

    try {
      const response = await fetch('/api/etsy/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopName: shopName.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        setShop(data.shop);
        setListings(data.listings);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Could not retrieve shop data.');
      }
    } catch (error) {
      toast({
        title: "Error Analyzing Shop",
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputVariants = {
    initial: { scale: 1, boxShadow: '0px 0px 0px rgba(0,0,0,0)' },
    loading: { scale: 1.02, boxShadow: '0px 0px 8px rgba(255,255,255,0.5)' },
  };

  return (
    <motion.div layout className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Store className="h-6 w-6" />
            <span className="font-bold">Etsy Shop Analyzer</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="flex gap-2 relative"
            variants={inputVariants}
            animate={isLoading ? 'loading' : 'initial'}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Enter an Etsy shop name to travel to its dimension..."
              onKeyPress={(e) => e.key === 'Enter' && analyzeShop()}
              className="pl-10 text-base py-6 bg-transparent border-2 border-primary/20 focus:border-primary/60 focus:ring-0 transition-all duration-300"
            />
            <Button 
              onClick={analyzeShop} 
              disabled={isLoading}
              size="lg"
              className="flex items-center gap-2 group"
            >
              {isLoading ? (
                <>
                  <Loader2 className_="h-5 w-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Store className="h-5 w-5 group-hover:translate-x-1 transition-transform"/>
                  <span>Analyze</span>
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {shop && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: -30 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -50, scale: 0.9, rotateX: 30 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <ShopDetails shop={shop} filters={filters} listings={listings} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
