'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Printer, Loader2 } from 'lucide-react';
import type { FilterState } from '@/lib/types';

const formSchema = z.object({
  storeName: z.string().min(1, { message: 'Store name is required.' }),
  favorites: z.coerce.number().min(0),
  age: z.coerce.number().min(0),
  views: z.coerce.number().min(0),
});

type FormValues = z.infer<typeof formSchema>;

interface EtsyFormProps {
  formAction: (formData: FormData) => void;
  isSubmitting: boolean;
  onFilterChange: (filters: FilterState) => void;
  initialFilters: FilterState;
}

export function EtsyForm({ formAction, isSubmitting, onFilterChange, initialFilters }: EtsyFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storeName: '',
      favorites: initialFilters.favorites,
      age: initialFilters.age,
      views: initialFilters.views,
    },
  });

  const watchedFilters = watch(['favorites', 'age', 'views']);

  React.useEffect(() => {
    const [favorites, age, views] = watchedFilters;
    onFilterChange({ favorites, age, views });
  }, [watchedFilters, onFilterChange]);

  const handlePrint = () => {
    window.print();
  };

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    formAction(formData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto no-print shadow-lg">
      <CardHeader>
        <CardTitle>Store Analyzer</CardTitle>
        <CardDescription>Enter a store name and set your analysis filters.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              placeholder="e.g., YourFavoriteStore"
              {...register('storeName')}
            />
            {errors.storeName && <p className="text-sm text-destructive">{errors.storeName.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="favorites">Favorites {'>='}</Label>
              <Input id="favorites" type="number" {...register('favorites')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age (days) {'<='}</Label>
              <Input id="age" type="number" {...register('age')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="views">Views {'>='}</Label>
              <Input id="views" type="number" {...register('views')} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Analyze Store
            </Button>
            <Button type="button" variant="outline" onClick={handlePrint} className="w-full sm:w-auto">
              <Printer className="mr-2 h-4 w-4" />
              Print Results
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
