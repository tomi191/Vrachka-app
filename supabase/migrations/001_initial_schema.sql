-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  birth_time TIME,
  birth_place TEXT,
  zodiac_sign TEXT NOT NULL,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  daily_streak INT DEFAULT 0,
  last_visit_date DATE,
  total_oracle_questions_asked INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS для profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =============================================
-- SUBSCRIPTIONS TABLE
-- =============================================
CREATE TABLE subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan_type TEXT CHECK (plan_type IN ('free', 'basic', 'ultimate')) DEFAULT 'free',
  status TEXT CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'incomplete')) DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

-- RLS для subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- =============================================
-- DAILY_CONTENT TABLE
-- =============================================
CREATE TABLE daily_content (
  id BIGSERIAL PRIMARY KEY,
  content_type TEXT CHECK (content_type IN ('horoscope', 'tarot_daily_meaning', 'weekly_horoscope', 'monthly_horoscope')) NOT NULL,
  target_date DATE NOT NULL,
  target_key TEXT NOT NULL, -- zodiac sign or card name
  content_body JSONB NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(content_type, target_date, target_key)
);

CREATE INDEX idx_daily_content_lookup ON daily_content(content_type, target_date, target_key);

-- RLS для daily_content (всички могат да четат)
ALTER TABLE daily_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read daily content"
  ON daily_content FOR SELECT
  TO authenticated
  USING (true);

-- =============================================
-- TAROT_CARDS TABLE
-- =============================================
CREATE TABLE tarot_cards (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  name_bg TEXT NOT NULL,
  card_type TEXT CHECK (card_type IN ('major_arcana', 'minor_arcana')) NOT NULL,
  suit TEXT CHECK (suit IN ('wands', 'cups', 'swords', 'pentacles')),
  image_url TEXT NOT NULL,
  upright_meaning TEXT NOT NULL,
  reversed_meaning TEXT
);

-- RLS для tarot_cards (всички могат да четат)
ALTER TABLE tarot_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tarot cards"
  ON tarot_cards FOR SELECT
  TO authenticated
  USING (true);

-- =============================================
-- ORACLE_CONVERSATIONS TABLE
-- =============================================
CREATE TABLE oracle_conversations (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  tokens_used INT,
  asked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_oracle_user_date ON oracle_conversations(user_id, asked_at DESC);

-- RLS для oracle_conversations
ALTER TABLE oracle_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON oracle_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON oracle_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- API_USAGE_LIMITS TABLE
-- =============================================
CREATE TABLE api_usage_limits (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  oracle_questions_count INT DEFAULT 0,
  tarot_readings_count INT DEFAULT 0,

  PRIMARY KEY(user_id, date)
);

-- RLS для api_usage_limits
ALTER TABLE api_usage_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage limits"
  ON api_usage_limits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own usage limits"
  ON api_usage_limits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage limits"
  ON api_usage_limits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- REFERRAL_CODES TABLE
-- =============================================
CREATE TABLE referral_codes (
  id BIGSERIAL PRIMARY KEY,
  referrer_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  uses_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE referral_redemptions (
  id BIGSERIAL PRIMARY KEY,
  referrer_user_id UUID NOT NULL REFERENCES profiles(id),
  referred_user_id UUID NOT NULL REFERENCES profiles(id),
  redeemed_at TIMESTAMPTZ DEFAULT NOW(),
  reward_granted BOOLEAN DEFAULT FALSE
);

-- RLS для referral tables
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referral code"
  ON referral_codes FOR SELECT
  USING (auth.uid() = referrer_user_id);

CREATE POLICY "Users can view own referral redemptions"
  ON referral_redemptions FOR SELECT
  USING (auth.uid() = referrer_user_id OR auth.uid() = referred_user_id);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to automatically create subscription for new user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan_type, status)
  VALUES (NEW.id, 'free', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create subscription on profile creation
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
