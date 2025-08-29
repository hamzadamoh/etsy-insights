'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export function TagSuggestions() {
  const [keyword, setKeyword] = useState('');
  const [tags, setTags] = useState<string[]>([]);
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
      const response = await fetch(`/api/etsy/tags?keyword=${keyword}`);
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      toast({
        title: 'Error fetching tags',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };
  
  const copyToClipboard = (tag: string) => {
    navigator.clipboard.writeText(tag);
    toast({ title: `Copied "${tag}" to clipboard` });
  };

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Tag Suggestions</h1>
            <p className="text-muted-foreground">
                Enter a keyword to get a list of suggested tags for your Etsy listings.
            </p>
        </div>

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

        {tags.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle>Suggested Tags</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                        <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => copyToClipboard(tag)}
                        >
                        {tag}
                        </Badge>
                    ))}
                    </div>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
