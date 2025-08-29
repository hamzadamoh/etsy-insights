import type { EtsyListing } from "@/lib/types";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { timeSince } from "@/lib/utils";

export function TopListingsTable({ listings }: { listings: EtsyListing[] }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Top listings</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Listing</TableHead>
            <TableHead>Favorites</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Age</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing.listing_id}>
              <TableCell>
                <div className="flex items-center">
                  {listing.images && listing.images.length > 0 && (
                    <img src={listing.images[0].url_75x75} alt={listing.title} className="w-12 h-12 mr-4" />
                  )}
                  <a href={listing.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {listing.title}
                  </a>
                </div>
              </TableCell>
              <TableCell>{listing.num_favorers}</TableCell>
              <TableCell>{listing.views}</TableCell>
              <TableCell>{timeSince(listing.original_creation_timestamp)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
