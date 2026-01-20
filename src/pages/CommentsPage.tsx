import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, ThumbsUp, ThumbsDown, Share2, Flag, Camera, Video, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CommentsSection } from '@/components/CommentsSection';
import { CategoryBadge } from '@/components/CategoryBadge';
import { SeverityBadge } from '@/components/SeverityBadge';
import { IncidentStatusBadge } from '@/components/IncidentStatusBadge';
import { EvidenceConfidenceScore } from '@/components/EvidenceConfidenceScore';
import { CredibilityBadge } from '@/components/CredibilityBadge';
import { LegalDisclaimer } from '@/components/LegalDisclaimer';
import type { EvidenceType } from '@/lib/anonymity';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';

const evidenceIconMap: Record<EvidenceType, React.ElementType> = {
  photo: Camera,
  video: Video,
  document: FileText,
  witness: Users,
};

// Mock post data - in production this would come from database
const mockPosts: Record<string, any> = {
  '1': {
    id: '1',
    anonymousId: 'CVC-7X9K2M',
    category: 'corruption',
    severity: 'high',
    content: 'Witnessed cash exchange between municipal inspector and construction company representative. Inspector then approved permit that had been previously denied. Evidence includes timestamped photos.',
    location: 'Downtown District',
    createdAt: new Date(Date.now() - 3600000),
    credibleVotes: 47,
    suspiciousVotes: 3,
    commentCount: 12,
    evidenceType: 'photo' as EvidenceType,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600',
    status: 'investigating',
    confidenceScore: 'high',
    credibilityBadge: { level: 'trusted', reportsCount: 12, credibilityScore: 92 },
  },
  '2': {
    id: '2',
    anonymousId: 'CVC-3P8L1N',
    category: 'infrastructure',
    severity: 'medium',
    content: 'Road repair funds allocated 6 months ago but work never started. Official documents show payment processed to contractor. Multiple potholes causing accidents.',
    location: 'North Highway',
    createdAt: new Date(Date.now() - 86400000),
    credibleVotes: 89,
    suspiciousVotes: 7,
    commentCount: 23,
    evidenceType: 'document' as EvidenceType,
    status: 'verified',
    confidenceScore: 'medium',
    credibilityBadge: { level: 'established', reportsCount: 5, credibilityScore: 78 },
  },
  '3': {
    id: '3',
    anonymousId: 'CVC-9D4F2K',
    category: 'environment',
    severity: 'critical',
    content: 'Factory discharging waste into river after midnight. Captured video evidence of discharge pipes and discolored water. Fish deaths reported downstream.',
    location: 'Industrial Zone B',
    createdAt: new Date(Date.now() - 172800000),
    credibleVotes: 156,
    suspiciousVotes: 12,
    commentCount: 45,
    evidenceType: 'video' as EvidenceType,
    imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600',
    status: 'verified',
    confidenceScore: 'high',
    credibilityBadge: { level: 'trusted', reportsCount: 8, credibilityScore: 88 },
  },
};

export default function CommentsPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [credibleVotes, setCredibleVotes] = useState(0);
  const [suspiciousVotes, setSuspiciousVotes] = useState(0);
  const [userVote, setUserVote] = useState<'credible' | 'suspicious' | null>(null);

  const post = postId ? mockPosts[postId] : null;

  useEffect(() => {
    if (post) {
      setCredibleVotes(post.credibleVotes);
      setSuspiciousVotes(post.suspiciousVotes);
    }
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Post not found</p>
          <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go back
          </Button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Comments</h1>
        </div>
      </header>

      {/* Post content */}
      <div className="p-4">
        <Card className="glass-card overflow-hidden mb-4">
          <CardContent className="p-0">
            {post.imageUrl && (
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt="Evidence" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute top-2 right-2 bg-card/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground">
                  Faces auto-blurred
                </div>
              </div>
            )}
            
            <div className="p-4">
              {/* Status badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <IncidentStatusBadge status={post.status || 'submitted'} size="sm" />
                <EvidenceConfidenceScore level={post.confidenceScore || 'medium'} size="sm" />
              </div>

              {/* Category and severity */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <CategoryBadge category={post.category} size="sm" />
                <SeverityBadge severity={post.severity} size="sm" />
                {EvidenceIcon && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <EvidenceIcon className="h-3 w-3" />
                    Evidence
                  </span>
                )}
              </div>

              {/* Anonymous ID and metadata */}
              <div className="flex items-center flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                <span className="anonymous-id font-medium">{post.anonymousId}</span>
                {post.credibilityBadge && (
                  <CredibilityBadge badge={post.credibilityBadge} />
                )}
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

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote('credible')}
                    className={`px-2 ${userVote === 'credible' ? 'credibility-positive' : 'text-muted-foreground hover:text-credible'}`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-xs ml-1">{credibleVotes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote('suspicious')}
                    className={`px-2 ${userVote === 'suspicious' ? 'credibility-negative' : 'text-muted-foreground hover:text-suspicious'}`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span className="text-xs ml-1">{suspiciousVotes}</span>
                  </Button>
                </div>

                <div className="flex items-center">
                  <Button variant="ghost" size="sm" className="px-2 text-muted-foreground hover:text-foreground">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="px-2 text-muted-foreground hover:text-destructive">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments section - full height on mobile */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold mb-4">Comments ({post.commentCount})</h2>
            <CommentsSection postId={post.id} initialCount={post.commentCount} isFullPage />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
