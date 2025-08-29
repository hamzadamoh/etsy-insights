'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { StatCard } from '@/components/ui/stat-card';
import { BarChart, Eye, Heart, ShoppingBag } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function KeywordResearch() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!keyword) {
      toast({
        title: 'Please enter a keyword',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/etsy/keyword-research?keyword=${keyword}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      toast({
        title: 'Error fetching keyword research',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyword Research</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="text"
            placeholder="Enter a keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
        {results && (
          <div className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Listings" value={results.num_listings} icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />} />
                <StatCard title="Average Price" value={`$${results.average_price.toFixed(2)}`} icon={<BarChart className="h-4 w-4 text-muted-foreground" />} />
                <StatCard title="Average Views" value={results.average_views} icon={<Eye className="h-4 w-4 text-muted-foreground" />} />
                <StatCard title="Average Favorites" value={results.average_favorites} icon={<Heart className="h-4 w-4 text-muted-foreground" />} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Top Tags</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tag</TableHead>
                            <TableHead className="text-right">Count</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results.top_tags.map((tag: any, index: number) => (
                            <TableRow key={index}>
                                <TableCell>{tag.tag}</TableCell>
                                <TableCell className="text-right">{tag.count}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
