import { useState, useEffect } from 'react';
import { Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface Comment {
  id: string;
  post_id: string;
  anonymous_id: string;
  content: string;
  created_at: string;
}

interface CommentsSectionProps {
  postId: string;
  initialCount: number;
  isFullPage?: boolean;
}

export function CommentsSection({ postId, initialCount, isFullPage = false }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setComments(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    if (newComment.length > 500) {
      toast.error('Comment must be less than 500 characters');
      return;
    }

    setIsSubmitting(true);
    
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        content: newComment.trim()
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting comment:', error);
      toast.error('Failed to post comment');
    } else {
      setComments(prev => [data, ...prev]);
      setNewComment('');
      toast.success('Comment posted anonymously');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4">
      {/* Comment input */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          placeholder="Write an anonymous comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px] resize-none bg-muted/30 border-border/50"
          maxLength={500}
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {newComment.length}/500
          </span>
          <Button 
            type="submit" 
            size="sm" 
            disabled={isSubmitting || !newComment.trim()}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Post Anonymously
          </Button>
        </div>
      </form>

      {/* Comments list */}
      <div className={`${isFullPage ? 'max-h-none' : 'max-h-[200px]'} overflow-y-auto scrollbar-hide space-y-3`}>
        {isLoading ? (
          <div className="text-center text-muted-foreground text-sm py-4">
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-4">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <div 
              key={comment.id}
              className="p-3 rounded-lg bg-muted/30 border border-border/30"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="anonymous-id text-xs font-medium">
                  {comment.anonymous_id}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-foreground/90">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
