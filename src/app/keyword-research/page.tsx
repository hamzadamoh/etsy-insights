'use client';

import React from 'react';
import { KeywordResearch } from '@/components/etsy/keyword-research';

export default function KeywordResearchPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Keyword Research</h1>
      <KeywordResearch />
    </div>
  );
}
