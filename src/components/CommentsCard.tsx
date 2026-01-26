import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CommentsSection } from './CommentsSection';

interface CommentsCardProps {
  postId: string;
  commentCount: number;
  onClose: () => void;
}

export function CommentsCard({ postId, commentCount, onClose }: CommentsCardProps) {
  return (
    <Card className="glass-card overflow-hidden animate-fade-in h-full">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 shrink-0">
          <h3 className="font-semibold text-foreground text-sm">
            Comments ({commentCount})
          </h3>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Comments content - fills remaining space, scrolls if needed */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          <CommentsSection postId={postId} initialCount={commentCount} isFullPage />
        </div>
      </CardContent>
    </Card>
  );
}
