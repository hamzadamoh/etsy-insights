'use client';

import type {Metadata} from 'next';
import { Inter } from 'next/font/google'
import './globals.css';
import { ToastProvider } from "@/components/ui/toast"
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarContent } from "@/components/ui/sidebar";
import { Search } from 'lucide-react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-body antialiased h-full bg-background`}>
        <ToastProvider>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <Sidebar className="border-r">
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
                  </SidebarMenu>
                </SidebarContent>
              </Sidebar>
              <main className="flex-1">
                {children}
              </main>
            </div>
          </SidebarProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
