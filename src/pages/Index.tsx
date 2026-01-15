import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { FilterButton } from '@/components/FilterButton';
import { EnhancedPostCard } from '@/components/EnhancedPostCard';
import { GuidedReportDialog } from '@/components/GuidedReportDialog';
import { Footer } from '@/components/Footer';
import { LegalDisclaimer } from '@/components/LegalDisclaimer';
import { TopicFollowing } from '@/components/TopicFollowing';
import { generateMockPosts } from '@/lib/anonymity';
import type { Post, Category, Severity } from '@/lib/anonymity';
import type { FollowedTopic } from '@/lib/types';
import { TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SortOption = 'recent' | 'trending';

export default function Index() {
  const [posts, setPosts] = useState<Post[]>(generateMockPosts());
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [followedTopics, setFollowedTopics] = useState<FollowedTopic[]>([]);

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (selectedCategory) {
      result = result.filter(post => post.category === selectedCategory);
    }

    if (selectedSeverity) {
      result = result.filter(post => post.severity === selectedSeverity);
    }

    if (sortBy === 'recent') {
      result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else {
      result.sort((a, b) => 
        (b.credibleVotes + b.commentCount) - (a.credibleVotes + a.commentCount)
      );
    }

    return result;
  }, [posts, selectedCategory, selectedSeverity, sortBy]);

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleFollow = (topic: FollowedTopic) => {
    setFollowedTopics(prev => [...prev, topic]);
  };

  const handleUnfollow = (topic: FollowedTopic) => {
    setFollowedTopics(prev => prev.filter(t => !(t.type === topic.type && t.value === topic.value)));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <LegalDisclaimer variant="banner" />

      <main className="flex-1 container py-8">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={sortBy === 'recent' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('recent')}
              className="gap-2"
            >
              <Clock className="h-4 w-4" />
              Recent
            </Button>
            <Button
              variant={sortBy === 'trending' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('trending')}
              className="gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Trending
            </Button>
            <FilterButton
              selectedCategory={selectedCategory}
              selectedSeverity={selectedSeverity}
              onCategoryChange={setSelectedCategory}
              onSeverityChange={setSelectedSeverity}
            />
            <TopicFollowing
              followedTopics={followedTopics}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
            />
          </div>

          <GuidedReportDialog onPostCreated={handlePostCreated} />
        </div>

        {/* Posts */}
        <div className="max-w-2xl mx-auto space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <EnhancedPostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-12 glass-card">
              <p className="text-muted-foreground">
                No reports match your filters. Try adjusting your criteria.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
