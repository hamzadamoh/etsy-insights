'use server'

import {NextRequest, NextResponse} from "next/server";

// Dummy function to simulate fetching a listing from Etsy API
async function getListingFromEtsy(listingId: string) {
    // In a real application, you would make a call to the Etsy API
    // using something like: `https://api.etsy.com/v3/application/listings/${listingId}`
    // with your API key in the headers.
    console.log(`Fetching listing for ID: ${listingId}`);

    // This is mock data that simulates the response from the Etsy API.
    const mockData = {
        listing_id: parseInt(listingId),
        title: "Gorgeous handmade necklace",
        description: "A beautiful, handcrafted necklace made with love. Perfect for any occasion.",
        price: {amount: 2500, divisor: 100, currency_code: "USD"},
        views: 1234,
        num_favorers: 567,
        creation_timestamp: 1672531200, // January 1, 2023
        // You can add more fields as needed
    };

    return Promise.resolve(mockData);
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
        return NextResponse.json({error: "Failed to fetch listing data"}, {status: 500});
    }
}
