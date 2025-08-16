-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  location VARCHAR(100),
  website VARCHAR(255),
  theme_color VARCHAR(7) DEFAULT '#ff77b6',
  privacy_level VARCHAR(20) DEFAULT 'public' CHECK (privacy_level IN ('public', 'friends', 'private')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum categories table
CREATE TABLE IF NOT EXISTS forum_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  color VARCHAR(7) DEFAULT '#ff77b6',
  icon VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  is_custom BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum topics table
CREATE TABLE IF NOT EXISTS forum_topics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES forum_categories(id) ON DELETE CASCADE,
  slug VARCHAR(255) UNIQUE NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  reply_count INTEGER DEFAULT 0,
  last_reply_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum replies table
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content JSONB NOT NULL, -- Store block editor content
  excerpt TEXT,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  slug VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  privacy_level VARCHAR(20) DEFAULT 'public' CHECK (privacy_level IN ('public', 'friends', 'private')),
  featured_image TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(author_id, slug)
);

-- Create user files table
CREATE TABLE IF NOT EXISTS user_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  file_url TEXT NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  privacy_level VARCHAR(20) DEFAULT 'private' CHECK (privacy_level IN ('public', 'friends', 'private')),
  folder VARCHAR(255) DEFAULT 'root',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user follows table
CREATE TABLE IF NOT EXISTS user_follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Create likes table (for topics, replies, blog posts)
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('topic', 'reply', 'blog_post')),
  target_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- Create user settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  profile_visibility VARCHAR(20) DEFAULT 'public' CHECK (profile_visibility IN ('public', 'friends', 'private')),
  show_activity BOOLEAN DEFAULT true,
  show_followers BOOLEAN DEFAULT true,
  allow_messages BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default forum categories
INSERT INTO forum_categories (name, description, slug, color, icon, sort_order, is_custom) VALUES
('General Discussion', 'General topics and conversations', 'general', '#ff77b6', 'MessageCircle', 1, false),
('Announcements', 'Important announcements and updates', 'announcements', '#a7ffeb', 'Megaphone', 2, false),
('Help & Support', 'Get help and support from the community', 'help-support', '#ff77b6', 'HelpCircle', 3, false),
('Feedback', 'Share your feedback and suggestions', 'feedback', '#a7ffeb', 'MessageSquare', 4, false),
('Off Topic', 'Casual conversations and off-topic discussions', 'off-topic', '#ff77b6', 'Coffee', 5, false);

-- Insert custom categories (10-15 more as requested)
INSERT INTO forum_categories (name, description, slug, color, icon, sort_order, is_custom) VALUES
('Custom Topic 1', 'Custom discussion area with placeholder content', 'custom-1', '#ff77b6', 'Star', 6, true),
('Custom Topic 2', 'Another custom category for specialized discussions', 'custom-2', '#a7ffeb', 'Zap', 7, true),
('Custom Topic 3', 'Placeholder category for future content', 'custom-3', '#ff77b6', 'Heart', 8, true),
('Custom Topic 4', 'Custom area for community projects', 'custom-4', '#a7ffeb', 'Folder', 9, true),
('Custom Topic 5', 'Specialized discussion forum', 'custom-5', '#ff77b6', 'Target', 10, true),
('Custom Topic 6', 'Community showcase and highlights', 'custom-6', '#a7ffeb', 'Award', 11, true),
('Custom Topic 7', 'Technical discussions and tutorials', 'custom-7', '#ff77b6', 'Code', 12, true),
('Custom Topic 8', 'Creative projects and inspiration', 'custom-8', '#a7ffeb', 'Palette', 13, true),
('Custom Topic 9', 'Events and meetups coordination', 'custom-9', '#ff77b6', 'Calendar', 14, true),
('Custom Topic 10', 'Resource sharing and recommendations', 'custom-10', '#a7ffeb', 'BookOpen', 15, true),
('Custom Topic 11', 'Gaming and entertainment discussions', 'custom-11', '#ff77b6', 'Gamepad2', 16, true),
('Custom Topic 12', 'Photography and visual arts', 'custom-12', '#a7ffeb', 'Camera', 17, true),
('Custom Topic 13', 'Music and audio discussions', 'custom-13', '#ff77b6', 'Music', 18, true),
('Custom Topic 14', 'Travel and lifestyle sharing', 'custom-14', '#a7ffeb', 'MapPin', 19, true),
('Custom Topic 15', 'Science and technology news', 'custom-15', '#ff77b6', 'Atom', 20, true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_forum_topics_category_id ON forum_topics(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_author_id ON forum_topics(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_topic_id ON forum_replies(topic_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_author_id ON forum_replies(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_user_files_owner_id ON user_files(owner_id);
CREATE INDEX IF NOT EXISTS idx_likes_target ON likes(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view public profiles" ON users FOR SELECT USING (privacy_level = 'public' OR auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Forum topics policies
CREATE POLICY "Anyone can view published topics" ON forum_topics FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create topics" ON forum_topics FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own topics" ON forum_topics FOR UPDATE USING (auth.uid() = author_id);

-- Forum replies policies
CREATE POLICY "Anyone can view replies" ON forum_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON forum_replies FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own replies" ON forum_replies FOR UPDATE USING (auth.uid() = author_id);

-- Blog posts policies
CREATE POLICY "Anyone can view public blog posts" ON blog_posts FOR SELECT USING (privacy_level = 'public' OR auth.uid() = author_id);
CREATE POLICY "Authors can manage own blog posts" ON blog_posts FOR ALL USING (auth.uid() = author_id);

-- User files policies
CREATE POLICY "Users can view own files" ON user_files FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can view public files" ON user_files FOR SELECT USING (privacy_level = 'public');
CREATE POLICY "Users can manage own files" ON user_files FOR ALL USING (auth.uid() = owner_id);

-- User follows policies
CREATE POLICY "Users can view follows" ON user_follows FOR SELECT USING (true);
CREATE POLICY "Users can manage own follows" ON user_follows FOR ALL USING (auth.uid() = follower_id);

-- Likes policies
CREATE POLICY "Users can view likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can manage own likes" ON likes FOR ALL USING (auth.uid() = user_id);

-- User settings policies
CREATE POLICY "Users can manage own settings" ON user_settings FOR ALL USING (auth.uid() = user_id);

-- Add function and trigger to automatically create user profiles
-- Function to create user profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
