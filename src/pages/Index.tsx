import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { FilterSidebar } from '@/components/FilterSidebar';
import { PostCard } from '@/components/PostCard';
import { CreatePostDialog } from '@/components/CreatePostDialog';
import { Footer } from '@/components/Footer';
import { generateMockPosts } from '@/lib/anonymity';
import type { Post, Category, Severity } from '@/lib/anonymity';
import { TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SortOption = 'recent' | 'trending';

export default function Index() {
  const [posts, setPosts] = useState<Post[]>(generateMockPosts());
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Filter by category
    if (selectedCategory) {
      result = result.filter(post => post.category === selectedCategory);
    }

    // Filter by severity
    if (selectedSeverity) {
      result = result.filter(post => post.severity === selectedSeverity);
    }

    // Sort
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <HeroSection />

      <main className="flex-1 container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <FilterSidebar
            selectedCategory={selectedCategory}
            selectedSeverity={selectedSeverity}
            onCategoryChange={setSelectedCategory}
            onSeverityChange={setSelectedSeverity}
          />

          {/* Main content */}
          <div className="flex-1">
            {/* Header with actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
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
              </div>

              <CreatePostDialog onPostCreated={handlePostCreated} />
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="text-center py-12 glass-card">
                  <p className="text-muted-foreground">
                    No reports match your filters. Try adjusting your criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
