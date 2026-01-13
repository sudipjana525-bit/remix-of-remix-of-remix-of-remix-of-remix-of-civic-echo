import { Shield, Eye, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Shield className="h-8 w-8 shield-icon animate-shield-pulse" />
            <Eye className="h-3 w-3 absolute -bottom-0.5 -right-0.5 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">CivicVoice</h1>
            <p className="text-xs text-muted-foreground">Anonymous Civic Reporting</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Feed
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Trending
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden md:flex text-muted-foreground">
            Your Anonymity is Protected
          </Button>
          
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-card border-border">
              <nav className="flex flex-col gap-4 mt-8">
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Feed
                </a>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Trending
                </a>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  How It Works
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
