'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { buttonVariants } from '@/components/ui/button';
import { Home, Search, ShoppingCart, Tag, Users, List, Store } from 'lucide-react';

const navItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/keyword-research", icon: Search, label: "Keyword Research" },
  { href: "/shop-analyzer", icon: Store, label: "Shop Analyzer" },
  { href: "/listing-analyzer", icon: List, label: "Listing Analyzer" },
  { href: "/tag-suggestions", icon: Tag, label: "Tag Suggestions" },
  { href: "/competitor-tracker", icon: Users, label: "Competitor Tracker" },
  { href: "/bulk-shop-analysis", icon: List, label: "Bulk Shop Analysis" },
];

export function Sidebar() {
    const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <ShoppingCart className="h-6 w-6" />
            <span className="">Etsy Insights</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: pathname === item.href ? "secondary" : "ghost" }),
                  "w-full justify-start"
                )}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
