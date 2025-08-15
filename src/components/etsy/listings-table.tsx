'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { EtsyListing, FilterState } from '@/lib/types';
import { Heart, Eye, Calendar, Tag, ExternalLink, Package,Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

interface ListingsTableProps {
  listings: EtsyListing[];
  filters: FilterState;
}

const HighlightCell = ({ children, isGood }: { children: React.ReactNode, isGood: boolean }) => (
  <TableCell className={cn(isGood ? 'bg-accent/30' : 'bg-destructive/10')}>
    <div className={cn('font-semibold', isGood ? 'text-accent-foreground' : 'text-destructive-foreground')}>
        {children}
    </div>
  </TableCell>
);

export function ListingsTable({ listings, filters }: ListingsTableProps) {
  const getDaysSince = (timestamp: number) => {
    return Math.ceil((new Date().getTime() - new Date(timestamp * 1000).getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Listings ({listings.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead><Heart className="inline-block h-4 w-4 mr-1" />Favorites</TableHead>
                <TableHead><Eye className="inline-block h-4 w-4 mr-1" />Views</TableHead>
                <TableHead><Calendar className="inline-block h-4 w-4 mr-1" />Age</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead><Tag className="inline-block h-4 w-4 mr-1" />Tags</TableHead>
                <TableHead>Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => {
                const ageInDays = getDaysSince(listing.original_creation_timestamp);
                const isFavGood = listing.num_favorers >= filters.favorites;
                const isViewsGood = listing.views >= filters.views;
                const isAgeGood = ageInDays <= filters.age;

                return (
                  <TableRow key={listing.listing_id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <Image 
                                src={listing.images[0]?.url_75x75 ?? 'https://placehold.co/75x75.png'} 
                                alt={listing.title} 
                                width={50} 
                                height={50} 
                                className="rounded-md border"
                                data-ai-hint="product image"
                            />
                            <div className="flex flex-col">
                                <span className="max-w-[200px] truncate">{listing.title}</span>
                                <Badge variant={listing.listing_type === 'physical' ? 'secondary' : 'outline'} className="w-fit">
                                    {listing.listing_type === 'physical' ? <Package className="h-3 w-3 mr-1" /> : <Zap className="h-3 w-3 mr-1" />}
                                    {listing.listing_type}
                                </Badge>
                            </div>
                        </div>
                    </TableCell>
                    <HighlightCell isGood={isFavGood}>{listing.num_favorers.toLocaleString()}</HighlightCell>
                    <HighlightCell isGood={isViewsGood}>{listing.views.toLocaleString()}</HighlightCell>
                    <HighlightCell isGood={isAgeGood}>{ageInDays}d</HighlightCell>
                    <TableCell>{formatDistanceToNow(new Date(listing.last_modified_timestamp * 1000), { addSuffix: true })}</TableCell>
                    <TableCell>
                      <div className="max-w-[250px] max-h-20 overflow-y-auto text-xs text-muted-foreground">
                        {listing.tags.join(', ')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="icon">
                        <a href={listing.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
