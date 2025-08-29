'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { StatCard } from '@/components/ui/stat-card';
import { Eye, Heart, Calendar, DollarSign } from 'lucide-react';

export function ListingAnalyzer() {
  const [listingId, setListingId] = useState('');
  const [listing, setListing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!listingId) {
      toast({
        title: 'Please enter a listing ID',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/etsy/listing?id=${listingId}`);
      const data = await response.json();
      setListing(data.listing);
    } catch (error) {
      toast({
        title: 'Error fetching listing',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency_code,
    }).format(price.amount / price.divisor);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listing Analyzer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="text"
            placeholder="Enter a listing ID"
            value={listingId}
            onChange={(e) => setListingId(e.target.value)}
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
        {listing && (
          <div className="mt-4 space-y-4">
            <div>
                <h3 className="text-xl font-semibold">{listing.title}</h3>
                <p className="text-muted-foreground">{listing.description}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Price" value={formatPrice(listing.price)} icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} />
                <StatCard title="Views" value={listing.views} icon={<Eye className="h-4 w-4 text-muted-foreground" />} />
                <StatCard title="Favorites" value={listing.num_favorers} icon={<Heart className="h-4 w-4 text-muted-foreground" />} />
                <StatCard title="Creation Date" value={formatDate(listing.creation_timestamp)} icon={<Calendar className="h-4 w-4 text-muted-foreground" />} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
