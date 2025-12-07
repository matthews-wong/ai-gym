# Supabase SQL Queries and Schemas

This file contains all SQL queries, schema definitions, migrations, and policies for the AIGymBro application. Copy and paste these into your Supabase SQL Editor.

---

## Table Creation

### 1. Profiles Table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

### 2. Workouts Table

```sql
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own workouts
CREATE POLICY "Users can view own workouts"
  ON workouts FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own workouts
CREATE POLICY "Users can insert own workouts"
  ON workouts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own workouts
CREATE POLICY "Users can update own workouts"
  ON workouts FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own workouts
CREATE POLICY "Users can delete own workouts"
  ON workouts FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX workouts_user_id_idx ON workouts(user_id);
```

---

### 3. Meals Table

```sql
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  calories INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own meals
CREATE POLICY "Users can view own meals"
  ON meals FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own meals
CREATE POLICY "Users can insert own meals"
  ON meals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own meals
CREATE POLICY "Users can update own meals"
  ON meals FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own meals
CREATE POLICY "Users can delete own meals"
  ON meals FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX meals_user_id_idx ON meals(user_id);
```

---

### 4. Progress Logs Table

```sql
CREATE TABLE progress_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE progress_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own progress logs
CREATE POLICY "Users can view own progress_logs"
  ON progress_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own progress logs
CREATE POLICY "Users can insert own progress_logs"
  ON progress_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own progress logs
CREATE POLICY "Users can update own progress_logs"
  ON progress_logs FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own progress logs
CREATE POLICY "Users can delete own progress_logs"
  ON progress_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX progress_logs_user_id_idx ON progress_logs(user_id);
CREATE INDEX progress_logs_date_idx ON progress_logs(date);
```

---

## Example Queries

### Get all workouts for current user
```sql
SELECT * FROM workouts
WHERE user_id = auth.uid()
ORDER BY created_at DESC;
```

### Get total calories for today
```sql
SELECT COALESCE(SUM(calories), 0) as total_calories
FROM meals
WHERE user_id = auth.uid()
AND DATE(created_at) = CURRENT_DATE;
```

### Get weight trend (last 30 days)
```sql
SELECT date, weight
FROM progress_logs
WHERE user_id = auth.uid()
AND date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY date ASC;
```

### Get average weight for the month
```sql
SELECT AVG(weight) as avg_weight
FROM progress_logs
WHERE user_id = auth.uid()
AND date >= DATE_TRUNC('month', CURRENT_DATE);
```

---

## Seed Data (Optional)

```sql
-- Note: Replace 'YOUR_USER_ID' with an actual user UUID after signup

-- Sample workouts
INSERT INTO workouts (user_id, name, description) VALUES
('YOUR_USER_ID', 'Upper Body Day', 'Chest, shoulders, and triceps workout'),
('YOUR_USER_ID', 'Lower Body Day', 'Legs and glutes focused workout'),
('YOUR_USER_ID', 'Full Body HIIT', 'High intensity interval training');

-- Sample meals
INSERT INTO meals (user_id, title, calories) VALUES
('YOUR_USER_ID', 'Grilled Chicken Salad', 450),
('YOUR_USER_ID', 'Protein Smoothie', 320),
('YOUR_USER_ID', 'Oatmeal with Berries', 380);

-- Sample progress logs
INSERT INTO progress_logs (user_id, date, weight, notes) VALUES
('YOUR_USER_ID', CURRENT_DATE - 7, 75.5, 'Starting weight'),
('YOUR_USER_ID', CURRENT_DATE - 3, 75.2, 'Feeling good'),
('YOUR_USER_ID', CURRENT_DATE, 74.8, 'Progress!');
```

---

### 5. Saved Plans Table (AI Generated Plans)

```sql
CREATE TABLE saved_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('workout', 'meal')),
  plan_data JSONB NOT NULL,
  plan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE saved_plans ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own saved_plans"
  ON saved_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved_plans"
  ON saved_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved_plans"
  ON saved_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX saved_plans_user_id_idx ON saved_plans(user_id);
CREATE INDEX saved_plans_type_idx ON saved_plans(plan_type);
CREATE INDEX saved_plans_date_idx ON saved_plans(plan_date);
```

---

### 6. Plan Items Table (Individual items from plans)

