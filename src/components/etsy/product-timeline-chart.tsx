'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import type { EtsyListing } from '@/lib/types';

interface ProductTimelineChartProps {
  listings: EtsyListing[];
}

interface TimelineData {
  date: string;
  count: number;
}

export function ProductTimelineChart({ listings }: ProductTimelineChartProps) {
  // Process listings to create timeline data
  const timelineData = React.useMemo(() => {
    if (!listings || listings.length === 0) return [];

    // Group listings by month
    const monthGroups = listings.reduce((acc, listing) => {
      const date = new Date(listing.original_creation_timestamp * 1000);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM format
      
      if (!acc[monthKey]) {
        acc[monthKey] = 0;
      }
      acc[monthKey]++;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and sort by month
    const sortedMonths = Object.keys(monthGroups).sort();
    
    return sortedMonths.map(month => {
      const [year, monthNum] = month.split('-');
      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
      
      return {
        date: date.toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        }),
        count: monthGroups[month]
      };
    });
  }, [listings]);

  if (timelineData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Product Listing Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No product listing data available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Product Listing Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Shows monthly product listing activity over time
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => value.toString()}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                labelStyle={{ color: '#F9FAFB' }}
              />
              
              {/* Monthly listings bars */}
              <Bar 
                dataKey="count" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
                name="Monthly Listings"
              />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Monthly Listings</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">
                {Math.max(...timelineData.map(d => d.count))}
              </div>
              <div className="text-sm text-muted-foreground">Most in One Month</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">
                {timelineData.length}
              </div>
              <div className="text-sm text-muted-foreground">Active Months</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
