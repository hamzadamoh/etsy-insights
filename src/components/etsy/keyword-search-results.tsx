
import type { KeywordSearchData } from "@/lib/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopListingsTable } from "@/components/etsy/top-listings-table";

export function KeywordSearchResults({ data }: { data: KeywordSearchData }) {
  const { stats, listings } = data;

  const formatNumber = (num: number) => {
    if (num === null || num === undefined) return 'N/A';
    return num.toLocaleString();
  };

  const formatPercentage = (num: number) => {
    if (num === null || num === undefined) return 'N/A';
    return `${(num * 100).toFixed(2)}%`;
  };

  return (
    <div className="mt-8">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Search volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(stats.search_volume)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Competition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(stats.competition)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conversion rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatPercentage(stats.conversion_rate)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.score}</div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <TopListingsTable listings={listings} />
      </div>
    </div>
  );
}
