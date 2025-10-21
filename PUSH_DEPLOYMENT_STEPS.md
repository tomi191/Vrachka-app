# 🔔 Push Notifications - Deployment Steps

## ✅ Code Changes (Already Done)
- ✅ Created `worker/index.js` with push event handlers
- ✅ Updated `next.config.js` to use custom service worker
- ✅ VAPID keys generated and added to `.env.local`

---

## 🚀 Steps to Complete Deployment

### 1. Verify Vercel Environment Variables

**Go to:** Vercel Dashboard → Vrachka Project → Settings → Environment Variables

**Confirm these 3 variables exist:**
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` → Your VAPID public key
- `VAPID_PUBLIC_KEY` → Same as above (for server-side)
- `VAPID_PRIVATE_KEY` → Your VAPID private key

**If missing:** Add them now and redeploy

---

### 2. Run Supabase Migration 004

**Go to:** Supabase Dashboard → SQL Editor → New Query

**Execute this migration:**
```sql
-- Copy & paste contents from:
-- supabase/migrations/004_push_notifications.sql

-- Creates tables:
-- - push_subscriptions
-- - push_notification_logs
```

**To verify it worked:**
```sql
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
AND tablename LIKE 'push%';

-- Should return:
-- push_subscriptions
-- push_notification_logs
```

---

### 3. Deploy Code Changes

After migration is complete:

```bash
cd vrachka
git add -A
git commit -m "Fix push notifications - add service worker handlers"
git push
```

Vercel will auto-deploy.

---

### 4. Test Push Notifications

**After deployment:**

1. Visit `/profile/settings`
2. Click "Включи" на "Дневни напомняния"
3. Browser should prompt for permission → Click "Allow"
4. Toggle should turn ON (не безкрайно зареждане!)

**Test sending notification:**

Open browser console and run:
```javascript
fetch('/api/push/test', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
```

You should receive a test notification! 🎉

---

### 5. Verify in Database

**Check subscription was saved:**
```sql
SELECT
  user_id,
  endpoint,
  is_active,
  created_at
FROM push_subscriptions
ORDER BY created_at DESC
LIMIT 5;
```

---

## 🐛 Troubleshooting

**Problem:** Toggle still loading infinitely

**Solution:**
1. Check browser console for errors
2. Verify VAPID keys in Vercel match `.env.local`
3. Confirm migration 004 ran successfully
4. Hard refresh (Ctrl+Shift+R) to clear service worker cache

**Problem:** "Push notifications not supported"

**Solution:** Must use HTTPS (localhost is OK for dev)

**Problem:** Permission blocked

**Solution:** User needs to reset permissions in browser settings

---

## ✨ Done!

Push notifications are now fully working! 🔔

Users can subscribe to daily reminders on `/profile/settings`.
