-- Setup pg_cron for automatic daily horoscope generation
-- Runs at 00:05 BG time (22:05 UTC) every night

-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension (for HTTP requests)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule cron job to generate daily horoscopes
-- Runs at 22:05 UTC = 00:05 Bulgarian time (UTC+2)
SELECT cron.schedule(
  'generate-daily-horoscopes',
  '5 22 * * *',  -- At 22:05 UTC every day
  $$
  SELECT
    net.http_post(
      url := 'https://' || (SELECT current_setting('app.settings.project_ref', true)) || '.supabase.co/functions/v1/generate-daily-horoscopes',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || (SELECT current_setting('app.settings.service_role_key', true)),
        'X-Cron-Secret', (SELECT current_setting('app.settings.cron_secret_key', true)),
        'Content-Type', 'application/json'
      ),
      body := '{}'::jsonb
    ) AS request_id;
  $$
);

-- IMPORTANT: Manual setup required in Supabase Dashboard
-- Go to: SQL Editor and run these commands:

-- 1. Set project reference (replace with your project ID):
-- ALTER DATABASE postgres SET app.settings.project_ref = 'YOUR_PROJECT_REF_HERE';

-- 2. Set service role key (from Supabase Settings > API):
-- ALTER DATABASE postgres SET app.settings.service_role_key = 'YOUR_SERVICE_ROLE_KEY_HERE';

-- 3. Set cron secret key (generate a random string):
-- ALTER DATABASE postgres SET app.settings.cron_secret_key = 'YOUR_RANDOM_SECRET_KEY_HERE';

-- View scheduled cron jobs
SELECT * FROM cron.job;

-- View cron job execution history
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;

-- To manually trigger (for testing):
-- SELECT * FROM net.http_post(
--   url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/generate-daily-horoscopes',
--   headers := jsonb_build_object(
--     'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY',
--     'X-Cron-Secret', 'YOUR_CRON_SECRET_KEY',
--     'Content-Type', 'application/json'
--   ),
--   body := '{}'::jsonb
-- );

-- To unschedule (if needed):
-- SELECT cron.unschedule('generate-daily-horoscopes');
