
'use server';

import { z } from 'zod';
import type { EtsyApiResponse, EtsyData, EtsyListing, EtsyShop, KeywordSearchData } from '@/lib/types';

const FormSchema = z.object({
  storeName: z.string().min(1, 'Store name is required'),
  favorites: z.coerce.number().min(0),
  age: z.coerce.number().min(0),
  views: z.coerce.number().min(0),
});

const KeywordSchema = z.object({
  keyword: z.string().min(1, 'Keyword is required'),
});

async function fetchFromEtsy<T>(url: string): Promise<T> {
  const apiKey = process.env.ETSY_API_KEY;
  if (!apiKey) {
    throw new Error('Etsy API key is not configured.');
  }

  const response = await fetch(url, {
    headers: {
      'x-api-key': apiKey,
    },
    cache: 'no-store', // Disable caching for fresh data
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Etsy API Error (${response.status}): ${errorBody}`);
    throw new Error(`Failed to fetch data from Etsy. Status: ${response.status}`);
  }

  return response.json();
}

export async function getEtsyInsights(
  prevState: any,
  formData: FormData
): Promise<{ data: EtsyData | null; error: string | null }> {
  try {
    const validatedFields = FormSchema.safeParse({
      storeName: formData.get('storeName'),
      favorites: formData.get('favorites'),
      age: formData.get('age'),
      views: formData.get('views'),
    });

    if (!validatedFields.success) {
      return { data: null, error: 'Invalid form data.' };
    }

    const { storeName } = validatedFields.data;

    // 1. Get Shop ID from Shop Name
    const shopSearchUrl = `https://api.etsy.com/v3/application/shops?shop_name=${encodeURIComponent(storeName)}`;
    const shopData = await fetchFromEtsy<EtsyApiResponse<EtsyShop>>(shopSearchUrl);

    if (!shopData.results || shopData.results.length === 0) {
      return { data: null, error: `Shop "${storeName}" not found.` };
    }
    const shop = shopData.results[0];
    const shopId = shop.shop_id;

    // 2. Get Active Listings for the Shop
    const listingsUrl = `https://api.etsy.com/v3/application/shops/${shopId}/listings/active?limit=100&includes=images`;
    const listingsData = await fetchFromEtsy<EtsyApiResponse<EtsyListing>>(listingsUrl);
    const listings = listingsData.results || [];
    
    return {
      data: {
        shop,
        listings,
      },
      error: null,
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, error: errorMessage };
  }
}

export async function getKeywordData(
  prevState: any,
  formData: FormData
): Promise<{ data: KeywordSearchData | null; error: string | null }> {
  try {
    const validatedFields = KeywordSchema.safeParse({
      keyword: formData.get('keyword'),
    });

    if (!validatedFields.success) {
      return { data: null, error: 'Invalid form data.' };
    }

    const { keyword } = validatedFields.data;

    // Since there is no direct Etsy API for keyword stats, we will simulate it.
    // We will fetch active listings to get the competition.
    const listingsUrl = `https://api.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(keyword)}&limit=25&includes=images`;
    const listingsData = await fetchFromEtsy<EtsyApiResponse<EtsyListing>>(listingsUrl);
    const listings = listingsData.results || [];
    const competition = listingsData.count || 0;

    // We will generate placeholder data for the other stats.
    const simulatedStats = {
      search_volume: Math.floor(Math.random() * 100000),
      competition: competition,
      conversion_rate: Math.random() * 0.1,
      score: Math.floor(Math.random() * 100),
    };

    return {
      data: {
        stats: simulatedStats,
        listings: listings,
      },
      error: null,
    };

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, error: errorMessage };
  }
}
