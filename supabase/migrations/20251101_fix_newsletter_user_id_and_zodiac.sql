-- =====================================================
-- NEWSLETTER SUBSCRIBERS FIX
-- Created: 2025-11-01
-- Purpose: Add user_id column and fix zodiac_sign constraint for Bulgarian slugs
-- =====================================================

-- Problem:
-- 1. API tries to insert user_id but column doesn't exist
-- 2. zodiac_sign constraint uses English names but horoscope system uses Bulgarian slugs

-- =====================================================
-- 1. ADD USER_ID COLUMN
-- =====================================================

-- Add user_id to link newsletter subscribers to authenticated users
ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Add index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_user_id
  ON newsletter_subscribers(user_id);

-- Add comment
COMMENT ON COLUMN newsletter_subscribers.user_id IS 'Links subscriber to authenticated user account (if logged in during subscription)';

-- =====================================================
-- 2. FIX ZODIAC_SIGN CONSTRAINT
-- =====================================================

-- First, migrate existing English zodiac names to Bulgarian slugs
UPDATE newsletter_subscribers
SET zodiac_sign = CASE zodiac_sign
  WHEN 'aries' THEN 'oven'
  WHEN 'taurus' THEN 'telec'
  WHEN 'gemini' THEN 'bliznaci'
  WHEN 'cancer' THEN 'rak'
  WHEN 'leo' THEN 'lav'
  WHEN 'virgo' THEN 'deva'
  WHEN 'libra' THEN 'vezni'
  WHEN 'scorpio' THEN 'skorpion'
  WHEN 'sagittarius' THEN 'strelec'
  WHEN 'capricorn' THEN 'kozirog'
  WHEN 'aquarius' THEN 'vodolej'
  WHEN 'pisces' THEN 'ribi'
  ELSE zodiac_sign
END
WHERE zodiac_sign IN ('aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
                      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces');

-- Drop old constraint (if exists)
ALTER TABLE newsletter_subscribers
  DROP CONSTRAINT IF EXISTS newsletter_subscribers_zodiac_sign_check;

-- Add new constraint with Bulgarian zodiac slugs
ALTER TABLE newsletter_subscribers
  ADD CONSTRAINT newsletter_subscribers_zodiac_sign_check
  CHECK (zodiac_sign IN (
    'oven',      -- Овен (Aries)
    'telec',     -- Телец (Taurus)
    'bliznaci',  -- Близнаци (Gemini)
    'rak',       -- Рак (Cancer)
    'lav',       -- Лъв (Leo)
    'deva',      -- Дева (Virgo)
    'vezni',     -- Везни (Libra)
    'skorpion',  -- Скорпион (Scorpio)
    'strelec',   -- Стрелец (Sagittarius)
    'kozirog',   -- Козирог (Capricorn)
    'vodolej',   -- Водолей (Aquarius)
    'ribi'       -- Риби (Pisces)
  ));

-- Update comment
COMMENT ON COLUMN newsletter_subscribers.zodiac_sign IS 'User zodiac sign in Bulgarian slug format (e.g., oven, telec, bliznaci) for personalized horoscopes';

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Verify columns exist
DO $$
BEGIN
  -- Check user_id column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'newsletter_subscribers' AND column_name = 'user_id'
  ) THEN
    RAISE EXCEPTION 'Failed to add user_id column to newsletter_subscribers';
  END IF;

  -- Check zodiac_sign constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'newsletter_subscribers'
    AND constraint_name = 'newsletter_subscribers_zodiac_sign_check'
  ) THEN
    RAISE EXCEPTION 'Failed to create zodiac_sign constraint';
  END IF;

  RAISE NOTICE 'Successfully updated newsletter_subscribers table';
  RAISE NOTICE '✅ Added user_id column';
  RAISE NOTICE '✅ Updated zodiac_sign constraint to Bulgarian slugs';
  RAISE NOTICE '✅ Migrated existing English zodiac names to Bulgarian format';
END $$;
