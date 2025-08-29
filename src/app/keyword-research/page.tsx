
'use client';

import { useFormState } from 'react-dom';
import { Search } from 'lucide-react';

import { getKeywordData } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingKeywordsTable } from '@/components/etsy/trending-keywords-table';
import { KeywordSearchResults } from '@/components/etsy/keyword-search-results';

export default function KeywordResearchPage() {
  const [state, formAction] = useFormState(getKeywordData, { data: null, error: null });

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
        Keyword research
      </h1>
      <p className="text-muted-foreground mb-8">
        See what shoppers are searching for on Etsy and identify the most
        effective keywords to optimize your listings.
      </p>
      <div className="max-w-2xl">
        <form action={formAction} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            name="keyword"
            placeholder="Enter a keyword"
            className="pl-10 h-12 text-base"
          />
          <Button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-10"
          >
            Search
          </Button>
        </form>
        {state.error && <p className="mt-2 text-sm text-red-500">{state.error}</p>}
      </div>
      {state.data ? (
        <KeywordSearchResults data={state.data} />
      ) : (
        <TrendingKeywordsTable />
      )}
    </div>
  );
}
