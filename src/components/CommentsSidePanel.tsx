import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommentsSection } from './CommentsSection';
import type { Post } from '@/lib/anonymity';

interface CommentsSidePanelProps {
  post: Post | null;
  onClose: () => void;
}

export function CommentsSidePanel({ post, onClose }: CommentsSidePanelProps) {
  if (!post) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-[400px] bg-background border-l border-border shadow-xl z-40 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground">Comments</h3>
          <p className="text-xs text-muted-foreground truncate max-w-[300px]">
            {post.content.substring(0, 50)}...
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Comments content */}
      <div className="flex-1 overflow-y-auto p-4">
        <CommentsSection postId={post.id} initialCount={post.commentCount} isFullPage />
      </div>
    </div>
  );
}
