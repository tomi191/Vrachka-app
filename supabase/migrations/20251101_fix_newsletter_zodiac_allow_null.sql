-- =====================================================
-- FIX NEWSLETTER ZODIAC SIGN CONSTRAINT
-- Created: 2025-11-01
-- Purpose: Allow NULL values for zodiac_sign in newsletter_subscribers
-- =====================================================

-- Problem:
-- The zodiac_sign constraint was too strict - it rejected NULL values.
-- When unauthenticated users subscribe to the newsletter, the API sends
-- zodiac_sign as NULL (because they don't have a profile), which was
-- being rejected by the CHECK constraint.

-- Solution:
-- Update the constraint to allow NULL values while still validating
-- non-NULL values must be valid Bulgarian zodiac slugs.

-- Drop old constraint (doesn't allow NULL)
ALTER TABLE newsletter_subscribers
  DROP CONSTRAINT IF EXISTS newsletter_subscribers_zodiac_sign_check;

-- Add new constraint that allows NULL
ALTER TABLE newsletter_subscribers
  ADD CONSTRAINT newsletter_subscribers_zodiac_sign_check
  CHECK (zodiac_sign IS NULL OR zodiac_sign IN (
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
COMMENT ON COLUMN newsletter_subscribers.zodiac_sign IS 'User zodiac sign in Bulgarian slug format (e.g., oven, telec) - can be NULL for unauthenticated subscribers';
