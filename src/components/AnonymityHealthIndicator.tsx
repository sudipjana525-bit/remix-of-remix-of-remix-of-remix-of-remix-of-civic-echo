import { useState } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Lock, 
  Upload,
  ChevronDown,
  ChevronUp,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { AnonymityHealth } from '@/lib/types';

interface AnonymityHealthIndicatorProps {
  health?: AnonymityHealth;
  variant?: 'compact' | 'full';
}

const defaultHealth: AnonymityHealth = {
  ipMasked: true,
  metadataStripped: true,
  noTrackers: true,
  secureUpload: true,
};

const healthItems = [
  { key: 'ipMasked', label: 'IP Address Masked', icon: EyeOff },
  { key: 'metadataStripped', label: 'Metadata Stripped', icon: Lock },
  { key: 'noTrackers', label: 'No Trackers Enabled', icon: Eye },
  { key: 'secureUpload', label: 'Secure Upload Enabled', icon: Upload },
] as const;

export function AnonymityHealthIndicator({ 
  health = defaultHealth, 
  variant = 'compact' 
}: AnonymityHealthIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const allSecure = Object.values(health).every(Boolean);
  const secureCount = Object.values(health).filter(Boolean).length;

  if (variant === 'compact') {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-2 ${allSecure ? 'text-credible' : 'text-severity-high'}`}
          >
            {allSecure ? (
              <ShieldCheck className="h-4 w-4" />
            ) : (
              <Shield className="h-4 w-4" />
            )}
            <span className="text-xs font-medium">
              {allSecure ? 'Fully Protected' : `${secureCount}/4 Protected`}
            </span>
            {isOpen ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <div className="glass-card p-3 space-y-2">
            {healthItems.map(({ key, label, icon: Icon }) => (
              <div 
                key={key} 
                className={`flex items-center gap-2 text-xs ${
                  health[key] ? 'text-credible' : 'text-severity-high'
                }`}
              >
                {health[key] ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <X className="h-3 w-3" />
                )}
                <Icon className="h-3 w-3" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        {allSecure ? (
          <ShieldCheck className="h-5 w-5 text-credible" />
        ) : (
          <Shield className="h-5 w-5 text-severity-high" />
        )}
        <h3 className="font-medium text-sm">Anonymity Status</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {healthItems.map(({ key, label, icon: Icon }) => (
          <div 
            key={key} 
            className={`flex items-center gap-2 p-2 rounded-md text-xs ${
              health[key] 
                ? 'bg-credible/10 text-credible' 
                : 'bg-severity-high/10 text-severity-high'
            }`}
          >
            {health[key] ? (
              <Check className="h-3 w-3 flex-shrink-0" />
            ) : (
              <X className="h-3 w-3 flex-shrink-0" />
            )}
            <Icon className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{label}</span>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground">
        Your privacy is protected. No identifying information is stored or transmitted.
      </p>
    </div>
  );
}
