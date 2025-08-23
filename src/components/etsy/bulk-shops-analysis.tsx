'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Copy, Loader2, FileSpreadsheet } from 'lucide-react';

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

export function BulkShopsAnalysis() {
  const [shopNames, setShopNames] = useState('');
  const [shopsData, setShopsData] = useState<BulkShopData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);


  const analyzeShops = async () => {
    if (!shopNames.trim()) {
      alert("❌ No shops entered. Please enter shop names to analyze.");
      return;
    }

    const names = shopNames
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (names.length === 0) {
      alert("❌ No valid shop names. Please enter at least one valid shop name.");
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

    // Analyze each shop
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
      alert("✅ Shop data copied to clipboard in tab-separated format!");
    } catch (err) {
      alert("❌ Copy failed. Failed to copy to clipboard.");
    }
  };

  const copySalesOnly = async () => {
    if (shopsData.length === 0) return;

    const salesData = shopsData
      .filter(shop => shop.status === 'success')
      .map(shop => shop.total_sales);

    const salesText = salesData.join('\n');

    try {
      await navigator.clipboard.writeText(salesText);
      alert("✅ Sales numbers copied to clipboard (one per line)!");
    } catch (err) {
      alert("❌ Copy failed. Failed to copy sales to clipboard.");
    }
  };

  const clearData = () => {
    setShopNames('');
    setShopsData([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Bulk Shop Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Paste shop names from Google Sheets (one per line):
          </label>
          <Textarea
            value={shopNames}
            onChange={(e) => setShopNames(e.target.value)}
            placeholder="Shop Name 1&#10;Shop Name 2&#10;Shop Name 3"
            rows={4}
            className="font-mono"
          />
        </div>

        <div className="flex gap-2">
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
          
          {shopsData.length > 0 && (
            <>
              <Button 
                onClick={copyToClipboard}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy All Data
              </Button>
              <Button 
                onClick={copySalesOnly}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Sales Only
              </Button>
              <Button 
                onClick={clearData}
                variant="outline"
                size="sm"
              >
                Clear
              </Button>
            </>
          )}
        </div>

        {shopsData.length > 0 && (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shop Name</TableHead>
                  <TableHead>Age (days)</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead>Shop Favorites</TableHead>
                  <TableHead>Active Listings</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shopsData.map((shop, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{shop.shop_name}</TableCell>
                    <TableCell>{shop.age_days}</TableCell>
                    <TableCell>{shop.total_sales.toLocaleString()}</TableCell>
                    <TableCell>{shop.shop_favorites.toLocaleString()}</TableCell>
                    <TableCell>{shop.active_listings.toLocaleString()}</TableCell>
                    <TableCell>
                      {shop.status === 'loading' && (
                        <Badge variant="secondary">
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          Loading
                        </Badge>
                      )}
                      {shop.status === 'success' && (
                        <Badge variant="default">Success</Badge>
                      )}
                      {shop.status === 'error' && (
                        <Badge variant="destructive" title={shop.error}>
                          Error
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
