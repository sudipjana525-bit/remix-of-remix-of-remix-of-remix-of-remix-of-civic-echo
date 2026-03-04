import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
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
import 'leaflet/dist/leaflet.css';

interface HeatmapData {
  location: string;
  coordinates: { lat: number; lng: number };
  incidentCount: number;
  categories: { category: Category; count: number }[];
  severity: 'low' | 'medium' | 'high';
}

const mockHeatmapData: HeatmapData[] = [
  {
    location: 'Metro District, Mumbai',
    coordinates: { lat: 19.076, lng: 72.8777 },
    incidentCount: 23,
    categories: [
      { category: 'fraud', count: 12 },
      { category: 'corruption', count: 8 },
      { category: 'governance', count: 3 },
    ],
    severity: 'high',
  },
  {
    location: 'Central Hospital Area, Delhi',
    coordinates: { lat: 28.6139, lng: 77.209 },
    incidentCount: 15,
    categories: [
      { category: 'healthcare', count: 11 },
      { category: 'safety', count: 4 },
    ],
    severity: 'high',
  },
  {
    location: 'Riverside Colony, Kolkata',
    coordinates: { lat: 22.5726, lng: 88.3639 },
    incidentCount: 8,
    categories: [
      { category: 'infrastructure', count: 5 },
      { category: 'safety', count: 3 },
    ],
    severity: 'medium',
  },
  {
    location: 'Highway 47 Section, Bangalore',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    incidentCount: 12,
    categories: [
      { category: 'corruption', count: 7 },
      { category: 'infrastructure', count: 5 },
    ],
    severity: 'high',
  },
  {
    location: 'North Industrial Zone, Chennai',
    coordinates: { lat: 13.0827, lng: 80.2707 },
    incidentCount: 5,
    categories: [
      { category: 'safety', count: 3 },
      { category: 'other', count: 2 },
    ],
    severity: 'low',
  },
  {
    location: 'Old Town Market, Hyderabad',
    coordinates: { lat: 17.385, lng: 78.4867 },
    incidentCount: 9,
    categories: [
      { category: 'fraud', count: 6 },
      { category: 'violence', count: 3 },
    ],
    severity: 'medium',
  },
];

interface CivicHeatmapProps {
  className?: string;
}

const severityTokenByLevel = {
  low: 'hsl(var(--severity-low))',
  medium: 'hsl(var(--severity-medium))',
  high: 'hsl(var(--severity-high))',
};

export function CivicHeatmap({ className }: CivicHeatmapProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<HeatmapData | null>(null);
  const mapNodeRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);

  const filteredData = useMemo(
    () =>
      selectedCategory === 'all'
        ? mockHeatmapData
        : mockHeatmapData.filter((d) => d.categories.some((c) => c.category === selectedCategory)),
    [selectedCategory]
  );

  const getMarkerRadius = (count: number) => {
    if (count >= 20) return 18;
    if (count >= 10) return 14;
    return 10;
  };

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) return;

    const map = L.map(mapNodeRef.current, {
      zoomControl: true,
      worldCopyJump: true,
      minZoom: 2,
      maxZoom: 18,
    }).setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const layer = markerLayerRef.current;
    if (!layer) return;

    layer.clearLayers();

    filteredData.forEach((data) => {
      const color = severityTokenByLevel[data.severity];
      const marker = L.circleMarker([data.coordinates.lat, data.coordinates.lng], {
        radius: getMarkerRadius(data.incidentCount),
        color,
        fillColor: color,
        fillOpacity: 0.45,
        weight: 2,
      });

      marker.bindPopup(`<strong>${data.location}</strong><br/>${data.incidentCount} incidents`);

      marker.on('click', () => {
        setSelectedLocation((prev) => (prev?.location === data.location ? null : data));
      });

      marker.addTo(layer);
    });
  }, [filteredData]);

  useEffect(() => {
    if (!selectedLocation) return;
    const stillVisible = filteredData.some((item) => item.location === selectedLocation.location);
    if (!stillVisible) setSelectedLocation(null);
  }, [filteredData, selectedLocation]);

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
          <div className="relative h-[450px]">
            <div ref={mapNodeRef} className="h-full w-full" />

            <div className="absolute bottom-3 right-3 z-[500] flex items-center gap-2 px-3 py-2 bg-card/90 backdrop-blur-sm rounded-lg shadow-md border border-border/50">
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

            <div className="absolute bottom-3 left-3 z-[500] flex items-center gap-2 px-3 py-2 bg-card/90 backdrop-blur-sm rounded-lg shadow-md border border-border/50">
              <Layers className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Approximate locations only</span>
            </div>
          </div>

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
                  const categoryInfo = CATEGORIES.find((c) => c.id === cat.category);
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
