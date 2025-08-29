'use client';

import type {Metadata} from 'next';
import { Inter } from 'next/font/google'
import './globals.css';
import { ToastProvider } from "@/components/ui/toast"
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { Search, Store, ClipboardList, Tags, Users, FileStack } from 'lucide-react';
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.variable} font-body antialiased h-full`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <SidebarProvider>
              <div className="flex min-h-screen">
                <Sidebar className="border-r bg-card">
                  <SidebarContent>
                    <SidebarHeader>
                      <div className="font-semibold text-lg">Etsy Insights</div>
                    </SidebarHeader>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton href="/keyword-research">
                          <Search className="h-5 w-5" />
                          <span>Keyword Research</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton href="/shop-analyzer">
                          <Store className="h-5 w-5" />
                          <span>Shop Analyzer</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton href="/listing-analyzer">
                          <ClipboardList className="h-5 w-5" />
                          <span>Listing Analyzer</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton href="/tag-suggestions">
                          <Tags className="h-5 w-5" />
                          <span>Tag Suggestions</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton href="/competitor-tracker">
                          <Users className="h-5 w-5" />
                          <span>Competitor Tracker</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton href="/bulk-shop-analysis">
                          <FileStack className="h-5 w-5" />
                          <span>Bulk Shop Analysis</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarContent>
                  <SidebarFooter>
                    <ThemeToggle />
                  </SidebarFooter>
                </Sidebar>
                <div className="flex flex-1 flex-col overflow-hidden">
                  <header className="flex h-14 items-center border-b bg-card px-6">
                    {/* Header content will go here */}
                  </header>
                  <main className="flex-1 overflow-y-auto p-6">
                    {children}
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
