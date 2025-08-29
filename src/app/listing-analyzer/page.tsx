'use client';

import React from 'react';
import { ListingAnalyzer } from '@/components/etsy/listing-analyzer';

export default function ListingAnalyzerPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Listing Analyzer</h1>
      <ListingAnalyzer />
    </div>
  );
}
