import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Shield, 
  User, 
  Bell, 
  Clock, 
  MapPin, 
  Tag, 
  Trash2, 
  Plus,
  FileText,
  ThumbsUp,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  anonymous_id: string;
  credibility_score: number;
  reports_count: number;
  credibility_level: string;
  inbox_enabled: boolean;
  self_destruct_days: number | null;
}

interface FollowedTopic {
  id: string;
  topic_type: string;
  topic_value: string;
  topic_label: string;
}

interface AlertPreferences {
  new_incidents: boolean;
  status_updates: boolean;
  weekly_digest: boolean;
}

interface ActivityItem {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
}

const CATEGORIES = [
  'Infrastructure', 'Public Safety', 'Environment', 'Governance', 
  'Healthcare', 'Education', 'Transportation', 'Utilities'
];

const LOCATIONS = [
  'Downtown', 'North District', 'South District', 'East Side', 
  'West Side', 'Industrial Zone', 'Residential Area'
];

export default function Profile() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [followedTopics, setFollowedTopics] = useState<FollowedTopic[]>([]);
  const [alertPrefs, setAlertPrefs] = useState<AlertPreferences>({
    new_incidents: true,
    status_updates: true,
    weekly_digest: false
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;
    
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch followed topics
      const { data: topicsData } = await supabase
        .from('followed_topics')
        .select('*')
        .eq('profile_id', profileData.id);
      setFollowedTopics(topicsData || []);

      // Fetch alert preferences
      const { data: alertData } = await supabase
        .from('alert_preferences')
        .select('*')
        .eq('profile_id', profileData.id)
        .single();
      if (alertData) {
        setAlertPrefs({
          new_incidents: alertData.new_incidents,
          status_updates: alertData.status_updates,
          weekly_digest: alertData.weekly_digest
        });
      }

      // Fetch activity history
      const { data: activityData } = await supabase
        .from('activity_history')
        .select('*')
        .eq('profile_id', profileData.id)
        .order('created_at', { ascending: false })
        .limit(20);
      setActivities(activityData || []);

    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return;
    
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
    } else {
      setProfile({ ...profile, ...updates });
      toast({ title: 'Saved', description: 'Profile updated successfully' });
    }
    setSaving(false);
  };

  const updateAlertPreferences = async (updates: Partial<AlertPreferences>) => {
    if (!profile) return;
    
    const newPrefs = { ...alertPrefs, ...updates };
    setAlertPrefs(newPrefs);

    const { error } = await supabase
      .from('alert_preferences')
      .upsert({ 
        profile_id: profile.id,
        ...newPrefs 
      }, { onConflict: 'profile_id' });

    if (error) {
      toast({ title: 'Error', description: 'Failed to update preferences', variant: 'destructive' });
    }
  };

  const addFollowedTopic = async (type: 'location' | 'category', value: string, label: string) => {
    if (!profile) return;
    
    const { data, error } = await supabase
      .from('followed_topics')
      .insert({
        profile_id: profile.id,
        topic_type: type,
        topic_value: value,
        topic_label: label
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        toast({ title: 'Already following', description: 'You already follow this topic', variant: 'destructive' });
      }
    } else if (data) {
      setFollowedTopics([...followedTopics, data]);
      toast({ title: 'Following', description: `Now following ${label}` });
    }
  };

  const removeFollowedTopic = async (topicId: string) => {
    const { error } = await supabase
      .from('followed_topics')
      .delete()
      .eq('id', topicId);

    if (!error) {
      setFollowedTopics(followedTopics.filter(t => t.id !== topicId));
      toast({ title: 'Unfollowed', description: 'Topic removed from following' });
    }
  };

  const getCredibilityBadge = () => {
    if (!profile) return null;
    const badges: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      none: { label: 'New User', variant: 'outline' },
      new: { label: 'New Reporter', variant: 'secondary' },
      trusted: { label: 'Trusted Reporter', variant: 'default' },
      veteran: { label: 'Veteran Reporter', variant: 'default' }
    };
    return badges[profile.credibility_level] || badges.new;
  };

  const getActivityIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      report_submitted: <FileText className="h-4 w-4 text-primary" />,
      vote_cast: <ThumbsUp className="h-4 w-4 text-green-500" />,
      topic_followed: <Tag className="h-4 w-4 text-blue-500" />,
      status_changed: <CheckCircle2 className="h-4 w-4 text-yellow-500" />,
      inbox_message: <MessageSquare className="h-4 w-4 text-purple-500" />
    };
    return icons[type] || <AlertTriangle className="h-4 w-4" />;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const badge = getCredibilityBadge();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-6 border-border/50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {profile.anonymous_id}
                    {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    <span>{profile.reports_count} reports submitted</span>
                    <span>•</span>
                    <span>Credibility: {profile.credibility_score}%</span>
                  </CardDescription>
                </div>
              </div>
              <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="topics">Following</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Anonymous Inbox</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow journalists and NGOs to send you messages
                    </p>
                  </div>
                  <Switch
                    checked={profile.inbox_enabled}
                    onCheckedChange={(checked) => updateProfile({ inbox_enabled: checked })}
                    disabled={saving}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Auto-Delete Posts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically delete your posts after a set period
                  </p>
                  <Select
                    value={profile.self_destruct_days?.toString() || 'never'}
                    onValueChange={(value) => 
                      updateProfile({ 
                        self_destruct_days: value === 'never' ? null : parseInt(value) 
                      })
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="7">After 7 days</SelectItem>
                      <SelectItem value="30">After 30 days</SelectItem>
                      <SelectItem value="90">After 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Topics Tab */}
          <TabsContent value="topics">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Followed Topics
                </CardTitle>
                <CardDescription>
                  Get notified about new incidents in these areas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Topics */}
                {followedTopics.length > 0 && (
                  <div className="space-y-2">
                    <Label>Currently Following</Label>
                    <div className="flex flex-wrap gap-2">
                      {followedTopics.map((topic) => (
                        <Badge 
                          key={topic.id} 
                          variant="secondary"
                          className="flex items-center gap-1 pr-1"
                        >
                          {topic.topic_type === 'location' ? (
                            <MapPin className="h-3 w-3" />
                          ) : (
                            <Tag className="h-3 w-3" />
                          )}
                          {topic.topic_label}
                          <button
                            onClick={() => removeFollowedTopic(topic.id)}
                            className="ml-1 p-0.5 hover:bg-destructive/20 rounded"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Add Location */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Follow Location
                  </Label>
                  <div className="flex gap-2 flex-wrap">
                    {LOCATIONS.filter(loc => 
                      !followedTopics.some(t => t.topic_type === 'location' && t.topic_value === loc)
                    ).map((location) => (
                      <Button
                        key={location}
                        variant="outline"
                        size="sm"
                        onClick={() => addFollowedTopic('location', location, location)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {location}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Add Category */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Follow Category
                  </Label>
                  <div className="flex gap-2 flex-wrap">
                    {CATEGORIES.filter(cat => 
                      !followedTopics.some(t => t.topic_type === 'category' && t.topic_value === cat)
                    ).map((category) => (
                      <Button
                        key={category}
                        variant="outline"
                        size="sm"
                        onClick={() => addFollowedTopic('category', category, category)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Alert Preferences
                </CardTitle>
                <CardDescription>
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>New Incidents</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when new incidents appear in followed topics
                    </p>
                  </div>
                  <Switch
                    checked={alertPrefs.new_incidents}
                    onCheckedChange={(checked) => 
                      updateAlertPreferences({ new_incidents: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Status Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when posts you engaged with change status
                    </p>
                  </div>
                  <Switch
                    checked={alertPrefs.status_updates}
                    onCheckedChange={(checked) => 
                      updateAlertPreferences({ status_updates: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a summary of activity in your followed topics
                    </p>
                  </div>
                  <Switch
                    checked={alertPrefs.weekly_digest}
                    onCheckedChange={(checked) => 
                      updateAlertPreferences({ weekly_digest: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Activity History
                </CardTitle>
                <CardDescription>
                  Your recent actions on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No activity yet</p>
                    <p className="text-sm">Your actions will appear here</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                          <div className="mt-0.5">
                            {getActivityIcon(activity.activity_type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{activity.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(activity.created_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
