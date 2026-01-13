import { 
  Circle, 
  FileText, 
  RefreshCw, 
  CheckCircle2,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { IncidentStatusBadge } from './IncidentStatusBadge';
import type { TimelineEntry, IncidentStatus } from '@/lib/types';

interface IncidentTimelineProps {
  entries: TimelineEntry[];
  maxVisible?: number;
}

const entryConfig: Record<TimelineEntry['type'], {
  icon: React.ElementType;
  label: string;
  className: string;
}> = {
  initial: {
    icon: FileText,
    label: 'Initial Report',
    className: 'text-primary border-primary',
  },
  followup: {
    icon: MessageSquare,
    label: 'Follow-up',
    className: 'text-accent-foreground border-accent',
  },
  status_change: {
    icon: RefreshCw,
    label: 'Status Update',
    className: 'text-severity-medium border-severity-medium/50',
  },
  outcome: {
    icon: CheckCircle2,
    label: 'Outcome Update',
    className: 'text-credible border-credible',
  },
};

export function IncidentTimeline({ entries, maxVisible = 3 }: IncidentTimelineProps) {
  const [expanded, setExpanded] = useState(false);
  
  const visibleEntries = expanded ? entries : entries.slice(0, maxVisible);
  const hasMore = entries.length > maxVisible;

  if (entries.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground text-sm">
        No timeline entries yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
        
        <div className="space-y-4">
          {visibleEntries.map((entry, index) => {
            const config = entryConfig[entry.type];
            const Icon = config.icon;
            
            return (
              <div key={entry.id} className="relative flex gap-3 pl-8">
                {/* Icon bubble */}
                <div className={`absolute left-0 w-6 h-6 rounded-full bg-card border-2 flex items-center justify-center ${config.className}`}>
                  <Icon className="h-3 w-3" />
                </div>
                
                {/* Content */}
                <div className="flex-1 glass-card p-3 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">
                        {config.label}
                      </span>
                      <span className="anonymous-id text-xs">{entry.anonymousId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {entry.status && (
                        <IncidentStatusBadge status={entry.status} size="sm" />
                      )}
                      <span className="text-xs text-muted-foreground" title={format(entry.timestamp, 'PPpp')}>
                        {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-foreground/90">{entry.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="w-full text-muted-foreground hover:text-foreground gap-2"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Show {entries.length - maxVisible} more entries
            </>
          )}
        </Button>
      )}
    </div>
  );
}
