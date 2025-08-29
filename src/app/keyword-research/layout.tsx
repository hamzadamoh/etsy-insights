'use client';

import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarContent, SidebarTrigger, SidebarTitle } from "@/components/ui/sidebar";
import { Search } from 'lucide-react';

export default function KeywordResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="border-r" collapsible={false}>
          <SidebarContent>
            <SidebarHeader>
              <SidebarTitle>Etsy Insights</SidebarTitle>
              <SidebarTrigger />
            </SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton href="/keyword-research">
                  <Search className="h-5 w-5" />
                  <span>Keyword Research</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
