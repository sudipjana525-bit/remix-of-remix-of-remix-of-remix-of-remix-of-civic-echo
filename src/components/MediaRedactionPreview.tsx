import { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  User, 
  Car, 
  FileText,
  Check,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface RedactionArea {
  id: string;
  type: 'face' | 'vehicle' | 'document';
  label: string;
  enabled: boolean;
}

interface MediaRedactionPreviewProps {
  imageUrl: string;
  onConfirm: (redactions: RedactionArea[]) => void;
  onCancel: () => void;
}

export function MediaRedactionPreview({ imageUrl, onConfirm, onCancel }: MediaRedactionPreviewProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [showOriginal, setShowOriginal] = useState(false);
  const [redactions, setRedactions] = useState<RedactionArea[]>([
    { id: '1', type: 'face', label: '2 faces detected', enabled: true },
    { id: '2', type: 'vehicle', label: '1 license plate detected', enabled: true },
    { id: '3', type: 'document', label: '1 document detected', enabled: true },
  ]);

  const redactionIcons = {
    face: User,
    vehicle: Car,
    document: FileText,
  };

  const toggleRedaction = (id: string) => {
    setRedactions(prev =>
      prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)
    );
  };

  const handleProcess = () => {
    setIsProcessing(true);
    setProcessProgress(0);
    
    const interval = setInterval(() => {
      setProcessProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          onConfirm(redactions);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const enabledRedactions = redactions.filter(r => r.enabled);

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EyeOff className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Auto-Redaction Preview</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-credible/20 text-credible">
            Privacy Protection
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Sensitive information will be automatically blurred before publishing
        </p>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Image preview */}
        <div className="relative rounded-lg overflow-hidden bg-muted/20">
          <img 
            src={imageUrl} 
            alt="Preview" 
            className={`w-full h-48 object-cover transition-all ${
              !showOriginal ? 'blur-sm' : ''
            }`}
          />
          
          {/* Redaction overlays simulation */}
          {!showOriginal && enabledRedactions.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-card/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                <EyeOff className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  {enabledRedactions.length} area{enabledRedactions.length !== 1 ? 's' : ''} redacted
                </span>
              </div>
            </div>
          )}

          {/* Toggle original view */}
          <div className="absolute bottom-2 right-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowOriginal(!showOriginal)}
              className="gap-1 text-xs"
            >
              {showOriginal ? (
                <>
                  <EyeOff className="h-3 w-3" />
                  Show Redacted
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3" />
                  Show Original
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Detected items */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Detected Sensitive Content</h4>
          
          {redactions.map((redaction) => {
            const Icon = redactionIcons[redaction.type];
            return (
              <div 
                key={redaction.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    redaction.enabled ? 'bg-credible/10' : 'bg-muted'
                  }`}>
                    <Icon className={`h-4 w-4 ${redaction.enabled ? 'text-credible' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{redaction.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {redaction.enabled ? 'Will be blurred' : 'Will remain visible'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={redaction.enabled}
                  onCheckedChange={() => toggleRedaction(redaction.id)}
                />
              </div>
            );
          })}
        </div>

        {/* Warning if any redaction is disabled */}
        {enabledRedactions.length < redactions.length && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-severity-medium/10 border border-severity-medium/30">
            <AlertTriangle className="h-4 w-4 text-severity-medium flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Some sensitive content will remain visible. This may compromise your anonymity 
              or the privacy of individuals in the image.
            </p>
          </div>
        )}

        {/* Processing progress */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm">Processing redactions...</span>
            </div>
            <Progress value={processProgress} className="h-1" />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onCancel} className="flex-1" disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleProcess} className="flex-1 gap-2" disabled={isProcessing}>
            <Check className="h-4 w-4" />
            Confirm & Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
