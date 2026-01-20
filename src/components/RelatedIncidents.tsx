import { Link2, MapPin, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import type { RelatedIncident } from '@/lib/types';

interface RelatedIncidentsProps {
  count: number;
  incidents?: RelatedIncident[];
  onViewAll?: () => void;
}

export function RelatedIncidents({ count, incidents = [], onViewAll }: RelatedIncidentsProps) {
  if (count === 0) return null;

  return (
    <div className="glass-card p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <Link2 className="h-4 w-4" />
          <span className="text-xs font-medium">
            {count} Related {count === 1 ? 'Report' : 'Reports'}
          </span>
        </div>
        {onViewAll && count > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 text-xs text-muted-foreground hover:text-foreground"
            onClick={onViewAll}
          >
            View all
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        )}
      </div>

      {incidents.length > 0 && (
        <div className="space-y-1.5 max-h-[88px] overflow-y-auto scrollbar-hide">
          {incidents.map((incident) => (
            <div 
              key={incident.id}
              className="flex items-center justify-between text-xs text-muted-foreground p-2 rounded bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="anonymous-id text-xs">{incident.anonymousId}</span>
                {incident.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-2.5 w-2.5" />
                    {incident.location}
                  </span>
                )}
              </div>
              <span className="flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" />
                {formatDistanceToNow(incident.createdAt, { addSuffix: true })}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground italic">
        Related reports share similar location, category, or timeframe.
      </p>
    </div>
  );
}
