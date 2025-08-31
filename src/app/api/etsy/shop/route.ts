import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ShopRequestSchema = z.object({
  shopName: z.string().min(1, 'Shop name is required'),
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
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Etsy API Error (${response.status}): ${errorBody}`);
    throw new Error(`Failed to fetch data from Etsy. Status: ${response.status}`);
  }

  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedFields = ShopRequestSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: 'Invalid request data.' },
        { status: 400 }
      );
    }

    const { shopName } = validatedFields.data;

    // Get Shop ID from Shop Name
    const shopSearchUrl = `https://api.etsy.com/v3/application/shops?shop_name=${encodeURIComponent(shopName)}`;
    const shopData = await fetchFromEtsy<any>(shopSearchUrl);

    if (!shopData.results || shopData.results.length === 0) {
      return NextResponse.json(
        { error: `Shop "${shopName}" not found.` },
        { status: 404 }
      );
    }

    const shop = shopData.results[0];

    // Get shop listings
    const listingsUrl = `https://api.etsy.com/v3/application/shops/${shop.shop_id}/listings/active`;
    const listingsData = await fetchFromEtsy<any>(listingsUrl);

    return NextResponse.json({ 
      shop, 
      listings: listingsData.results || [] 
    });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
