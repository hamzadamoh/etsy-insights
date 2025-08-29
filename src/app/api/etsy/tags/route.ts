'use server'

import {NextRequest, NextResponse} from "next/server";

// Dummy function to simulate fetching from Etsy API
async function getListingsFromEtsy(keyword: string) {
    // In a real application, you would make a call to the Etsy API
    // using something like: `https://api.etsy.com/v3/application/listings/active?keywords=${keyword}`
    // with your API key in the headers.
    console.log(`Fetching listings for keyword: ${keyword}`);

    // This is mock data that simulates the response from the Etsy API.
    const mockData = {
        count: 2,
        results: [
            {
                listing_id: 1,
                title: "Personalized dog collar",
                tags: ["dog collar", "personalized dog", "pet accessories", "custom pet tag", "leather dog collar"],
            },
            {
                listing_id: 2,
                title: "Handmade dog leash",
                tags: ["dog leash", "handmade pet supply", "pet accessories", "strong dog leash", "nylon dog leash"],
            },
        ],
    };

    return Promise.resolve(mockData);
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');

    if (!keyword) {
        return NextResponse.json({error: "Keyword is required"}, {status: 400});
    }

    try {
        const listingsResponse = await getListingsFromEtsy(keyword);
        const allTags = listingsResponse.results.flatMap(listing => listing.tags);

        // Using a Set to get unique tags
        const uniqueTags = [...new Set(allTags)];

        return NextResponse.json({tags: uniqueTags});
    } catch (error) {
        console.error("Error fetching tag suggestions:", error);
        return NextResponse.json({error: "Failed to fetch tag suggestions"}, {status: 500});
    }
}
