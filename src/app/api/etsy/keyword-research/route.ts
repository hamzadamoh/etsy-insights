'use server'

import {NextRequest, NextResponse} from "next/server";

async function fetchFromEtsy<T>(url: string): Promise<T> {
  const apiKey = process.env.ETSY_API_KEY;
  if (!apiKey) {
    throw new Error('Etsy API key is not configured.');
  }

  const response = await fetch(url, {
    headers: {
      'x-api-key': apiKey,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Etsy API Error (${response.status}): ${errorBody}`);
    throw new Error(`Failed to fetch data from Etsy. Status: ${response.status}`);
  }

  return response.json();
}

async function getKeywordResearchFromEtsy(keyword: string) {
    const url = `https://api.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(keyword)}&limit=10`;
    const listingsData = await fetchFromEtsy<any>(url);

    const listingsWithTags = await Promise.all(
      listingsData.results.map(async (listing: any) => {
        const tagsUrl = `https://api.etsy.com/v3/application/listings/${listing.listing_id}/tags`;
        const tagsData = await fetchFromEtsy<any>(tagsUrl);
        return {
          ...listing,
          tags: tagsData.results.map((tag: any) => tag.tag),
        };
      })
    );

    return {
        ...listingsData,
        results: listingsWithTags
    };
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');

    if (!keyword) {
        return NextResponse.json({error: "Keyword is required"}, {status: 400});
    }

    try {
        const researchData = await getKeywordResearchFromEtsy(keyword);
        return NextResponse.json(researchData);
    } catch (error) {
        console.error("Error performing keyword research:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return NextResponse.json({error: errorMessage}, {status: 500});
    }
}
