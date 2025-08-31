'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Loader2, FileSpreadsheet, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import type { EtsyShop } from '@/lib/types';

interface BulkShopData {
  shop_name: string;
  age_days: number;
  total_sales: number;
  shop_favorites: number;
  active_listings: number;
  status: 'loading' | 'success' | 'error';
  error?: string;
}

export function BulkShopAnalysis() {
  const { showToast } = useToast();
  const [shopNames, setShopNames] = useState('');
  const [shopsData, setShopsData] = useState<BulkShopData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeShops = async () => {
    if (!shopNames.trim()) {
      showToast("No shops entered. Please enter shop names to analyze.", "error");
      return;
    }

    const names = shopNames
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (names.length === 0) {
      showToast("No valid shop names. Please enter at least one valid shop name.", "error");
      return;
    }

    setIsAnalyzing(true);
    setShopsData(names.map(name => ({
      shop_name: name,
      age_days: 0,
      total_sales: 0,
      shop_favorites: 0,
      active_listings: 0,
      status: 'loading'
    })));

    for (let i = 0; i < names.length; i++) {
      try {
        const response = await fetch('/api/etsy/shop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shopName: names[i] })
        });

        if (response.ok) {
          const data = await response.json();
          const shop = data.shop;
          const ageInDays = Math.ceil((new Date().getTime() - new Date(shop.create_date * 1000).getTime()) / (1000 * 60 * 60 * 24));
          
          setShopsData(prev => prev.map((item, index) => 
            index === i ? {
              ...item,
              age_days: ageInDays,
              total_sales: shop.transaction_sold_count,
              shop_favorites: shop.num_favorers,
              active_listings: shop.listing_active_count,
              status: 'success'
            } : item
          ));
        } else {
          throw new Error('Failed to fetch shop data');
        }
      } catch (error) {
        setShopsData(prev => prev.map((item, index) => 
          index === i ? {
            ...item,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          } : item
        ));
      }
    }

    setIsAnalyzing(false);
  };

  const copyToClipboard = async () => {
    if (shopsData.length === 0) return;

    const headers = ['Shop Name', 'Age (days)', 'Total Sales', 'Shop Favorites', 'Active Listings'];
    const data = shopsData
      .filter(shop => shop.status === 'success')
      .map(shop => [
        shop.shop_name,
        shop.age_days,
        shop.total_sales,
        shop.shop_favorites,
        shop.active_listings
      ]);

    const csvContent = [headers, ...data]
      .map(row => row.join('\t'))
      .join('\n');

    try {
      await navigator.clipboard.writeText(csvContent);
      showToast("Shop data copied to clipboard!", "success");
    } catch (err) {
      showToast("Failed to copy to clipboard.", "error");
    }
  };

  const clearData = () => {
    setShopNames('');
    setShopsData([]);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, rotateX: -90 },
    visible: {
      opacity: 1, y: 0, rotateX: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <motion.div layout className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Bulk Shop Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="shop-names-textarea" className="text-sm font-medium">
              Paste shop names (one per line):
            </label>
            <Textarea
              id="shop-names-textarea"
              value={shopNames}
              onChange={(e) => setShopNames(e.target.value)}
              placeholder="ShopName1\nShopName2\nShopName3"
              rows={4}
              className="font-mono bg-background"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={analyzeShops} 
              disabled={isAnalyzing || !shopNames.trim()}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-4 w-4" />
              )}
              {isAnalyzing ? 'Analyzing...' : 'Analyze Shops'}
            </Button>
            
            <AnimatePresence>
              {shopsData.length > 0 && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex flex-wrap gap-2">
                  <Button 
                    onClick={copyToClipboard}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Data
                  </Button>
                  <Button 
                    onClick={clearData}
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-1.5"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {shopsData.map((shop, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layoutId={`shop-card-${index}`}
            >
              <Card className="h-full flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="text-lg truncate font-bold">{shop.shop_name}</CardTitle>
                  <div className="pt-2">
                  {shop.status === 'loading' && <Badge variant="secondary"><Loader2 className="h-3 w-3 animate-spin mr-1" />Loading</Badge>}
                  {shop.status === 'success' && <Badge variant="default">Success</Badge>}
                  {shop.status === 'error' && <Badge variant="destructive" title={shop.error}>Error</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Total Sales</p>
                    <p className="font-semibold text-lg">{shop.total_sales.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Shop Favorites</p>
                    <p className="font-semibold text-lg">{shop.shop_favorites.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Active Listings</p>
                    <p className="font-semibold">{shop.active_listings.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Age (days)</p>
                    <p className="font-semibold">{shop.age_days}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
