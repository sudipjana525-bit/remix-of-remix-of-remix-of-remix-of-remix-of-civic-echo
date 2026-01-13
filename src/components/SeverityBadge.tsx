import { cn } from '@/lib/utils';
import type { Severity } from '@/lib/anonymity';

const labelMap: Record<Severity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md';
}

export function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border font-medium',
        severity === 'low' && 'severity-badge-low',
        severity === 'medium' && 'severity-badge-medium',
        severity === 'high' && 'severity-badge-high',
        severity === 'critical' && 'severity-badge-critical',
        size === 'sm' && 'text-xs px-1.5 py-0.5',
        size === 'md' && 'text-xs px-2 py-1'
      )}
    >
      <span className={cn(
        'h-1.5 w-1.5 rounded-full',
        severity === 'low' && 'bg-severity-low',
        severity === 'medium' && 'bg-severity-medium',
        severity === 'high' && 'bg-severity-high',
        severity === 'critical' && 'bg-severity-critical animate-pulse',
      )} />
      {labelMap[severity]}
    </span>
  );
}
