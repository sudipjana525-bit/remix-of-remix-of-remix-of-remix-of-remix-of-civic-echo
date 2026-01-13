-- Create profiles table for anonymous users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  anonymous_id TEXT NOT NULL UNIQUE DEFAULT 'CVC-' || UPPER(SUBSTRING(gen_random_uuid()::text, 1, 8)),
  credibility_score INTEGER NOT NULL DEFAULT 0,
  reports_count INTEGER NOT NULL DEFAULT 0,
  credibility_level TEXT NOT NULL DEFAULT 'new' CHECK (credibility_level IN ('none', 'new', 'trusted', 'veteran')),
  inbox_enabled BOOLEAN NOT NULL DEFAULT false,
  self_destruct_days INTEGER CHECK (self_destruct_days IN (7, 30, 90) OR self_destruct_days IS NULL),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create followed topics table
CREATE TABLE public.followed_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic_type TEXT NOT NULL CHECK (topic_type IN ('location', 'category')),
  topic_value TEXT NOT NULL,
  topic_label TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (profile_id, topic_type, topic_value)
);

-- Create alert preferences table
CREATE TABLE public.alert_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  new_incidents BOOLEAN NOT NULL DEFAULT true,
  status_updates BOOLEAN NOT NULL DEFAULT true,
  weekly_digest BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activity history table
CREATE TABLE public.activity_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('report_submitted', 'vote_cast', 'topic_followed', 'status_changed', 'inbox_message')),
  description TEXT NOT NULL,
  related_post_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followed_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies (users can only see/edit their own profile)
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Followed topics policies
CREATE POLICY "Users can view their followed topics"
ON public.followed_topics FOR SELECT
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their followed topics"
ON public.followed_topics FOR ALL
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Alert preferences policies
CREATE POLICY "Users can view their alert preferences"
ON public.alert_preferences FOR SELECT
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their alert preferences"
ON public.alert_preferences FOR ALL
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Activity history policies
CREATE POLICY "Users can view their activity history"
ON public.activity_history FOR SELECT
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their activity"
ON public.activity_history FOR INSERT
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alert_preferences_updated_at
BEFORE UPDATE ON public.alert_preferences
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();