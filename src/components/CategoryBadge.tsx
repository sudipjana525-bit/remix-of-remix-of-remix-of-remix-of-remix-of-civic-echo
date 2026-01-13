import { 
  AlertTriangle, 
  Flame, 
  Scale, 
  Landmark, 
  ShieldAlert, 
  Heart, 
  Building2, 
  MoreHorizontal 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/lib/anonymity';

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

const labelMap: Record<Category, string> = {
  fraud: 'Fraud',
  violence: 'Violence',
  corruption: 'Corruption',
  governance: 'Governance',
  safety: 'Public Safety',
  healthcare: 'Healthcare',
  infrastructure: 'Infrastructure',
  other: 'Other',
};

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  const Icon = iconMap[category];
  
  return (
    <span
      className={cn(
        'category-chip inline-flex items-center gap-1.5',
        `bg-category-${category} border-category-${category} text-category-${category}`,
        size === 'sm' && 'text-xs px-2 py-0.5',
        size === 'md' && 'text-sm px-2.5 py-1'
      )}
    >
      <Icon className={cn(size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
      {labelMap[category]}
    </span>
  );
}
