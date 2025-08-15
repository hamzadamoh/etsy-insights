export interface EtsyShop {
  shop_id: number;
  shop_name: string;
  create_date: number;
  listing_active_count: number;
  digital_listing_count: number;
  transaction_sold_count: number;
  num_favorers: number;
  icon_url_fullxfull: string | null;
  url: string;
}

export interface EtsyListing {
  listing_id: number;
  listing_type: 'physical' | 'digital' | 'both';
  title: string;
  num_favorers: number;
  views: number;
  original_creation_timestamp: number;
  last_modified_timestamp: number;
  quantity: number;
  tags: string[];
  url: string;
  images: { url_75x75: string }[];
}

export interface EtsyApiResponse<T> {
  count: number;
  results: T[];
}

export interface TrendAnalysis {
    summary: string;
}

export interface EtsyData {
    shop: EtsyShop;
    listings: EtsyListing[];
    trendAnalysis: TrendAnalysis;
}

export type FilterState = {
  favorites: number;
  age: number;
  views: number;
};
