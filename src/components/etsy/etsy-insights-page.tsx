'use client';

import React, { useState, useActionState, useCallback, useTransition } from 'react';
import { getEtsyInsights } from '@/app/actions';
import { EtsyForm } from './etsy-form';
import { ShopDetails } from './shop-details';
import { ListingsTable } from './listings-table';
import { TrendSummary } from './trend-summary';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { EtsyData, FilterState } from '@/lib/types';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  data: null,
  error: null,
};

export default function EtsyInsightsPage() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(getEtsyInsights, initialState);
  const [filters, setFilters] = useState<FilterState>({ favorites: 5, age: 30, views: 5 });
  const { toast } = useToast();

  React.useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: state.error,
      });
    }
  }, [state, toast]);

  const handleFormSubmit = (formData: FormData) => {
    startTransition(() => {
        formAction(formData);
    });
  };

  const onFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);
  
  const etsyData = state.data as EtsyData | null;

  return (
    <div className="space-y-8">
      <EtsyForm
        formAction={handleFormSubmit}
        isSubmitting={isPending}
        onFilterChange={onFilterChange}
        initialFilters={filters}
      />

      {isPending && !etsyData && (
        <div className="space-y-8">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      )}
      
      {state.error && !isPending && !etsyData && (
        <Alert variant="destructive" className="mt-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {etsyData && !isPending && (
        <div className="space-y-8">
          <TrendSummary summary={etsyData.trendAnalysis.summary} />
          <ShopDetails shop={etsyData.shop} filters={filters} />
          <ListingsTable listings={etsyData.listings} filters={filters} />
        </div>
      )}
    </div>
  );
}
