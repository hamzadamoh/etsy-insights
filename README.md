# Etsy Insights Dashboard

A comprehensive dashboard for analyzing Etsy shops and their product listings.

## Features

- **Financial Insights**: Revenue estimates, fee calculations, and sales metrics
- **Product Timeline Chart**: Visual representation of listing activity over time
- **Product Listings Table**: Detailed view of all shop listings with sorting and filtering
- **CSV Export**: Download listing data in CSV format
- **Competitor Tracking**: Monitor and compare competitor shops

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory with:
   ```
   ETSY_API_KEY=your_etsy_api_key_here
   ```
   
   Get your Etsy API key from: https://www.etsy.com/developers/documentation/getting_started/register

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

4. **Open the Application**
   Navigate to http://localhost:3000

## Usage

1. **Enter a Shop Name**: Type an Etsy shop name in the search field
2. **View Financial Insights**: See revenue estimates and fee calculations
3. **Analyze Product Timeline**: View the graph showing listing activity over time
4. **Browse Listings**: Sort and filter through all shop listings
5. **Export Data**: Download listings as CSV files

## Recent Fixes

- ✅ Fixed data fetching by updating the shop API to include listings
- ✅ Moved the Product Timeline Chart above the listings table
- ✅ Fixed toast notification system
- ✅ Integrated ShopAnalyzer component into the main dashboard

## Troubleshooting

If you see "No product listing data available":
1. Make sure you have a valid Etsy API key in your `.env.local` file
2. Check that the shop name you entered exists on Etsy
3. Verify your API key has the necessary permissions

## API Endpoints

- `POST /api/etsy/shop` - Fetch shop data and listings
- `GET /api/etsy/listing?id={id}` - Fetch individual listing data