```sql
CREATE TABLE plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES saved_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'exercise', 'meal', 'snack'
  item_name TEXT NOT NULL,
  item_data JSONB,
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT, -- e.g., '07:00', '12:00'
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE plan_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own plan_items"
  ON plan_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plan_items"
  ON plan_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plan_items"
  ON plan_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plan_items"
  ON plan_items FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX plan_items_user_id_idx ON plan_items(user_id);
CREATE INDEX plan_items_plan_id_idx ON plan_items(plan_id);
CREATE INDEX plan_items_date_idx ON plan_items(scheduled_date);
```

---

### 7. Plan Feedback Table (User feedback on missed items)

```sql
CREATE TABLE plan_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_item_id UUID REFERENCES plan_items(id) ON DELETE SET NULL,
  plan_id UUID REFERENCES saved_plans(id) ON DELETE SET NULL,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('skipped', 'modified', 'suggestion')),
  reason TEXT,
  additional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE plan_feedback ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own plan_feedback"
  ON plan_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plan_feedback"
  ON plan_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX plan_feedback_user_id_idx ON plan_feedback(user_id);
CREATE INDEX plan_feedback_item_id_idx ON plan_feedback(plan_item_id);
```

---

## Example Queries for Plans

### Get user's active workout plan
```sql
SELECT * FROM saved_plans
WHERE user_id = auth.uid()
AND plan_type = 'workout'
ORDER BY created_at DESC
LIMIT 1;
```

### Get today's plan items
```sql
SELECT * FROM plan_items
WHERE user_id = auth.uid()
AND scheduled_date = CURRENT_DATE
ORDER BY scheduled_time ASC;
```

### Get completion rate for current week
```sql
SELECT 
  COUNT(*) FILTER (WHERE is_completed = true) as completed,
  COUNT(*) as total,
  ROUND(COUNT(*) FILTER (WHERE is_completed = true) * 100.0 / NULLIF(COUNT(*), 0), 1) as completion_rate
FROM plan_items
WHERE user_id = auth.uid()
AND scheduled_date >= DATE_TRUNC('week', CURRENT_DATE)
AND scheduled_date < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '7 days';
```

---

## Notes

- Always enable Row Level Security (RLS) on tables containing user data
- Every record must contain a `user_id` that references `auth.users(id)`
- Use `auth.uid()` in policies to get the current authenticated user's ID
- Run these queries in the Supabase SQL Editor

---

## Google OAuth Setup

To enable Google Sign-In:

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URI: `https://[YOUR_SUPABASE_PROJECT_REF].supabase.co/auth/v1/callback`
7. Copy the **Client ID** and **Client Secret**

### 2. Supabase Dashboard Setup

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Google" and enable it
4. Paste your **Client ID** and **Client Secret**
5. Save changes

### 3. Site URL Configuration

1. In Supabase, go to "Authentication" > "URL Configuration"
2. Set **Site URL** to your production URL (e.g., `https://aigymbro.web.id`)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://aigymbro.web.id/auth/callback` (for production)

### 4. Test the Integration

After setup, users can click "Continue with Google" on the login/signup pages to authenticate via Google OAuth.

---

## Forum Tables

### 1. Forum Categories Table

```sql
CREATE TABLE forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT 'teal',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view categories (public)
CREATE POLICY "Categories are viewable by everyone"
  ON forum_categories FOR SELECT
  USING (true);

-- Insert default categories
INSERT INTO forum_categories (name, slug, description, icon, color, sort_order) VALUES
  ('General Discussion', 'general', 'Chat about anything fitness related', 'MessageCircle', 'teal', 1),
  ('Workout Tips', 'workout-tips', 'Share and ask for workout advice', 'Dumbbell', 'emerald', 2),
  ('Nutrition & Diet', 'nutrition', 'Discuss meal plans, recipes, and nutrition', 'Utensils', 'amber', 3),
  ('Progress & Motivation', 'progress', 'Share your fitness journey and motivate others', 'TrendingUp', 'rose', 4),
  ('Questions & Help', 'questions', 'Ask questions and get help from the community', 'HelpCircle', 'blue', 5);
```

### 2. Forum Threads Table

