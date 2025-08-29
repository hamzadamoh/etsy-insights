'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface SidebarMenuButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

export function SidebarMenuButton({ href, icon, label, isActive }: SidebarMenuButtonProps) {
  return (
    <Link href={href} passHref>
        <Button
          variant={isActive ? 'secondary' : 'ghost'}
          className="w-full justify-start"
        >
          {icon}
          {label}
        </Button>
    </Link>
  );
}
