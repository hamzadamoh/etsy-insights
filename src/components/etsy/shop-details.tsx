'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { EtsyShop, FilterState } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

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

  return (
    <Card>
      <CardHeader>
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
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Age (days)" value={shopAgeInDays} status={shopAgeInDays <= filters.age ? 'good' : 'bad'} />
            <StatCard title="Total Sales" value={shop.transaction_sold_count.toLocaleString()} />
            <StatCard title="Shop Favorites" value={shop.num_favorers.toLocaleString()} />
            <StatCard title="Active Listings" value={shop.listing_active_count.toLocaleString()} />
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
