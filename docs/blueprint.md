# **App Name**: Etsy Insights

## Core Features:

- Data Input Form: Collect store name, favorite filter, age, and view thresholds via a user-friendly HTML form.
- Shop Data Retrieval: Fetch shop data using the Etsy API based on the store name provided by the user. https://api.etsy.com/v3/application/shops?shop_name=, requires shop_id and API Key to work. Keys must not be stored client-side.
- Listing Data Retrieval: Fetch listing data for the given shop. API endpoint https://api.etsy.com/v3/application/shops/{$shop_id}/listings/active?limit=100 requires API Key to work.
- Data Display: Display the listing results (listing type, listing id, total favorites, total views, age, last modified, quantity, and tags) in an HTML table.
- Data Highlighting: Highlight data that meets user-specified criteria (favorites, age, views) for quick analysis.
- Link to Etsy Product: Provide direct links to each product listing on Etsy.
- Trend Identification: AI-powered "Etsy Trend Spotter": Using a tool, provide an AI-generated summary of trending keywords from the product tags to help users quickly identify popular items and relevant opportunities.

## Style Guidelines:

- Primary color: Muted blue (#6A86A4) for a professional, data-driven feel.
- Background color: Very light gray (#F0F2F5), almost the same hue as the primary, but extremely desaturated, so the data is the main focus.
- Accent color: Soft green (#86A46A) for highlighting key metrics and CTAs, approximately 30 degrees from the primary, a contrasting brightness and saturation to call attention.
- Body and headline font: 'Inter', a grotesque-style sans-serif font.
- Maximize data presentation: use a clean, table-focused design with clear visual hierarchy.
- Incorporate simple icons for categories and actions within the data table.
- Subtle transitions on data updates and filtering to enhance user experience without being distracting.