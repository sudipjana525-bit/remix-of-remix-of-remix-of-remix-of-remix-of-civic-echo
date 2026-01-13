import { useState } from 'react';
import { MapPin, Filter, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES } from '@/lib/anonymity';
import type { Category } from '@/lib/anonymity';

interface HeatmapData {
  location: string;
  coordinates: { x: number; y: number };
  incidentCount: number;
  categories: { category: Category; count: number }[];
  severity: 'low' | 'medium' | 'high';
}

const mockHeatmapData: HeatmapData[] = [
  {
    location: 'Metro District',
    coordinates: { x: 35, y: 25 },
    incidentCount: 23,
    categories: [
      { category: 'fraud', count: 12 },
      { category: 'corruption', count: 8 },
      { category: 'governance', count: 3 },
    ],
    severity: 'high',
  },
  {
    location: 'Central Hospital Area',
    coordinates: { x: 55, y: 40 },
    incidentCount: 15,
    categories: [
      { category: 'healthcare', count: 11 },
      { category: 'safety', count: 4 },
    ],
    severity: 'high',
  },
  {
    location: 'Riverside Colony',
    coordinates: { x: 25, y: 60 },
    incidentCount: 8,
    categories: [
      { category: 'infrastructure', count: 5 },
      { category: 'safety', count: 3 },
    ],
    severity: 'medium',
  },
  {
    location: 'Highway 47 Section',
    coordinates: { x: 70, y: 30 },
    incidentCount: 12,
    categories: [
      { category: 'corruption', count: 7 },
      { category: 'infrastructure', count: 5 },
    ],
    severity: 'high',
  },
  {
    location: 'North Industrial Zone',
    coordinates: { x: 45, y: 70 },
    incidentCount: 5,
    categories: [
      { category: 'safety', count: 3 },
      { category: 'other', count: 2 },
    ],
    severity: 'low',
  },
  {
    location: 'Old Town Market',
    coordinates: { x: 60, y: 55 },
    incidentCount: 9,
    categories: [
      { category: 'fraud', count: 6 },
      { category: 'violence', count: 3 },
    ],
    severity: 'medium',
  },
];

const severityColors = {
  low: 'bg-severity-low/60',
  medium: 'bg-severity-medium/60',
  high: 'bg-severity-high/60',
};

const severityRingColors = {
  low: 'ring-severity-low',
  medium: 'ring-severity-medium',
  high: 'ring-severity-high',
};

interface CivicHeatmapProps {
  className?: string;
}

export function CivicHeatmap({ className }: CivicHeatmapProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<HeatmapData | null>(null);

  const filteredData = selectedCategory === 'all' 
    ? mockHeatmapData 
    : mockHeatmapData.filter(d => d.categories.some(c => c.category === selectedCategory));

  const getMarkerSize = (count: number) => {
    if (count >= 20) return 'w-12 h-12';
    if (count >= 10) return 'w-10 h-10';
    return 'w-8 h-8';
  };

  return (
    <div className={className}>
      <Card className="glass-card overflow-hidden">
        <CardHeader className="border-b border-border/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Civic Incident Heatmap</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as Category | 'all')}>
                <SelectTrigger className="w-40 bg-muted/50 border-border">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Map visualization */}
          <div className="relative h-[400px] bg-muted/20 overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Location markers */}
            {filteredData.map((data) => (
              <button
                key={data.location}
                onClick={() => setSelectedLocation(selectedLocation?.location === data.location ? null : data)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full 
                  ${getMarkerSize(data.incidentCount)} 
                  ${severityColors[data.severity]}
                  ring-2 ${severityRingColors[data.severity]}
                  flex items-center justify-center
                  transition-all duration-200 hover:scale-110 cursor-pointer
                  ${selectedLocation?.location === data.location ? 'scale-125 ring-4' : ''}
                `}
                style={{ left: `${data.coordinates.x}%`, top: `${data.coordinates.y}%` }}
                title={data.location}
              >
                <span className="text-xs font-bold text-foreground">{data.incidentCount}</span>
              </button>
            ))}

            {/* Privacy notice */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <div className="flex items-center gap-2 px-2 py-1 bg-card/80 backdrop-blur-sm rounded text-xs text-muted-foreground">
                <Layers className="h-3 w-3" />
                <span>Approximate locations only</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 bg-card/80 backdrop-blur-sm rounded">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-severity-low" />
                  <span className="text-xs text-muted-foreground">Low</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-severity-medium" />
                  <span className="text-xs text-muted-foreground">Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-severity-high" />
                  <span className="text-xs text-muted-foreground">High</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected location details */}
          {selectedLocation && (
            <div className="p-4 border-t border-border/50 bg-muted/10 animate-fade-in">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {selectedLocation.location}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedLocation.incidentCount} incident{selectedLocation.incidentCount !== 1 ? 's' : ''} reported
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className={`border-severity-${selectedLocation.severity} text-severity-${selectedLocation.severity}`}
                >
                  {selectedLocation.severity} density
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedLocation.categories.map((cat) => {
                  const categoryInfo = CATEGORIES.find(c => c.id === cat.category);
                  return (
                    <Badge key={cat.category} variant="secondary" className="text-xs">
                      {categoryInfo?.label}: {cat.count}
                    </Badge>
                  );
                })}
              </div>
              <div className="mt-3">
                <Button variant="outline" size="sm" className="text-xs">
                  View all incidents in this area
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