```sql
CREATE TABLE forum_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

-- Enable RLS
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view threads (public for SEO)
CREATE POLICY "Threads are viewable by everyone"
  ON forum_threads FOR SELECT
  USING (true);

-- Policy: Authenticated users can create threads
CREATE POLICY "Authenticated users can create threads"
  ON forum_threads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own threads
CREATE POLICY "Users can update own threads"
  ON forum_threads FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own threads
CREATE POLICY "Users can delete own threads"
  ON forum_threads FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_forum_threads_category ON forum_threads(category_id);
CREATE INDEX idx_forum_threads_slug ON forum_threads(slug);
CREATE INDEX idx_forum_threads_created ON forum_threads(created_at DESC);
```

### 3. Forum Replies Table

```sql
CREATE TABLE forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_solution BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view replies (public)
CREATE POLICY "Replies are viewable by everyone"
  ON forum_replies FOR SELECT
  USING (true);

-- Policy: Authenticated users can create replies
CREATE POLICY "Authenticated users can create replies"
  ON forum_replies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own replies
CREATE POLICY "Users can update own replies"
  ON forum_replies FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own replies
CREATE POLICY "Users can delete own replies"
  ON forum_replies FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_forum_replies_thread ON forum_replies(thread_id);
CREATE INDEX idx_forum_replies_created ON forum_replies(created_at);
```

### 4. Forum User Profiles (Extended)

```sql
-- Add username and avatar to profiles for forum display
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- Function to generate username from email
CREATE OR REPLACE FUNCTION generate_username(email TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(SPLIT_PART(email, '@', 1)) || '_' || SUBSTR(MD5(RANDOM()::TEXT), 1, 4);
END;
$$ LANGUAGE plpgsql;

-- Update existing profiles without username
UPDATE profiles SET username = generate_username(email) WHERE username IS NULL;
```

### 5. View for Thread List with Author Info

```sql
CREATE OR REPLACE VIEW forum_threads_with_author AS
SELECT 
  t.*,
  COALESCE(p.username, 'Deleted User') as author_username,
  p.avatar_url as author_avatar,
  c.name as category_name,
  c.slug as category_slug,
  c.color as category_color,
  (SELECT COUNT(*) FROM forum_replies r WHERE r.thread_id = t.id) as reply_count,
  (SELECT MAX(created_at) FROM forum_replies r WHERE r.thread_id = t.id) as last_reply_at
FROM forum_threads t
LEFT JOIN profiles p ON t.user_id = p.id
LEFT JOIN forum_categories c ON t.category_id = c.id;
```

### 6. View for Replies with Author Info

```sql
CREATE OR REPLACE VIEW forum_replies_with_author AS
SELECT 
  r.*,
  COALESCE(p.username, 'Deleted User') as author_username,
  p.avatar_url as author_avatar
FROM forum_replies r
LEFT JOIN profiles p ON r.user_id = p.id;
```

### 7. Function to Increment Thread Views

```sql
CREATE OR REPLACE FUNCTION increment_thread_views(thread_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE forum_threads SET views = views + 1 WHERE id = thread_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Admin System

### 1. Super Admin Table

```sql
CREATE TABLE super_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE super_admins ENABLE ROW LEVEL SECURITY;

-- Policy: Only super admins can view admin list
CREATE POLICY "Super admins can view admin list"
  ON super_admins FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM super_admins));

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM super_admins WHERE user_id = check_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Add Your First Super Admin

```sql
-- Replace 'YOUR_USER_ID' with the actual UUID of the admin user
-- You can find this in auth.users table or from Supabase Auth dashboard
INSERT INTO super_admins (user_id) VALUES ('YOUR_USER_ID');
```

### 3. Announcements Category (Admin Only)

```sql
-- Insert the announcements category
INSERT INTO forum_categories (name, slug, description, icon, color, sort_order) VALUES
  ('Official Announcements', 'announcements', 'Official updates and news from AI GymBro team', 'Megaphone', 'violet', 0);

-- Add is_admin_only column to categories
ALTER TABLE forum_categories ADD COLUMN IF NOT EXISTS is_admin_only BOOLEAN DEFAULT false;

-- Mark announcements as admin only
UPDATE forum_categories SET is_admin_only = true WHERE slug = 'announcements';
```

### 4. Admin Data Access Policies

