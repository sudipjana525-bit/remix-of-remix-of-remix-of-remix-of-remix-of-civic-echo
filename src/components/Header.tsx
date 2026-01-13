import { Shield, Eye, Menu, Map, Inbox } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SmartAlerts } from './SmartAlerts';

const navItems = [
  { href: '/', label: 'Feed' },
  { href: '/heatmap', label: 'Heatmap', icon: Map },
  { href: '/inbox', label: 'Inbox', icon: Inbox },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="relative">
            <Shield className="h-8 w-8 shield-icon animate-shield-pulse" />
            <Eye className="h-3 w-3 absolute -bottom-0.5 -right-0.5 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">CivicVoice</h1>
            <p className="text-xs text-muted-foreground">Anonymous Civic Reporting</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <SmartAlerts />
          
          <Button variant="ghost" size="sm" className="hidden lg:flex text-muted-foreground text-xs">
            <Shield className="h-3 w-3 mr-1" />
            Anonymity Protected
          </Button>
          
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-card border-border">
              <nav className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                        isActive 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-foreground hover:text-primary hover:bg-muted/50'
                      }`}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
