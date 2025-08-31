'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, ShoppingCart, Tag, Users, List } from 'lucide-react';

export function Sidebar() {
    const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <a href="/" className="flex items-center gap-2 font-semibold">
            <ShoppingCart className="h-6 w-6" />
            <span className="">Etsy Insights</span>
          </a>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link href="/">
              <Button
                variant={pathname === '/' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/keyword-research">
              <Button
                variant={pathname === '/keyword-research' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <Search className="h-4 w-4" />
                Keyword Research
              </Button>
            </Link>
            <Link href="/shop-analyzer">
              <Button
                variant={pathname === '/shop-analyzer' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <ShoppingCart className="h-4 w-4" />
                Shop Analyzer
              </Button>
            </Link>
            <Link href="/listing-analyzer">
              <Button
                variant={pathname === '/listing-analyzer' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <List className="h-4 w-4" />
                Listing Analyzer
              </Button>
            </Link>
            <Link href="/tag-suggestions">
              <Button
                variant={pathname === '/tag-suggestions' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <Tag className="h-4 w-4" />
                Tag Suggestions
              </Button>
            </Link>
            <Link href="/competitor-tracker">
              <Button
                variant={pathname === '/competitor-tracker' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <Users className="h-4 w-4" />
                Competitor Tracker
              </Button>
            </Link>
            <Link href="/bulk-shop-analysis">
              <Button
                variant={pathname === '/bulk-shop-analysis' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <List className="h-4 w-4" />
                Bulk Shop Analysis
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
