import type {Metadata} from 'next';
import { Inter } from 'next/font/google'
import './globals.css';
import { ToastProvider } from "@/components/ui/toast"
import { SidebarProvider } from '@/components/ui/sidebar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Etsy Insights',
  description: 'Uncover product trends and analyze any Etsy store.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-body antialiased h-full bg-background`}>
        <SidebarProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
