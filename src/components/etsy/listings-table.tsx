'use client';

import React, { useState, useMemo } from 'react';
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
import { Heart, Eye, Calendar, Tag, ExternalLink, Package, Zap, ArrowUpDown, ArrowUp, ArrowDown, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

interface ListingsTableProps {
  listings: EtsyListing[];
  filters: FilterState;
}

type SortField = 'favorites' | 'views' | 'age' | 'stock' | 'lastModified';
type SortDirection = 'asc' | 'desc';

const HighlightCell = ({ children, isGood }: { children: React.ReactNode, isGood: boolean }) => (
  <TableCell className={cn(isGood ? 'bg-accent/30' : 'bg-destructive/10')}>
    <div className={cn('font-semibold', isGood ? 'text-accent-foreground' : 'text-destructive-foreground')}>
        {children}
    </div>
  </TableCell>
);

export function ListingsTable({ listings, filters }: ListingsTableProps) {
  const [sortField, setSortField] = useState<SortField>('favorites');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');


  const getDaysSince = (timestamp: number) => {
    return Math.ceil((new Date().getTime() - new Date(timestamp * 1000).getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedListings = useMemo(() => {
    return [...listings].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortField) {
        case 'favorites':
          aValue = a.num_favorers;
          bValue = b.num_favorers;
          break;
        case 'views':
          aValue = a.views;
          bValue = b.views;
          break;
        case 'age':
          aValue = getDaysSince(a.original_creation_timestamp);
          bValue = getDaysSince(b.original_creation_timestamp);
          break;
        case 'stock':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'lastModified':
          aValue = a.last_modified_timestamp;
          bValue = b.last_modified_timestamp;
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }, [listings, sortField, sortDirection]);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const downloadCSV = (includeAllData: boolean = false) => {
    if (!listings || listings.length === 0) {
      alert("❌ No data to download. Please analyze a shop first.");
      return;
    }

    try {
      let headers: string[];
      let data: any[][];

      if (includeAllData) {
        // Full data export
        headers = [
          'Product Name',
          'Type',
          'Favorites',
          'Views',
          'Age (days)',
          'Stock',
          'Last Modified',
          'Tags',
          'Etsy URL'
        ];

        data = sortedListings.map(listing => {
          const ageInDays = getDaysSince(listing.original_creation_timestamp);
          return [
            listing.title,
            listing.listing_type,
            listing.num_favorers,
            listing.views,
            ageInDays,
            listing.quantity,
            new Date(listing.last_modified_timestamp * 1000).toLocaleDateString(),
            listing.tags?.join(', ') || 'No Tags',
            listing.url
          ];
        });
      } else {
        // Basic export (names and descriptions only)
        headers = [
          'Product Name',
          'Tags',
          'Etsy URL'
        ];

        data = sortedListings.map(listing => [
          listing.title,
          listing.tags?.join(', ') || 'No Tags',
          listing.url
        ]);
      }

      // Create CSV content
      const csvContent = [headers, ...data]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `etsy-listings-${includeAllData ? 'full' : 'basic'}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`✅ Download Complete! CSV file with ${listings.length} listings has been downloaded.`);
    } catch (error) {
      alert("❌ Download Failed. Failed to create CSV file.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Product Listings ({listings.length})</CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={() => downloadCSV(false)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={listings.length === 0}
            >
              <Download className="h-4 w-4" />
              Download Basic CSV
            </Button>
            <Button
              onClick={() => downloadCSV(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={listings.length === 0}
            >
              <Download className="h-4 w-4" />
              Download Full CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('favorites')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    <Heart className="inline-block h-4 w-4 mr-1" />
                    Favorites
                    {getSortIcon('favorites')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('views')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    <Eye className="inline-block h-4 w-4 mr-1" />
                    Views
                    {getSortIcon('views')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('age')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    <Calendar className="inline-block h-4 w-4 mr-1" />
                    Age
                    {getSortIcon('age')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('stock')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    <Package className="inline-block h-4 w-4 mr-1" />
                    Stock
                    {getSortIcon('stock')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('lastModified')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Last Modified
                    {getSortIcon('lastModified')}
                  </Button>
                </TableHead>
                <TableHead><Tag className="inline-block h-4 w-4 mr-1" />Tags</TableHead>
                <TableHead>Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedListings.map((listing) => {
                const ageInDays = getDaysSince(listing.original_creation_timestamp);
                const isFavGood = listing.num_favorers >= filters.favorites;
                const isViewsGood = listing.views >= filters.views;
                const isAgeGood = ageInDays <= filters.age;

                return (
                  <TableRow key={listing.listing_id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <Image 
                                src={listing.images?.[0]?.url_75x75 ?? 'https://placehold.co/75x75.png'} 
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
                    <TableCell className="text-center">
                      <Badge variant={listing.quantity > 0 ? 'default' : 'destructive'}>
                        {listing.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDistanceToNow(new Date(listing.last_modified_timestamp * 1000), { addSuffix: true })}</TableCell>
                    <TableCell>
                      <div className="max-w-[250px] max-h-20 overflow-y-auto text-xs text-muted-foreground">
                        {listing.tags?.join(', ') ?? 'No Tags'}
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
