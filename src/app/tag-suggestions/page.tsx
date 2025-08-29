'use client';

import React from 'react';
import { TagSuggestions } from '@/components/etsy/tag-suggestions';

export default function TagSuggestionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Tag Suggestions</h1>
      <TagSuggestions />
    </div>
  );
}
