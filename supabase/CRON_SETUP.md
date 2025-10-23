# Daily Horoscope Cron Job Setup

Автоматично генериране на дневни хороскопи в **00:05 българско време** (22:05 UTC) всяка нощ.

## 🎯 Какво прави:

- Генерира всички 12 хороскопа за деня
- Записва ги в `daily_content` таблица
- Потребителите виждат хороскопа **мигновено** при влизане в `/dashboard`
- Консистентни разходи: точно 12 генерирания/ден

## 📋 Setup стъпки:

### 1. Deploy Edge Function

```bash
# От root директорията на проекта
cd supabase
supabase functions deploy generate-daily-horoscopes
```

### 2. Set Environment Variables in Supabase Dashboard

Отиди в: **Supabase Dashboard → Settings → Edge Functions → Environment Variables**

Добави:
```
OPENROUTER_API_KEY=sk-or-v1-...
CRON_SECRET_KEY=<генерирай случаен string, напр: openssl rand -hex 32>
```

### 3. Apply Migration

Отиди в: **Supabase Dashboard → SQL Editor**

Копирай и изпълни:
```sql
-- Активирай extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Настрой project settings (ЗАМЕНИ стойностите!)
ALTER DATABASE postgres SET app.settings.project_ref = 'YOUR_PROJECT_REF';
ALTER DATABASE postgres SET app.settings.service_role_key = 'YOUR_SERVICE_ROLE_KEY';
ALTER DATABASE postgres SET app.settings.cron_secret_key = 'YOUR_CRON_SECRET_KEY';

-- Създай cron job (22:05 UTC = 00:05 BG)
SELECT cron.schedule(
  'generate-daily-horoscopes',
  '5 22 * * *',
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
```

### 4. Намери Project Credentials

**Project Reference** (пример: `abcdefghijklmnop`):
- Dashboard → Settings → General → Reference ID

**Service Role Key**:
- Dashboard → Settings → API → service_role (secret key)

**Cron Secret Key**:
- Генерирай локално:
  ```bash
  openssl rand -hex 32
  ```
- Или използвай: https://www.uuidgenerator.net/

## ✅ Verification:

### Провери дали cron job е създаден:
```sql
SELECT * FROM cron.job;
```

Трябва да видиш:
```
jobname: generate-daily-horoscopes
schedule: 5 22 * * *
active: true
```

### Провери execution history:
```sql
SELECT * FROM cron.job_run_details
ORDER BY start_time DESC
LIMIT 10;
```

### Провери дали хороскопите се генерират:
```sql
SELECT
  target_key as zodiac,
  target_date,
  generated_at,
  content_body->>'general' as preview
FROM daily_content
WHERE content_type = 'horoscope'
  AND target_date = CURRENT_DATE
ORDER BY target_key;
```

Трябва да видиш всички 12 зодии за днешната дата.

## 🧪 Manual Testing:

### Тествай Edge Function директно:

```bash
curl -X POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/generate-daily-horoscopes' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'X-Cron-Secret: YOUR_CRON_SECRET_KEY' \
  -H 'Content-Type: application/json'
```

Очакван отговор:
```json
{
  "success": [
    {"zodiac": "oven", "name": "Овен", "status": "generated"},
    ...
  ],
  "errors": [],
  "date": "2025-10-24",
  "timestamp": "2025-10-23T22:05:00.000Z"
}
```

### Тествай от Supabase SQL Editor:

```sql
SELECT * FROM net.http_post(
  url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/generate-daily-horoscopes',
  headers := jsonb_build_object(
    'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY',
    'X-Cron-Secret', 'YOUR_CRON_SECRET_KEY',
    'Content-Type', 'application/json'
  ),
  body := '{}'::jsonb
);
```

## 🛠 Troubleshooting:

### Cron job не се изпълнява:

1. Провери дали `pg_cron` extension е активиран:
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'pg_cron';
   ```

2. Провери logs:
   ```sql
   SELECT * FROM cron.job_run_details
   WHERE jobname = 'generate-daily-horoscopes'
   ORDER BY start_time DESC;
   ```

3. Провери дали Edge Function е deploy-ната:
   ```bash
   supabase functions list
   ```

### Edge Function връща 401 Unauthorized:

- Провери `X-Cron-Secret` header
- Провери дали `CRON_SECRET_KEY` env variable е зададен в Supabase Dashboard

### Edge Function връща 500 Error:

- Провери logs в Supabase Dashboard → Edge Functions → Logs
- Провери дали `OPENROUTER_API_KEY` е валиден
- Провери дали имаш sufficient credits в OpenRouter

## 📊 Monitoring:

### View logs in real-time:

```bash
supabase functions logs generate-daily-horoscopes --tail
```

### Check cost per day:

Отиди в: https://openrouter.ai/activity

Филтрирай по:
- App: Vrachka - Daily Horoscope Cron
- Date range: Last 30 days

Очаквани разходи:
- 12 генерирания/ден × 30 дни = 360 генерирания/месец
- ~2000 tokens/генериране
- **Общо: ~$0.70-1.00/месец** 💰

## 🔄 Update cron schedule:

За да промениш часа на изпълнение:

```sql
-- Първо unschedule стария
SELECT cron.unschedule('generate-daily-horoscopes');

-- После създай нов със нов schedule
SELECT cron.schedule(
  'generate-daily-horoscopes',
  '0 23 * * *',  -- Нов час (23:00 UTC = 01:00 BG)
  $$...$$  -- Същата команда
);
```

## 📅 Cron syntax reference:

```
┌───────────── минута (0 - 59)
│ ┌───────────── час (0 - 23)
│ │ ┌───────────── ден от месеца (1 - 31)
│ │ │ ┌───────────── месец (1 - 12)
│ │ │ │ ┌───────────── ден от седмицата (0 - 6) (неделя = 0)
│ │ │ │ │
* * * * *
```

Примери:
- `5 22 * * *` - 22:05 UTC всеки ден
- `0 0 * * *` - 00:00 UTC всеки ден (полунощ)
- `0 12 * * *` - 12:00 UTC всеки ден (обяд)
- `*/30 * * * *` - На всеки 30 минути

## 🚀 Ready!

След setup, хороскопите ще се генерират автоматично всяка нощ в 00:05 BG време.

Потребителите ще виждат хороскопа **мигновено** при влизане в dashboard! 🎉
