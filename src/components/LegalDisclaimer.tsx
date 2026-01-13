import { AlertTriangle, Info, Scale } from 'lucide-react';

interface LegalDisclaimerProps {
  variant?: 'inline' | 'banner' | 'compact';
}

export function LegalDisclaimer({ variant = 'inline' }: LegalDisclaimerProps) {
  if (variant === 'compact') {
    return (
      <p className="text-xs text-muted-foreground italic flex items-center gap-1">
        <Scale className="h-3 w-3 flex-shrink-0" />
        This is a public allegation, not a verified fact or legal judgment.
      </p>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="bg-primary/5 border-y border-primary/20 py-2 px-4">
        <div className="container flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <AlertTriangle className="h-3 w-3 text-primary flex-shrink-0" />
          <span>
            <strong className="text-foreground">Disclaimer:</strong> All posts are unverified allegations for public awareness. 
            The platform does not endorse, verify, or take responsibility for the accuracy of user-submitted content.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
      <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Legal Notice:</strong> This post contains unverified allegations 
          submitted anonymously for public awareness. The platform does not verify claims and is not responsible 
          for content accuracy.
        </p>
        <p className="text-xs text-muted-foreground italic">
          Posts are public allegations, not legal judgments or verified facts.
        </p>
      </div>
    </div>
  );
}
