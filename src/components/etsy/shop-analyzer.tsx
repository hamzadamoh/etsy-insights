
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Store } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { ShopDetails } from './shop-details';
import type { EtsyShop } from '@/lib/types';

export function ShopAnalyzer() {
  const { showToast } = useToast();
  const [shopName, setShopName] = useState('');
  const [shop, setShop] = useState<EtsyShop | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeShop = async () => {
    if (!shopName.trim()) {
      showToast("Please enter a shop name", "error");
      return;
    }

    setIsLoading(true);
    setShop(null);

    try {
      const response = await fetch('/api/etsy/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopName: shopName.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        setShop(data.shop);
        showToast(`Successfully analyzed ${data.shop.shop_name}`, "success");
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch shop data');
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to analyze shop', "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Shop Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Enter Etsy shop name"
              onKeyPress={(e) => e.key === 'Enter' && analyzeShop()}
            />
            <Button 
              onClick={analyzeShop} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Store className="h-4 w-4" />
              )}
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {shop && (
        <ShopDetails shop={shop} />
      )}
    </div>
  );
}
