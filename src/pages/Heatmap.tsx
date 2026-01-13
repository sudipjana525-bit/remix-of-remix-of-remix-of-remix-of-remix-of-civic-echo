import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CivicHeatmap } from '@/components/CivicHeatmap';
import { LegalDisclaimer } from '@/components/LegalDisclaimer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, MapPin, BarChart3 } from 'lucide-react';

// Mock statistics
const stats = [
  { label: 'Total Incidents', value: '156', icon: BarChart3, trend: '+12% this week' },
  { label: 'Active Hotspots', value: '8', icon: MapPin, trend: '2 new' },
  { label: 'Critical Reports', value: '23', icon: AlertTriangle, trend: 'Requires attention' },
  { label: 'Trending Category', value: 'Corruption', icon: TrendingUp, trend: '+45% increase' },
];

export default function Heatmap() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <LegalDisclaimer variant="banner" />

      <main className="flex-1 container py-8">
        <div className="space-y-6">
          {/* Page header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Civic Incident Heatmap
            </h1>
            <p className="text-muted-foreground mt-1">
              Geographic visualization of reported incidents. All locations are approximate to protect reporter privacy.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {stat.trend}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Heatmap */}
          <CivicHeatmap />

          {/* Top locations table */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Top Incident Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { location: 'Metro District', count: 23, change: '+5', severity: 'high' },
                  { location: 'Central Hospital Area', count: 15, change: '+3', severity: 'high' },
                  { location: 'Highway 47 Section', count: 12, change: '+2', severity: 'medium' },
                  { location: 'Old Town Market', count: 9, change: '0', severity: 'medium' },
                  { location: 'Riverside Colony', count: 8, change: '-1', severity: 'low' },
                ].map((loc) => (
                  <div 
                    key={loc.location}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-severity-${loc.severity}`} />
                      <span className="font-medium">{loc.location}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">{loc.count} incidents</span>
                      <Badge 
                        variant="outline" 
                        className={loc.change.startsWith('+') 
                          ? 'border-severity-high text-severity-high' 
                          : loc.change.startsWith('-')
                          ? 'border-credible text-credible'
                          : 'border-muted-foreground text-muted-foreground'
                        }
                      >
                        {loc.change} this week
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
