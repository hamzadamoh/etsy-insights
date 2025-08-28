'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface TrendSummaryProps {
  summary: string;
}

export function TrendSummary({ summary }: TrendSummaryProps) {
  return (
    <Card className="bg-primary/5 border-primary/20 shadow-md">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <div className="bg-primary/10 p-3 rounded-full">
            <Lightbulb className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl font-bold text-primary-foreground">AI Trend Spotlight</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">
          {summary}
        </p>
      </CardContent>
    </Card>
  );
}
