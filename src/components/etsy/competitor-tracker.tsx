
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Competitor {
  id: string;
  shopName: string;
  totalSales: number;
  shopFavorites: number;
  activeListings: number;
  avgSalesPerDay: number;
  lastChecked: Date;
}

export function CompetitorTracker() {
  const { toast } = useToast();
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [newShopName, setNewShopName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addCompetitor = async () => {
    if (!newShopName.trim()) {
      toast({
        title: "Shop name required",
        description: "Please enter a shop name",
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/etsy/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopName: newShopName.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        const shop = data.shop;
        const ageInDays = Math.ceil((new Date().getTime() - new Date(shop.create_date * 1000).getTime()) / (1000 * 60 * 60 * 24));
        
        const newCompetitor: Competitor = {
          id: Date.now().toString(),
          shopName: shop.shop_name,
          totalSales: shop.transaction_sold_count,
          shopFavorites: shop.num_favorers,
          activeListings: shop.listing_active_count,
          avgSalesPerDay: shop.transaction_sold_count / Math.max(ageInDays, 1),
          lastChecked: new Date()
        };

        setCompetitors(prev => [...prev, newCompetitor]);
        setNewShopName('');
        toast({
          title: "Competitor Added",
          description: `Added ${shop.shop_name} to competitor tracker`,
        });
      } else {
        throw new Error('Failed to fetch shop data');
      }
    } catch (error) {
        toast({
          title: "Failed to add competitor",
          description: "An error occurred while adding the competitor",
          variant: 'destructive',
        });
    } finally {
      setIsLoading(false);
    }
  };

  const removeCompetitor = (id: string) => {
    setCompetitors(prev => prev.filter(comp => comp.id !== id));
    toast({
      title: "Competitor Removed",
      description: "Competitor has been removed from the tracker",
    });
  };

  const updateCompetitor = async (competitor: Competitor) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/etsy/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopName: competitor.shopName })
      });

      if (response.ok) {
        const data = await response.json();
        const shop = data.shop;
        const ageInDays = Math.ceil((new Date().getTime() - new Date(shop.create_date * 1000).getTime()) / (1000 * 60 * 60 * 24));
        
        setCompetitors(prev => prev.map(comp => 
          comp.id === competitor.id ? {
            ...comp,
            totalSales: shop.transaction_sold_count,
            shopFavorites: shop.num_favorers,
            activeListings: shop.listing_active_count,
            avgSalesPerDay: shop.transaction_sold_count / Math.max(ageInDays, 1),
            lastChecked: new Date()
          } : comp
        ));
        toast({
          title: "Competitor Updated",
          description: `Updated ${competitor.shopName}`,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to update competitor",
        description: "An error occurred while updating the competitor",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Competitor Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newShopName}
            onChange={(e) => setNewShopName(e.target.value)}
            placeholder="Enter competitor shop name"
            onKeyPress={(e) => e.key === 'Enter' && addCompetitor()}
          />
          <Button 
            onClick={addCompetitor} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        {competitors.length > 0 && (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shop Name</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead>Favorites</TableHead>
                  <TableHead>Active Listings</TableHead>
                  <TableHead>Avg Sales/Day</TableHead>
                  <TableHead>Last Checked</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competitors.map((competitor) => (
                  <TableRow key={competitor.id}>
                    <TableCell className="font-medium">{competitor.shopName}</TableCell>
                    <TableCell>{competitor.totalSales.toLocaleString()}</TableCell>
                    <TableCell>{competitor.shopFavorites.toLocaleString()}</TableCell>
                    <TableCell>{competitor.activeListings.toLocaleString()}</TableCell>
                    <TableCell>{competitor.avgSalesPerDay.toFixed(1)}</TableCell>
                    <TableCell>{competitor.lastChecked.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCompetitor(competitor)}
                          disabled={isLoading}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeCompetitor(competitor.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {competitors.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No competitors tracked yet. Add some competitors to start monitoring their performance.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
