# Push Notifications Setup за Vrachka

## 🎯 Какво прави Push Notifications?

- **Daily Reminder** в 8:00 сутринта за дневен хороскоп
- **Streak Protection** - напомняне ако user-ът не е посетил 2 дни
- **Special Events** - пълнолуния, ретроградни планети
- **Payment Reminders** - преди renewal на subscription

**Expected Impact:**
- +30-40% retention rate
- +20% higher DAU
- Better engagement scores

---

## 📋 Setup Steps

### 1. Generate VAPID Keys

VAPID keys са необходими за Web Push Authentication.

**Option A: Using web-push CLI (Препоръчвам)**

```bash
cd vrachka
npx web-push generate-vapid-keys
```

Ще получиш нещо като:

```
Public Key:
BBx...очень длинный ключ...

Private Key:
abc...очень длинный ключ...
```

**Option B: Using Node.js**

Създай файл `generate-vapid.js`:

```javascript
const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys();

console.log('Public Key:', vapidKeys.publicKey);
console.log('Private Key:', vapidKeys.privateKey);
```

Изпълни: `node generate-vapid.js`

---

### 2. Add Keys to Environment Variables

#### Local Development (`.env.local`)

```bash
# VAPID Keys for Web Push Notifications
VAPID_PUBLIC_KEY=BBx...
VAPID_PRIVATE_KEY=abc...
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BBx...  # Same as VAPID_PUBLIC_KEY
```

**Важно:**
- `VAPID_PUBLIC_KEY` за server
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` за client
- И двете трябва да са СЪЩИЯТ public key!

#### Production (Vercel)

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add 3 variables:
   - `VAPID_PUBLIC_KEY` = твоя public key
   - `VAPID_PRIVATE_KEY` = твоя private key
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY` = твоя public key (same as above)
3. Apply to: Production, Preview, Development

---

### 3. Run Database Migration

Push Notifications използват 2 нови таблици:

```bash
# Отвори Supabase Dashboard
# SQL Editor → New Query → Paste from:
supabase/migrations/004_push_notifications.sql

# Execute Query
```

Ще създаде:
- `push_subscriptions` - User device subscriptions
- `push_notification_logs` - Tracking на sent notifications

---

### 4. Update Service Worker

Service Worker-ът вече е готов (`public/sw.js`), но добави handling на push events:

**`public/sw.js`** - добави в края:

```javascript
// Push notification handling
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json()

    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon || '/icon-192.png',
        badge: data.badge || '/icon-192.png',
        tag: data.tag || 'general',
        data: {
          url: data.data?.url || '/',
        },
      })
    )
  }
})

// Notification click handling
self.addEventListener('notificationclick', function(event) {
  event.notification.close()

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  )
})
```

---

### 5. Add Push Component to Dashboard

**`app/dashboard/page.tsx`** - добави компонента:

```typescript
import { PushNotificationPrompt } from '@/components/PushNotificationPrompt'

export default function DashboardPage() {
  return (
    <div>
      {/* Existing dashboard content */}

      {/* Push notification prompt */}
      <PushNotificationPrompt />
    </div>
  )
}
```

---

### 6. Add Settings UI

**`app/profile/settings/page.tsx`** - добави в настройките:

```typescript
import { PushNotificationSettings } from '@/components/PushNotificationPrompt'

export default function SettingsPage() {
  return (
    <div>
      {/* Existing settings */}

      <h2>Нотификации</h2>
      <PushNotificationSettings />
    </div>
  )
}
```

---

## 🧪 Testing Push Notifications

### Test Flow:

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open dashboard:**
   - Navigate to `/dashboard`
   - After 10 seconds, prompt ще се появи
   - Click "Включи"

3. **Grant permissions:**
   - Browser ще попита за разрешение
   - Click "Allow"

4. **Send test notification:**
   - Open browser console:
   ```javascript
   fetch('/api/push/test', { method: 'POST' })
   ```
   - Трябва да получиш notification!

5. **Check database:**
   ```sql
   -- Supabase SQL Editor
   SELECT * FROM push_subscriptions WHERE user_id = 'твоя-user-id';
   SELECT * FROM push_notification_logs ORDER BY sent_at DESC LIMIT 10;
   ```

---

## 🚀 Production Setup

### Daily Horoscope Reminder (Cron Job)

Използвай Vercel Cron или external service (UptimeRobot, EasyCron):

**Option A: Vercel Cron** (vercel.json)

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-horoscope-reminder",
      "schedule": "0 8 * * *"
    }
  ]
}
```

Create route: `app/api/cron/daily-horoscope-reminder/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { sendDailyHoroscopeReminders } from '@/lib/push/server'

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await sendDailyHoroscopeReminders()

  return NextResponse.json(result)
}
```

**Option B: External Cron (UptimeRobot)**

1. Create endpoint URL: `https://vrachka.app/api/cron/daily-horoscope-reminder`
2. Add `CRON_SECRET` to `.env.local` and Vercel
3. Setup monitor на UptimeRobot:
   - URL: твоя endpoint
   - Interval: Custom (daily at 8:00 AM)
   - HTTP Headers: `Authorization: Bearer твоя-CRON_SECRET`

---

## 📊 Monitoring

### Check Push Performance:

```sql
-- Успешност на notifications за последната седмица
SELECT
  type,
  COUNT(*) as total,
  SUM(CASE WHEN success THEN 1 ELSE 0 END) as successful,
  ROUND(AVG(CASE WHEN success THEN 1.0 ELSE 0.0 END) * 100, 2) as success_rate
FROM push_notification_logs
WHERE sent_at >= NOW() - INTERVAL '7 days'
GROUP BY type
ORDER BY total DESC;

-- Активни subscriptions per user
SELECT
  COUNT(DISTINCT user_id) as total_users,
  COUNT(*) as total_subscriptions,
  ROUND(AVG(devices_per_user), 2) as avg_devices_per_user
FROM (
  SELECT user_id, COUNT(*) as devices_per_user
  FROM push_subscriptions
  WHERE is_active = TRUE
  GROUP BY user_id
) sub;
```

---

## 🔥 Pro Tips

1. **Don't spam!** Максимум 1 notification на ден (или 2 ако е много important)
2. **Timing matters:** 8:00 AM е perfect за daily horoscope
3. **Personalize:** Използвай първото име в title
4. **Clear CTA:** Винаги включвай URL към конкретна страница
5. **Track engagement:** Monitor click-through rate на notifications

---

## ✅ Checklist

- [ ] Generate VAPID keys
- [ ] Add keys to `.env.local`
- [ ] Add keys to Vercel environment variables
- [ ] Run database migration (004_push_notifications.sql)
- [ ] Update service worker (`public/sw.js`)
- [ ] Add `PushNotificationPrompt` to dashboard
- [ ] Add `PushNotificationSettings` to settings page
- [ ] Test subscribe flow
- [ ] Test sending notification (`/api/push/test`)
- [ ] Setup daily cron job
- [ ] Monitor notification logs

---

## 🐛 Troubleshooting

**Problem:** "Push notifications not supported"
- **Solution:** Трябва да използваш HTTPS (localhost е ОК за development)

**Problem:** Permission denied
- **Solution:** User-ът е натиснал "Block". Трябва да reset-не permissions ръчно от browser settings

**Problem:** Notification не пристига
- **Solution:** Check browser console за errors. Verify VAPID keys са правилни.

**Problem:** 410 Gone error
- **Solution:** Subscription е expired. Автоматично ще се mark-не като inactive.

---

**Готово!** Push Notifications са настроени! 🎉

За въпроси или help с setup, напиши! 🚀
