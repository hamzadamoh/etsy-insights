'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarMenuButton } from '@/components/ui/sidebar-menu-button';
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
            <SidebarMenuButton
              href="/"
              icon={<Home className="h-4 w-4" />}
              label="Dashboard"
              isActive={pathname === '/'}
            />
            <SidebarMenuButton
              href="/keyword-research"
              icon={<Search className="h-4 w-4" />}
              label="Keyword Research"
              isActive={pathname === '/keyword-research'}
            />
            <SidebarMenuButton
              href="/shop-analyzer"
              icon={<ShoppingCart className="h-4 w-4" />}
              label="Shop Analyzer"
              isActive={pathname === '/shop-analyzer'}
            />
            <SidebarMenuButton
              href="/listing-analyzer"
              icon={<List className="h-4 w-4" />}
              label="Listing Analyzer"
              isActive={pathname === '/listing-analyzer'}
            />
            <SidebarMenuButton
              href="/tag-suggestions"
              icon={<Tag className="h-4 w-4" />}
              label="Tag Suggestions"
              isActive={pathname === '/tag-suggestions'}
            />
            <SidebarMenuButton
              href="/competitor-tracker"
              icon={<Users className="h-4 w-4" />}
              label="Competitor Tracker"
              isActive={pathname === '/competitor-tracker'}
            />
            <SidebarMenuButton
              href="/bulk-shop-analysis"
              icon={<List className="h-4 w-4" />}
              label="Bulk Shop Analysis"
              isActive={pathname === '/bulk-shop-analysis'}
            />
          </nav>
        </div>
      </div>
    </div>
  );
}
