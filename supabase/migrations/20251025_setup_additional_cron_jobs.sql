-- Setup additional pg_cron jobs for marketing/engagement endpoints
-- These were moved from Vercel Cron to Supabase pg_cron to stay within free tier limits
--
-- IMPORTANT SETUP STEPS:
-- 1. Replace YOUR_VERCEL_DOMAIN with your actual domain (e.g., 'vrachka.eu')
-- 2. Replace YOUR_CRON_SECRET with your CRON_SECRET from .env
--
-- Run this migration in Supabase SQL Editor

-- Enable extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Helper function to call Vercel cron endpoints
CREATE OR REPLACE FUNCTION call_vercel_cron(endpoint_path TEXT)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  request_id BIGINT;
  vercel_domain TEXT := 'YOUR_VERCEL_DOMAIN'; -- Replace with 'vrachka.eu'
  cron_secret TEXT := 'YOUR_CRON_SECRET'; -- Replace with your CRON_SECRET
BEGIN
  SELECT net.http_post(
    url := 'https://' || vercel_domain || endpoint_path,
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || cron_secret,
      'Content-Type', 'application/json',
      'User-Agent', 'Supabase-pgCron/1.0'
    ),
    body := '{}'::jsonb
  ) INTO request_id;

  RETURN request_id;
END;
$$;

-- 1. Daily Reminders - Every day at 8:00 AM UTC (11:00 AM Sofia)
SELECT cron.schedule(
  'daily-reminders',
  '0 8 * * *',
  $$SELECT call_vercel_cron('/api/cron/daily-reminders');$$
);

-- 2. Weekly Digest - Every Monday at 9:00 AM UTC (12:00 PM Sofia)
SELECT cron.schedule(
  'weekly-digest',
  '0 9 * * 1',
  $$SELECT call_vercel_cron('/api/cron/weekly-digest');$$
);

-- 3. Upsell Campaign - Every Wednesday at 10:00 AM UTC (1:00 PM Sofia)
SELECT cron.schedule(
  'upsell-campaign',
  '0 10 * * 3',
  $$SELECT call_vercel_cron('/api/cron/upsell-campaign');$$
);

-- 4. Renewal Reminder - Every day at 8:00 AM UTC (11:00 AM Sofia)
SELECT cron.schedule(
  'renewal-reminder',
  '0 8 * * *',
  $$SELECT call_vercel_cron('/api/cron/renewal-reminder');$$
);

-- 5. Daily Horoscopes (Blog Posts) - Every day at 6:00 AM UTC (9:00 AM Sofia)
SELECT cron.schedule(
  'daily-horoscopes',
  '0 6 * * *',
  $$SELECT call_vercel_cron('/api/cron/daily-horoscopes');$$
);

-- View all scheduled cron jobs
SELECT
  jobid,
  schedule,
  command,
  nodename,
  nodeport,
  database,
  username,
  active,
  jobname
FROM cron.job
ORDER BY jobname;

-- View recent cron job runs
SELECT
  jobid,
  runid,
  job_pid,
  database,
  username,
  command,
  status,
  return_message,
  start_time,
  end_time
FROM cron.job_run_details
ORDER BY start_time DESC
LIMIT 20;

-- To manually test an endpoint:
-- SELECT call_vercel_cron('/api/cron/daily-reminders');

-- To view request logs:
-- SELECT * FROM net._http_response ORDER BY created_at DESC LIMIT 10;

-- To unschedule a job (if needed):
-- SELECT cron.unschedule('daily-reminders');
-- SELECT cron.unschedule('weekly-digest');
-- SELECT cron.unschedule('upsell-campaign');
-- SELECT cron.unschedule('renewal-reminder');
-- SELECT cron.unschedule('daily-horoscopes');
