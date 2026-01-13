import { Star, Award, Shield, UserCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { CredibilityBadgeInfo } from '@/lib/types';

interface CredibilityBadgeProps {
  badge: CredibilityBadgeInfo;
}

const badgeConfig: Record<CredibilityBadgeInfo['level'], {
  icon: React.ElementType;
  label: string;
  description: string;
  className: string;
} | null> = {
  none: null,
  new: {
    icon: UserCheck,
    label: 'New Reporter',
    description: 'New anonymous contributor to the platform',
    className: 'text-muted-foreground bg-muted/50 border-border',
  },
  trusted: {
    icon: Shield,
    label: 'Trusted Reporter',
    description: 'Consistent contributor with credible reports',
    className: 'text-primary bg-primary/10 border-primary/30',
  },
  veteran: {
    icon: Award,
    label: 'Veteran Reporter',
    description: 'Long-standing contributor with high credibility score',
    className: 'text-credible bg-credible/10 border-credible/30',
  },
};

export function CredibilityBadge({ badge }: CredibilityBadgeProps) {
  const config = badgeConfig[badge.level];
  
  if (!config) return null;
  
  const Icon = config.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${config.className} cursor-help`}>
            <Icon className="h-3 w-3" />
            <span className="font-medium">{config.label}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">{config.label}</p>
            <p className="text-xs text-muted-foreground">{config.description}</p>
            <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
              <span>{badge.reportsCount} reports</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                {badge.credibilityScore}% credibility
              </span>
            </div>
            <p className="text-xs text-muted-foreground italic pt-1">
              Badge is device-scoped and cannot be transferred.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
