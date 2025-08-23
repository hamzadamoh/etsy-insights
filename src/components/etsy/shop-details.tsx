'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { EtsyShop, FilterState } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ShopDetailsProps {
  shop: EtsyShop;
  filters: FilterState;
}

const StatCard = ({ title, value, status }: { title: string; value: string | number; status?: 'good' | 'bad' }) => {
    let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
    if (status === 'good') badgeVariant = 'default'; // This will be the green accent
    if (status === 'bad') badgeVariant = 'destructive';

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-card rounded-lg border text-center">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <Badge variant={status ? (status === 'good' ? 'outline' : 'destructive') : 'secondary'} className={`text-lg font-bold ${status === 'good' ? 'text-accent-foreground border-accent' : ''}`}>
                {value}
            </Badge>
        </div>
    )
};

export function ShopDetails({ shop, filters }: ShopDetailsProps) {
  const shopAgeInDays = Math.ceil((new Date().getTime() - new Date(shop.create_date * 1000).getTime()) / (1000 * 60 * 60 * 24));
  const { toast } = useToast();

  const handleCopy = async () => {
    const dataToCopy = `${shop.shop_name}\t${shopAgeInDays}\t${shop.transaction_sold_count}`;
    try {
      await navigator.clipboard.writeText(dataToCopy);
      toast({
        title: "Copied!",
        description: "Shop name, age, and sales copied to clipboard",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Failed to copy to clipboard",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/50">
              <AvatarImage src={shop.icon_url_fullxfull || ''} alt={shop.shop_name} />
              <AvatarFallback>{shop.shop_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{shop.shop_name}</CardTitle>
              <CardDescription>
                On Etsy for {formatDistanceToNow(new Date(shop.create_date * 1000))}
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy Data
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Age (days)" value={shopAgeInDays} status={shopAgeInDays <= filters.age ? 'good' : 'bad'} />
            <StatCard title="Total Sales" value={shop.transaction_sold_count.toLocaleString()} />
            <StatCard title="Shop Favorites" value={shop.num_favorers.toLocaleString()} />
            <StatCard title="Active Listings" value={shop.listing_active_count.toLocaleString()} />
        </div>
        
        {/* Financial Metrics */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
          <h3 className="text-lg font-semibold mb-3 text-center">Financial Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {(shop.transaction_sold_count / Math.max(shopAgeInDays, 1)).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Sales/Day</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {shop.transaction_sold_count > 0 ? 'Active' : 'No Sales'}
              </div>
              <div className="text-sm text-muted-foreground">Sales Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {shop.transaction_sold_count > 0 ? 'Yes' : 'No'}
              </div>
              <div className="text-sm text-muted-foreground">Generating Revenue</div>
            </div>
          </div>
          
          {/* Etsy Fee Calculator */}
          <div className="mt-4 p-3 bg-background rounded border">
            <div className="text-sm text-muted-foreground text-center mb-2">
              💡 Etsy Fee Calculator (Estimated)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Transaction Fee (6.5%):</span>
                  <span className="font-mono">-${(shop.transaction_sold_count * 0.065).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Processing (3%):</span>
                  <span className="font-mono">-${(shop.transaction_sold_count * 0.03).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Listing Fee ($0.20 each):</span>
                  <span className="font-mono">-${(shop.listing_active_count * 0.20).toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Fees:</span>
                  <span className="font-mono text-red-600">
                    -${((shop.transaction_sold_count * 0.095) + (shop.listing_active_count * 0.20)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-green-600">
                  <span>Net Revenue:</span>
                  <span className="font-mono">
                    ${(shop.transaction_sold_count - ((shop.transaction_sold_count * 0.095) + (shop.listing_active_count * 0.20))).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Revenue Estimates */}
          <div className="mt-4 p-3 bg-background rounded border">
            <div className="text-sm text-muted-foreground text-center mb-2">
              📊 Revenue Estimates (Based on Typical Etsy Pricing)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  ${(shop.transaction_sold_count * 15).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Conservative ($15 avg)</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  ${(shop.transaction_sold_count * 25).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Moderate ($25 avg)</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  ${(shop.transaction_sold_count * 35).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Premium ($35 avg)</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-center mt-2">
              *Estimates based on typical Etsy product pricing ranges
            </div>
          </div>
        </div>
        <div className="mt-4 text-center text-sm">
            <p className="text-muted-foreground">
                Filter criteria: Age {'<='} <span className="font-semibold text-primary">{filters.age} days</span>, 
                Favorites {'>='} <span className="font-semibold text-primary">{filters.favorites}</span>, 
                Views {'>='} <span className="font-semibold text-primary">{filters.views}</span>.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
