'use client';

import React from 'react';
import { BulkShopsAnalysis } from '@/components/etsy/bulk-shops-analysis';

export default function BulkShopAnalysisPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Bulk Shop Analysis</h1>
      <BulkShopsAnalysis />
    </div>
  );
}
