import { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Share2, 
  Flag,
  FileText,
  Camera,
  Video,
  Users,
  Link2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from './CategoryBadge';
import { SeverityBadge } from './SeverityBadge';
import { EvidenceConfidenceScore } from './EvidenceConfidenceScore';
import { IncidentStatusBadge } from './IncidentStatusBadge';
import { VisibilityTags } from './VisibilityTags';
import { CredibilityBadge } from './CredibilityBadge';
import { LegalDisclaimer } from './LegalDisclaimer';
import { RelatedIncidents } from './RelatedIncidents';
import type { Post, EvidenceType } from '@/lib/anonymity';
import type { IncidentStatus, ConfidenceLevel, VisibilityTag, CredibilityBadgeInfo, RelatedIncident } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

const evidenceIconMap: Record<EvidenceType, React.ElementType> = {
  photo: Camera,
  video: Video,
  document: FileText,
  witness: Users,
};

// Extended post type for display
interface ExtendedPostData extends Post {
  status?: IncidentStatus;
  confidenceScore?: ConfidenceLevel;
  visibilityTags?: VisibilityTag[];
  credibilityBadge?: CredibilityBadgeInfo;
  relatedIncidentCount?: number;
  relatedIncidents?: RelatedIncident[];
}

interface EnhancedPostCardProps {
  post: ExtendedPostData;
}

export function EnhancedPostCard({ post }: EnhancedPostCardProps) {
  const [credibleVotes, setCredibleVotes] = useState(post.credibleVotes);
  const [suspiciousVotes, setSuspiciousVotes] = useState(post.suspiciousVotes);
  const [userVote, setUserVote] = useState<'credible' | 'suspicious' | null>(null);
  const [showRelated, setShowRelated] = useState(false);

  const handleVote = (type: 'credible' | 'suspicious') => {
    if (userVote === type) {
      if (type === 'credible') {
        setCredibleVotes(prev => prev - 1);
      } else {
        setSuspiciousVotes(prev => prev - 1);
      }
      setUserVote(null);
    } else {
      if (userVote === 'credible') {
        setCredibleVotes(prev => prev - 1);
      } else if (userVote === 'suspicious') {
        setSuspiciousVotes(prev => prev - 1);
      }
      
      if (type === 'credible') {
        setCredibleVotes(prev => prev + 1);
      } else {
        setSuspiciousVotes(prev => prev + 1);
      }
      setUserVote(type);
    }
  };

  const EvidenceIcon = post.evidenceType ? evidenceIconMap[post.evidenceType] : null;

  // Default values for demo
  const status = post.status || 'submitted';
  const confidenceScore = post.confidenceScore || 'medium';
  const visibilityTags = post.visibilityTags || [];
  const credibilityBadge = post.credibilityBadge || { level: 'new', reportsCount: 1, credibilityScore: 75 };
  const relatedIncidentCount = post.relatedIncidentCount || Math.floor(Math.random() * 5);

  return (
    <Card className="glass-card overflow-hidden animate-fade-in hover:border-border transition-colors">
      <CardContent className="p-0">
        {post.imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt="Evidence" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            {/* Auto-redaction notice */}
            <div className="absolute top-2 right-2 bg-card/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground">
              Faces auto-blurred
            </div>
          </div>
        )}
        
        <div className="p-5">
          {/* Status and visibility tags */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <IncidentStatusBadge status={status} size="sm" />
            <EvidenceConfidenceScore level={confidenceScore} size="sm" />
            {visibilityTags.length > 0 && <VisibilityTags tags={visibilityTags} />}
          </div>

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={post.category} size="sm" />
              <SeverityBadge severity={post.severity} size="sm" />
              {EvidenceIcon && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <EvidenceIcon className="h-3 w-3" />
                  Evidence
                </span>
              )}
            </div>
          </div>

          {/* Anonymous ID, credibility badge, and metadata */}
          <div className="flex items-center flex-wrap gap-3 text-xs text-muted-foreground mb-3">
            <span className="anonymous-id font-medium">{post.anonymousId}</span>
            <CredibilityBadge badge={credibilityBadge} />
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(post.createdAt, { addSuffix: true })}
            </span>
            {post.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {post.location}
              </span>
            )}
          </div>

          {/* Content */}
          <p className="text-foreground/90 text-sm leading-relaxed mb-3">
            {post.content}
          </p>

          {/* Legal disclaimer */}
          <div className="mb-3">
            <LegalDisclaimer variant="compact" />
          </div>

          {/* Related incidents */}
          {relatedIncidentCount > 0 && (
            <div className="mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRelated(!showRelated)}
                className="w-full justify-between text-primary hover:text-primary/90 hover:bg-primary/5"
              >
                <span className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  {relatedIncidentCount} related independent {relatedIncidentCount === 1 ? 'report' : 'reports'}
                </span>
                {showRelated ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              {showRelated && (
                <div className="mt-2">
                  <RelatedIncidents 
                    count={relatedIncidentCount}
                    incidents={post.relatedIncidents || [
                      { id: '1', anonymousId: 'Anon_R3T5K2', location: post.location, category: post.category, createdAt: new Date(Date.now() - 3600000) },
                      { id: '2', anonymousId: 'Anon_M7N2P4', location: post.location, category: post.category, createdAt: new Date(Date.now() - 7200000) },
                    ]}
                  />
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('credible')}
                className={`px-2 sm:px-3 ${userVote === 'credible' ? 'credibility-positive' : 'text-muted-foreground hover:text-credible'}`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span className="text-xs ml-1 hidden sm:inline">Credible ({credibleVotes})</span>
                <span className="text-xs ml-1 sm:hidden">{credibleVotes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('suspicious')}
                className={`px-2 sm:px-3 ${userVote === 'suspicious' ? 'credibility-negative' : 'text-muted-foreground hover:text-suspicious'}`}
              >
                <ThumbsDown className="h-4 w-4" />
                <span className="text-xs ml-1 hidden sm:inline">Suspicious ({suspiciousVotes})</span>
                <span className="text-xs ml-1 sm:hidden">{suspiciousVotes}</span>
              </Button>
            </div>

            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="px-2 sm:px-3 text-muted-foreground hover:text-foreground">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs ml-1">{post.commentCount}</span>
              </Button>
              <Button variant="ghost" size="sm" className="px-2 sm:px-3 text-muted-foreground hover:text-foreground">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="px-2 sm:px-3 text-muted-foreground hover:text-destructive">
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
