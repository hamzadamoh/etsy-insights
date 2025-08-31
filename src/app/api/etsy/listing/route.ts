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

async function getListingFromEtsy(listingId: string) {
    const url = `https://api.etsy.com/v3/application/listings/${listingId}`;
    const listingData = await fetchFromEtsy<any>(url);
    return listingData;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const listingId = searchParams.get('id');

    if (!listingId) {
        return NextResponse.json({error: "Listing ID is required"}, {status: 400});
    }

    try {
        const listing = await getListingFromEtsy(listingId);
        return NextResponse.json({listing});
    } catch (error) {
        console.error("Error fetching listing data:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return NextResponse.json({error: errorMessage}, {status: 500});
    }
}
