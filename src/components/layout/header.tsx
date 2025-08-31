'use client';

import React from 'react';
import Link from 'next/link';
import { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { ShoppingCart, LogOut, User as UserIcon, Shield, Menu } from 'lucide-react';
import { auth } from '@/lib/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  user: User;
  isAdmin: boolean;
  onAdminPanelClick: () => void;
  onMenuClick?: () => void;
}

export function Header({ user, isAdmin, onAdminPanelClick, onMenuClick }: HeaderProps) {
  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <ShoppingCart className="h-6 w-6" />
            <span className="">Etsy Insights</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={onAdminPanelClick}>
                <Shield className="mr-2 h-4 w-4" />
                Admin Panel
              </Button>
            )}
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <UserIcon className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
