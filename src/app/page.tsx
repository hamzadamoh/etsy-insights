import EtsyInsightsPage from '@/components/etsy/etsy-insights-page';
import { Store } from 'lucide-react';

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8 no-print">
            <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-lg mb-4">
              <Store className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground">
              Etsy Insights
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Uncover product trends and analyze any Etsy store. Enter a store name and filters to get started.
            </p>
          </header>
          
          <div className="printable-area">
            <EtsyInsightsPage />
          </div>

        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground no-print">
        Etsy Insights © {new Date().getFullYear()}
      </footer>
    </>
  );
}
