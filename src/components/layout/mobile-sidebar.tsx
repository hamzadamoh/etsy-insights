'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { buttonVariants } from '@/components/ui/button';
import { Home, Search, ShoppingCart, Tag, Users, List, Store, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/keyword-research", icon: Search, label: "Keyword Research" },
  { href: "/shop-analyzer", icon: Store, label: "Shop Analyzer" },
  { href: "/listing-analyzer", icon: List, label: "Listing Analyzer" },
  { href: "/tag-suggestions", icon: Tag, label: "Tag Suggestions" },
  { href: "/competitor-tracker", icon: Users, label: "Competitor Tracker" },
  { href: "/bulk-shop-analysis", icon: List, label: "Bulk Shop Analysis" },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 z-50 h-full w-64 bg-background border-r md:hidden">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-14 items-center justify-between border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <ShoppingCart className="h-6 w-6" />
              <span>Etsy Insights</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
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
    </>
  );
}
