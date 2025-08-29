'use client';

import React, { useState, useActionState, useCallback, useTransition } from 'react';
import { getEtsyInsights } from '@/app/actions';
import { EtsyForm } from './etsy-form';
import { ShopDetails } from './shop-details';
import { ListingsTable } from './listings-table';
import { BulkShopsAnalysis } from './bulk-shops-analysis';
import { ProductTimelineChart } from './product-timeline-chart';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { EtsyData, FilterState } from '@/lib/types';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const initialState = {
  data: null,
  error: null,
};

export default function EtsyInsightsPage() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(getEtsyInsights, initialState);
  const [filters, setFilters] = useState<FilterState>({ favorites: 5, age: 30, views: 5 });
  const { toast } = useToast();
  const router = useRouter();

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

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/auth');
    } catch (error) {
      console.error("Error signing out: ", error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'There was an error while trying to log you out.',
      });
    }
  }, [toast, router]);
  
  const etsyData = state.data as EtsyData | null;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Etsy Insights</h1>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Single Shop Analysis</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Shop Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="space-y-8">
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
          <Skeleton className="h-80 w-full rounded-lg" />
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
              <ShopDetails shop={etsyData.shop} filters={filters} />
              <ProductTimelineChart listings={etsyData.listings} />
              <ListingsTable listings={etsyData.listings} filters={filters} />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="bulk">
          <BulkShopsAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
}
