import { 
  AlertTriangle, 
  Flame, 
  Scale, 
  Landmark, 
  ShieldAlert, 
  Heart, 
  Building2, 
  MoreHorizontal,
  Filter,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CATEGORIES, SEVERITY_LEVELS } from '@/lib/anonymity';
import type { Category, Severity } from '@/lib/anonymity';

const iconMap = {
  fraud: AlertTriangle,
  violence: Flame,
  corruption: Scale,
  governance: Landmark,
  safety: ShieldAlert,
  healthcare: Heart,
  infrastructure: Building2,
  other: MoreHorizontal,
};

interface FilterSidebarProps {
  selectedCategory: Category | null;
  selectedSeverity: Severity | null;
  onCategoryChange: (category: Category | null) => void;
  onSeverityChange: (severity: Severity | null) => void;
}

export function FilterSidebar({
  selectedCategory,
  selectedSeverity,
  onCategoryChange,
  onSeverityChange,
}: FilterSidebarProps) {
  const hasFilters = selectedCategory || selectedSeverity;

  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      <div className="glass-card p-4 sticky top-20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </h3>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onCategoryChange(null);
                onSeverityChange(null);
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            Category
          </h4>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => {
              const Icon = iconMap[cat.id];
              const isSelected = selectedCategory === cat.id;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(isSelected ? null : cat.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                    isSelected 
                      ? `bg-category-${cat.id} text-category-${cat.id}` 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Severity */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            Severity
          </h4>
          <div className="space-y-1">
            {SEVERITY_LEVELS.map((sev) => {
              const isSelected = selectedSeverity === sev.id;
              
              return (
                <button
                  key={sev.id}
                  onClick={() => onSeverityChange(isSelected ? null : sev.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                    isSelected
                      ? sev.id === 'low' && 'severity-badge-low'
                      : '',
                    isSelected
                      ? sev.id === 'medium' && 'severity-badge-medium'
                      : '',
                    isSelected
                      ? sev.id === 'high' && 'severity-badge-high'
                      : '',
                    isSelected
                      ? sev.id === 'critical' && 'severity-badge-critical'
                      : '',
                    !isSelected && 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <span className={cn(
                    'h-2 w-2 rounded-full',
                    `bg-severity-${sev.id}`,
                    sev.id === 'critical' && 'animate-pulse'
                  )} />
                  {sev.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
