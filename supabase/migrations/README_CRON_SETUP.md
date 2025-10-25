# 🕐 Supabase pg_cron Setup Guide

## Overview

За да останем в рамките на Vercel Free tier (2 Cron Jobs), преместихме 5 от cron jobs в Supabase pg_cron.

### Architecture

**Vercel Cron (2 критични jobs):**
- ✅ `generate-horoscopes` - 6:00 AM UTC (9:00 AM Sofia)
- ✅ `trial-expiring` - 9:00 AM UTC (12:00 PM Sofia)

**Supabase pg_cron (5 jobs):**
- 📧 `daily-reminders` - 8:00 AM UTC (11:00 AM Sofia)
- 📧 `weekly-digest` - Monday 9:00 AM UTC (12:00 PM Sofia)
- 📧 `upsell-campaign` - Wednesday 10:00 AM UTC (1:00 PM Sofia)
- 📧 `renewal-reminder` - 8:00 AM UTC (11:00 AM Sofia)
- 📝 `daily-horoscopes` - 6:00 AM UTC (9:00 AM Sofia)

---

## Setup Instructions

### Step 1: Get Your CRON_SECRET

1. Open your `.env.local` file
2. Copy the value of `CRON_SECRET`
3. Keep it handy - you'll need it in Step 3

### Step 2: Open Supabase SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **SQL Editor** in left sidebar
4. Click **New Query**

### Step 3: Run the Migration

1. Open the file: `supabase/migrations/20251025_setup_additional_cron_jobs.sql`
2. Copy the entire content
3. Paste it in Supabase SQL Editor
4. **IMPORTANT:** Replace these placeholders:
   ```sql
   -- Line 18:
   vercel_domain TEXT := 'vrachka.eu';  -- Replace YOUR_VERCEL_DOMAIN

   -- Line 19:
   cron_secret TEXT := 'your-actual-cron-secret-here';  -- Replace YOUR_CRON_SECRET
   ```
5. Click **Run** (or press Ctrl+Enter)

### Step 4: Verify Setup

After running the migration, check the output at the bottom:

**Expected Output:**
```
✅ 5 cron jobs scheduled
✅ Helper function created
✅ Extensions enabled
```

You should see a table with your 5 scheduled jobs.

---

## Testing

### Test a Single Cron Job

```sql
-- Test daily reminders
SELECT call_vercel_cron('/api/cron/daily-reminders');

-- Check the result
SELECT * FROM net._http_response ORDER BY created_at DESC LIMIT 1;
```

### View All Scheduled Jobs

```sql
SELECT jobid, jobname, schedule, active
FROM cron.job
WHERE jobname IN (
  'daily-reminders',
  'weekly-digest',
  'upsell-campaign',
  'renewal-reminder',
  'daily-horoscopes'
)
ORDER BY jobname;
```

### View Recent Executions

```sql
SELECT
  j.jobname,
  r.status,
  r.return_message,
  r.start_time,
  r.end_time
FROM cron.job_run_details r
JOIN cron.job j ON j.jobid = r.jobid
WHERE j.jobname IN (
  'daily-reminders',
  'weekly-digest',
  'upsell-campaign',
  'renewal-reminder',
  'daily-horoscopes'
)
ORDER BY r.start_time DESC
LIMIT 20;
```

---

## Troubleshooting

### Error: "extension pg_cron does not exist"

Run:
```sql
CREATE EXTENSION pg_cron;
CREATE EXTENSION pg_net;
```

### HTTP Request Fails (401 Unauthorized)

Check that your `CRON_SECRET` matches in:
1. Supabase migration (line 19)
2. Vercel Environment Variables
3. `.env.local`

### Job Not Running

Check if the job is active:
```sql
SELECT * FROM cron.job WHERE jobname = 'daily-reminders';
```

If `active = false`, activate it:
```sql
SELECT cron.schedule(
  'daily-reminders',
  '0 8 * * *',
  $$SELECT call_vercel_cron('/api/cron/daily-reminders');$$
);
```

### View Failed Jobs

```sql
SELECT *
FROM cron.job_run_details
WHERE status = 'failed'
ORDER BY start_time DESC
LIMIT 10;
```

---

## Managing Cron Jobs

### Pause a Job

```sql
SELECT cron.unschedule('daily-reminders');
```

### Resume a Job

```sql
SELECT cron.schedule(
  'daily-reminders',
  '0 8 * * *',
  $$SELECT call_vercel_cron('/api/cron/daily-reminders');$$
);
```

### Delete All Jobs

```sql
SELECT cron.unschedule('daily-reminders');
SELECT cron.unschedule('weekly-digest');
SELECT cron.unschedule('upsell-campaign');
SELECT cron.unschedule('renewal-reminder');
SELECT cron.unschedule('daily-horoscopes');
```

---

## Monitoring

### Email Alerts (Optional)

Set up email alerts for failed jobs in Supabase:

1. Go to **Database** → **Functions**
2. Create a new function:

```sql
CREATE OR REPLACE FUNCTION notify_failed_cron()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'failed' THEN
    -- Send notification (implement your notification logic)
    RAISE NOTICE 'Cron job % failed: %', NEW.jobid, NEW.return_message;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cron_failure_notification
AFTER INSERT ON cron.job_run_details
FOR EACH ROW
WHEN (NEW.status = 'failed')
EXECUTE FUNCTION notify_failed_cron();
```

---

## Cost Comparison

### Before (Vercel)
- ❌ Need Pro plan: $20/month
- ❌ 7 Cron Jobs

### After (Hybrid)
- ✅ Vercel Free: $0
- ✅ Supabase Free: $0
- ✅ 2 Vercel + 5 Supabase Cron Jobs

**Savings: $20/month** 💰

---

## Support

If you encounter issues:
1. Check Supabase logs in Dashboard
2. Check Vercel logs for the endpoint
3. Verify CRON_SECRET matches everywhere
4. Test manually with `SELECT call_vercel_cron(...)`
