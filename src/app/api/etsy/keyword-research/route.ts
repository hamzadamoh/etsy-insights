'use server'

import {NextRequest, NextResponse} from "next/server";

// Dummy function to simulate keyword research from Etsy API
async function getKeywordResearchFromEtsy(keyword: string) {
    // In a real application, this would involve multiple calls to the Etsy API
    // to get listing data for a keyword, then perform aggregations.
    console.log(`Performing keyword research for: ${keyword}`);

    // This is mock data that simulates the results of the research.
    const mockData = {
        keyword: keyword,
        num_listings: 1500,
        average_price: 35.50,
        average_views: 850,
        average_favorites: 120,
        top_tags: [
            {tag: "handmade jewelry", count: 800},
            {tag: "custom necklace", count: 650},
            {tag: "gift for her", count: 500},
            {tag: "minimalist jewelry", count: 450},
            {tag: "gold necklace", count: 300},
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
        const researchData = await getKeywordResearchFromEtsy(keyword);
        return NextResponse.json(researchData);
    } catch (error) {
        console.error("Error performing keyword research:", error);
        return NextResponse.json({error: "Failed to perform keyword research"}, {status: 500});
    }
}
