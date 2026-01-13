import { useState } from 'react';
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
  X,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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

interface FilterButtonProps {
  selectedCategory: Category | null;
  selectedSeverity: Severity | null;
  onCategoryChange: (category: Category | null) => void;
  onSeverityChange: (severity: Severity | null) => void;
}

export function FilterButton({
  selectedCategory,
  selectedSeverity,
  onCategoryChange,
  onSeverityChange,
}: FilterButtonProps) {
  const [open, setOpen] = useState(false);
  
  const activeFiltersCount = (selectedCategory ? 1 : 0) + (selectedSeverity ? 1 : 0);
  const hasFilters = activeFiltersCount > 0;

  const clearFilters = () => {
    onCategoryChange(null);
    onSeverityChange(null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={hasFilters ? "secondary" : "outline"} 
          size="sm" 
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasFilters && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground">
              {activeFiltersCount}
            </Badge>
          )}
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-72 p-4 bg-card border-border z-50" 
        align="start"
        sideOffset={8}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </h3>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-foreground h-7"
              >
                <X className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              Category
            </h4>
            <div className="grid grid-cols-2 gap-1">
              {CATEGORIES.map((cat) => {
                const Icon = iconMap[cat.id];
                const isSelected = selectedCategory === cat.id;
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => onCategoryChange(isSelected ? null : cat.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs transition-colors',
                      isSelected 
                        ? 'bg-primary/20 text-primary font-medium' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              Severity
            </h4>
            <div className="flex flex-wrap gap-1">
              {SEVERITY_LEVELS.map((sev) => {
                const isSelected = selectedSeverity === sev.id;
                
                return (
                  <button
                    key={sev.id}
                    onClick={() => onSeverityChange(isSelected ? null : sev.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors',
                      isSelected
                        ? 'bg-primary/20 text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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

          {/* Active filters summary */}
          {hasFilters && (
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Showing results for:
                {selectedCategory && (
                  <span className="ml-1 text-foreground font-medium">
                    {CATEGORIES.find(c => c.id === selectedCategory)?.label}
                  </span>
                )}
                {selectedCategory && selectedSeverity && <span> • </span>}
                {selectedSeverity && (
                  <span className="text-foreground font-medium">
                    {SEVERITY_LEVELS.find(s => s.id === selectedSeverity)?.label}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
