'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import type { EtsyListing } from '@/lib/types';

interface ProductTimelineChartProps {
  listings: EtsyListing[];
}

interface TimelineData {
  date: string;
  count: number;
  cumulative: number;
}

export function ProductTimelineChart({ listings }: ProductTimelineChartProps) {
  // Process listings to create timeline data
  const timelineData = React.useMemo(() => {
    if (!listings || listings.length === 0) return [];

    // Group listings by creation date
    const dateGroups = listings.reduce((acc, listing) => {
      const date = new Date(listing.original_creation_timestamp * 1000);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      if (!acc[dateKey]) {
        acc[dateKey] = 0;
      }
      acc[dateKey]++;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and sort by date
    const sortedDates = Object.keys(dateGroups).sort();
    
    // Create cumulative data
    let cumulative = 0;
    return sortedDates.map(date => {
      cumulative += dateGroups[date];
      return {
        date: new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        count: dateGroups[date],
        cumulative
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
            Shows when products were listed and cumulative growth over time
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
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
              
              {/* Daily listings line */}
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                name="Daily Listings"
              />
              
              {/* Cumulative line */}
              <Line 
                type="monotone" 
                dataKey="cumulative" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                name="Total Products"
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Daily Listings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Total Products</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">
                {Math.max(...timelineData.map(d => d.count))}
              </div>
              <div className="text-sm text-muted-foreground">Most in One Day</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">
                {timelineData.length}
              </div>
              <div className="text-sm text-muted-foreground">Active Days</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
