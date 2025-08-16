-- Create users table with profile customization
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website_url TEXT,
  location TEXT,
  theme_color TEXT DEFAULT 'pink',
  privacy_level TEXT DEFAULT 'public' CHECK (privacy_level IN ('public', 'friends', 'private')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum categories
CREATE TABLE IF NOT EXISTS forum_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT 'green',
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_custom BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum topics/threads
CREATE TABLE IF NOT EXISTS forum_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES forum_categories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  last_reply_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum replies
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  reply_to_id UUID REFERENCES forum_replies(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user blogs
CREATE TABLE IF NOT EXISTS user_blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL, -- Block editor content
  slug TEXT NOT NULL,
  is_published BOOLEAN DEFAULT false,
  privacy_level TEXT DEFAULT 'public' CHECK (privacy_level IN ('public', 'friends', 'private')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, slug)
);

-- Create user files
CREATE TABLE IF NOT EXISTS user_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_url TEXT NOT NULL,
  privacy_level TEXT DEFAULT 'private' CHECK (privacy_level IN ('public', 'friends', 'private')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user follows/friends
CREATE TABLE IF NOT EXISTS user_follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Create likes system
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('topic', 'reply', 'blog')),
  target_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- Insert default forum categories
INSERT INTO forum_categories (name, description, color, icon, sort_order, is_custom) VALUES
('General Discussion', 'General topics and conversations', 'green', '💬', 1, false),
('Announcements', 'Important announcements and updates', 'pink', '📢', 2, false),
('Help & Support', 'Get help and support from the community', 'blue', '🆘', 3, false),
('Feedback', 'Share your feedback and suggestions', 'purple', '💭', 4, false),
('Off Topic', 'Casual conversations and off-topic discussions', 'orange', '🎭', 5, false),
('Custom Topic 1', 'Custom discussion area 1', 'pink', '🎨', 6, true),
('Custom Topic 2', 'Custom discussion area 2', 'green', '🌟', 7, true),
('Custom Topic 3', 'Custom discussion area 3', 'pink', '🚀', 8, true),
('Custom Topic 4', 'Custom discussion area 4', 'green', '💡', 9, true),
('Custom Topic 5', 'Custom discussion area 5', 'pink', '🔥', 10, true),
('Custom Topic 6', 'Custom discussion area 6', 'green', '⭐', 11, true),
('Custom Topic 7', 'Custom discussion area 7', 'pink', '🎯', 12, true),
('Custom Topic 8', 'Custom discussion area 8', 'green', '🌈', 13, true),
('Custom Topic 9', 'Custom discussion area 9', 'pink', '🎪', 14, true),
('Custom Topic 10', 'Custom discussion area 10', 'green', '🎊', 15, true),
('Custom Topic 11', 'Custom discussion area 11', 'pink', '🎁', 16, true),
('Custom Topic 12', 'Custom discussion area 12', 'green', '🌸', 17, true),
('Custom Topic 13', 'Custom discussion area 13', 'pink', '🦋', 18, true),
('Custom Topic 14', 'Custom discussion area 14', 'green', '🌺', 19, true),
('Custom Topic 15', 'Custom discussion area 15', 'pink', '🎵', 20, true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_forum_topics_category_id ON forum_topics(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_user_id ON forum_topics(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_last_reply_at ON forum_topics(last_reply_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_replies_topic_id ON forum_replies(topic_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_user_id ON forum_replies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_blogs_user_id ON user_blogs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_files_user_id ON user_files(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_target ON likes(target_type, target_id);