```sql
-- Policy: Super admins can view all profiles
CREATE POLICY "Super admins can view all profiles"
  ON profiles FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM super_admins));

-- Policy: Super admins can update all profiles (e.g., set usernames)
CREATE POLICY "Super admins can update all profiles"
  ON profiles FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM super_admins));

-- Policy: Super admins can view all saved_plans
CREATE POLICY "Super admins can view all saved_plans"
  ON saved_plans FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM super_admins));
```

### 5. Admin Thread Policies

```sql
-- Policy: Super admins can delete any thread
CREATE POLICY "Super admins can delete any thread"
  ON forum_threads FOR DELETE
  USING (is_super_admin(auth.uid()));

-- Policy: Super admins can update any thread (pin, lock, etc.)
CREATE POLICY "Super admins can update any thread"
  ON forum_threads FOR UPDATE
  USING (is_super_admin(auth.uid()));

-- Policy: Super admins can delete any reply
CREATE POLICY "Super admins can delete any reply"
  ON forum_replies FOR DELETE
  USING (is_super_admin(auth.uid()));
```

---

## Performance Indexes

Add these indexes to improve query performance:

```sql
-- Index for faster saved_plans queries (dashboard loading)
CREATE INDEX IF NOT EXISTS idx_saved_plans_user_type 
  ON saved_plans(user_id, plan_type, created_at DESC);

-- Index for forum threads listing
CREATE INDEX IF NOT EXISTS idx_forum_threads_category 
  ON forum_threads(category_id, is_pinned DESC, created_at DESC);

-- Index for forum replies
CREATE INDEX IF NOT EXISTS idx_forum_replies_thread 
  ON forum_replies(thread_id, created_at ASC);

-- Index for profile lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username 
  ON profiles(username) WHERE username IS NOT NULL;
```

---

## Leaderboard System

### 1. Meal Plan Completions Table

```sql
CREATE TABLE meal_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES saved_plans(id) ON DELETE SET NULL,
  photo_url TEXT NOT NULL,
  description TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE meal_completions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view completions (for leaderboard)
CREATE POLICY "Completions are viewable by everyone"
  ON meal_completions FOR SELECT
  USING (true);

-- Policy: Users can insert their own completions
CREATE POLICY "Users can insert own completions"
  ON meal_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own completions
CREATE POLICY "Users can delete own completions"
  ON meal_completions FOR DELETE
  USING (auth.uid() = user_id);

-- Index for leaderboard queries
CREATE INDEX idx_meal_completions_user ON meal_completions(user_id);
CREATE INDEX idx_meal_completions_date ON meal_completions(completed_at DESC);

-- Policy for admins to update completions (approve)
CREATE POLICY "Super admins can update completions"
  ON meal_completions FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM super_admins));

-- Policy for admins to delete any completion
CREATE POLICY "Super admins can delete any completion"
  ON meal_completions FOR DELETE
  USING (auth.uid() IN (SELECT user_id FROM super_admins));
```

### 2. Leaderboard View (only counts approved completions)

```sql
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  p.id as user_id,
  COALESCE(p.username, SPLIT_PART(p.email, '@', 1)) as username,
  p.avatar_url,
  COUNT(mc.id) as completion_count,
  MAX(mc.completed_at) as last_completion
FROM profiles p
LEFT JOIN meal_completions mc ON p.id = mc.user_id AND mc.is_approved = true
GROUP BY p.id, p.username, p.email, p.avatar_url
HAVING COUNT(mc.id) > 0
ORDER BY completion_count DESC, last_completion DESC;
```

### 3. View for Completions with Author Info

```sql
CREATE OR REPLACE VIEW meal_completions_with_author AS
SELECT 
  mc.*,
  COALESCE(p.username, SPLIT_PART(p.email, '@', 1), 'User') as author_username,
  p.avatar_url as author_avatar
FROM meal_completions mc
LEFT JOIN profiles p ON mc.user_id = p.id;
```

### 4. Storage Bucket for Meal Photos

In Supabase Dashboard:
1. Go to Storage
2. Create a new bucket called `meal-photos`
3. Set it to Public (so photos can be displayed)
4. Add these policies:

```sql
-- Allow authenticated users to upload to meal-photos bucket
CREATE POLICY "Users can upload meal photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'meal-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public read access to meal photos
CREATE POLICY "Public read access for meal photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'meal-photos');

-- Allow users to delete their own photos
CREATE POLICY "Users can delete own meal photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'meal-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```


