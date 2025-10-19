# 🚀 Production Deployment Checklist - Vrachka

**Project:** Vrachka - vrachka.eu
**Date:** 2025-10-20
**Status:** 90% READY - Minor fixes needed

---

## ✅ ГОТОВО - Работещи функционалности

### Core Features
- ✅ User Authentication (Supabase Auth)
- ✅ Onboarding Flow
- ✅ Profile Management
- ✅ Subscription System (Stripe)
- ✅ Referral System (+ награди)
- ✅ Daily Horoscopes
- ✅ Tarot Readings
- ✅ AI Oracle Chat
- ✅ Push Notifications Infrastructure
- ✅ Email System (Resend)

### Database
- ✅ Всички 11 таблици създадени
- ✅ RLS policies активирани
- ✅ Triggers и Functions работят
- ✅ Миграции приложени (001-005)

### Security
- ✅ Middleware защита на protected routes
- ✅ RLS на всички таблици
- ✅ API rate limiting за Oracle/Tarot
- ✅ Environment variables изолирани
- ✅ CORS правилно конфигуриран

### SEO & Performance
- ✅ Meta tags (OG, Twitter)
- ✅ Sitemap.xml автоматично генериран
- ✅ robots.txt конфигуриран
- ✅ Vercel Analytics интегриран
- ✅ Speed Insights активиран
- ✅ PWA поддръжка (manifest.json)

### UI/UX
- ✅ Responsive дизайн
- ✅ Dark theme
- ✅ Loading states
- ✅ Error messages
- ✅ Toast notifications
- ✅ Smooth animations

---

## ⚠️ КРИТИЧНИ - Трябва да се оправят ПРЕДИ deploy

### 1. ✅ ~~VAPID Keys за Push Notifications~~ - ГОТОВО

**Статус:** ✅ DONE

VAPID keys са генерирани и добавени в `.env.local`:
- ✅ NEXT_PUBLIC_VAPID_PUBLIC_KEY
- ✅ VAPID_PUBLIC_KEY
- ✅ VAPID_PRIVATE_KEY

**⚠️ TODO:** Добави същите keys в Vercel environment variables

---

### 2. 🔴 Email Domain Verification

**Проблем:** Emails се изпращат от `onboarding@resend.dev` вместо от `vrachka.eu`

**Текущо:**
```typescript
export const FROM_EMAIL = 'Vrachka <onboarding@resend.dev>';
```

**Трябва да стане:**
```typescript
export const FROM_EMAIL = 'Vrachka <noreply@vrachka.eu>';
```

**Стъпки:**
1. Отиди на Resend Dashboard
2. Add domain: `vrachka.eu`
3. Добави DNS records (SPF, DKIM, DMARC)
4. Verify domain
5. Update `lib/email/client.ts:12`

**Файл:** `lib/email/client.ts:10-12`

**Priority:** CRITICAL - emails може да отиват в SPAM

---

### 3. 🟡 Missing OG Image

**Проблем:** `/og-image.png` не съществува

**Решение:**
```bash
# Create OG image 1200x630px
# Save to: public/og-image.png
```

**Файл:** `app/layout.tsx:54`

**Priority:** MEDIUM - SEO/Social sharing

---

### 4. 🟡 User Preferences Table

**Проблем:** Settings се запазват само в localStorage, не в DB

**TODO коментар:**
```typescript
// TODO: Save to database when preferences table is created
```

**Решение:** (Опционално за v1, може след deploy)
```sql
-- Migration 006
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Файл:** `app/(authenticated)/profile/settings/SettingsForm.tsx:30`

**Priority:** LOW - може да се добави по-късно

---

## 📋 ПРЕПОРЪЧИТЕЛНО - Подобрения за Production

### 5. 🟢 Error Boundary Component

**Препоръка:** Добави глобален Error Boundary

**Решение:**
```typescript
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Нещо се обърка! 😢
        </h2>
        <p className="text-zinc-400 mb-6">
          {error.message || 'Моля, опитайте отново'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-accent-600 text-white rounded-lg"
        >
          Опитай отново
        </button>
      </div>
    </div>
  )
}
```

**Priority:** MEDIUM

---

### 6. 🟢 Environment Variables Validation

**Препоръка:** Валидирай env vars при startup

**Решение:**
```typescript
// lib/env.ts
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENROUTER_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'RESEND_API_KEY',
] as const;

requiredEnvVars.forEach(key => {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
});
```

**Priority:** LOW - nice to have

---

### 7. 🟢 API Response Caching

**Препоръка:** Cache daily horoscopes за да намалиш API calls

**Решение:**
```typescript
// app/api/horoscope/route.ts
export const revalidate = 86400; // 24 hours
```

**Priority:** LOW - optimization

---

### 8. 🟢 Database Connection Pooling

**Препоръка:** Monitor Supabase connection limits

**Текущо:** Supabase free tier = 60 concurrent connections

**Решение:**
- Monitor в Supabase Dashboard → Database → Connection pooling
- Ако се приближиш към лимита, upgrade plan или implement connection pooling

**Priority:** LOW - monitor after launch

---

## 🔧 Environment Variables Checklist

### Production .env (Vercel)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://kpdumthwuahkuaggilpz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenRouter AI
OPENROUTER_API_KEY=sk-or-v1-...

# Stripe
STRIPE_SECRET_KEY=sk_live_...           # ⚠️ LIVE key, not test!
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...         # ⚠️ Production webhook
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_ULTIMATE_PRICE_ID=price_...

# Email (Resend)
RESEND_API_KEY=re_...

# App URLs
NEXT_PUBLIC_URL=https://vrachka.eu
NEXT_PUBLIC_APP_URL=https://vrachka.eu

# Push Notifications (CRITICAL!)
VAPID_PUBLIC_KEY=BF4...
VAPID_PRIVATE_KEY=xyz...
```

---

## 📊 Pre-Deploy Testing Checklist

### Functional Testing

- [ ] User Registration (Email + Google)
- [ ] Email Verification
- [ ] Login / Logout
- [ ] Onboarding Flow
- [ ] Daily Horoscope Generation
- [ ] Tarot Reading (all types)
- [ ] Oracle Chat
- [ ] Stripe Checkout (Test Mode)
- [ ] Stripe Webhook Processing
- [ ] Referral Code Creation
- [ ] Referral Code Redemption
- [ ] Referral Reward Granting
- [ ] Push Notification Subscription
- [ ] Push Notification Delivery
- [ ] Profile Edit
- [ ] Subscription Management

### Performance Testing

- [ ] Lighthouse Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] No console errors
- [ ] No failed API calls

### Browser Testing

- [ ] Chrome (Desktop + Mobile)
- [ ] Safari (Desktop + Mobile)
- [ ] Firefox
- [ ] Edge

### Mobile Testing

- [ ] iOS Safari
- [ ] Android Chrome
- [ ] PWA Install
- [ ] Push Notifications (mobile)

---

## 🚀 Deployment Steps

### 1. Pre-Deploy

```bash
# Local testing
npm run build
npm run start

# Type check
npm run type-check

# Fix any errors
```

### 2. Vercel Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... add all env vars from checklist above

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 3. Supabase Configuration

```bash
# Go to Supabase Dashboard
https://supabase.com/dashboard/project/kpdumthwuahkuaggilpz

# Update Site URL
Authentication → URL Configuration → Site URL
https://vrachka.eu

# Update Redirect URLs
Authentication → URL Configuration → Redirect URLs
https://vrachka.eu/auth/callback
https://vrachka.eu/*

# Test Email Templates
Authentication → Email Templates
→ Test each template
```

### 4. Stripe Configuration

```bash
# Switch to Live Mode
Dashboard → Toggle "Test mode" OFF

# Update Webhook URL
Developers → Webhooks → Add endpoint
https://vrachka.eu/api/webhooks/stripe

# Select events:
- checkout.session.completed
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed

# Copy webhook signing secret
→ Update STRIPE_WEBHOOK_SECRET in Vercel
```

### 5. Domain Configuration

```bash
# Vercel
Domains → Add vrachka.eu
→ Configure DNS (CNAME or A record)

# Wait for SSL certificate (automatic)

# Resend
Add domain vrachka.eu
→ Add DNS records (SPF, DKIM, DMARC)
→ Verify domain
→ Update FROM_EMAIL in code
```

### 6. Post-Deploy Verification

```bash
# Check health
curl https://vrachka.eu

# Test auth
- Register new user
- Verify email received
- Complete onboarding

# Test payments
- Subscribe to Basic plan (use test card in live mode: 4242...)
- Check Stripe Dashboard for payment
- Check Supabase for subscription record

# Test referral
- Create referral code
- Register with code
- Upgrade referred user
- Check referrer received reward

# Monitor errors
- Vercel Dashboard → Logs
- Supabase Dashboard → Logs
- Stripe Dashboard → Events
```

---

## 📈 Post-Launch Monitoring

### Week 1

- [ ] Monitor Vercel Logs daily
- [ ] Check Stripe Dashboard for payment issues
- [ ] Monitor Supabase connection usage
- [ ] Check email deliverability
- [ ] Review error rates
- [ ] Gather user feedback

### Week 2-4

- [ ] Analyze conversion funnel
- [ ] Review subscription metrics
- [ ] Check referral system effectiveness
- [ ] Optimize slow API endpoints
- [ ] Improve UX based on feedback

### Tools

- **Analytics:** Vercel Analytics (already integrated)
- **Error Tracking:** Consider Sentry or LogRocket
- **Uptime Monitoring:** Consider UptimeRobot or Pingdom
- **User Feedback:** Hotjar or Google Analytics

---

## 🐛 Known Issues & Workarounds

### Issue 1: Email Delivery

**Symptom:** Emails не се получават

**Troubleshooting:**
1. Check Resend Dashboard → Logs
2. Verify domain DNS records
3. Check spam folder
4. Test with different email providers

### Issue 2: Stripe Webhook Failures

**Symptom:** Subscriptions не се активират

**Troubleshooting:**
1. Check Stripe Dashboard → Webhooks → Recent deliveries
2. Verify webhook secret matches .env
3. Check Vercel logs for errors
4. Manually retry failed webhooks

### Issue 3: Push Notifications Not Working

**Symptom:** Notifications не се изпращат

**Troubleshooting:**
1. Verify VAPID keys are set
2. Check browser permissions
3. Test with `/api/push/test` endpoint
4. Check Supabase logs

---

## 🎯 Success Metrics

### Technical

- Uptime > 99.9%
- API Response Time < 500ms (p95)
- Error Rate < 0.1%
- Build time < 2min

### Business

- User Registration Rate
- Onboarding Completion Rate > 80%
- Free → Paid Conversion > 5%
- Referral Conversion > 10%
- Monthly Active Users (MAU)
- Monthly Recurring Revenue (MRR)

---

## ✅ Final Pre-Launch Checklist

### Critical (Must Do)

- [ ] Generate VAPID keys
- [ ] Add VAPID keys to Vercel env
- [ ] Verify Resend domain vrachka.eu
- [ ] Update FROM_EMAIL to noreply@vrachka.eu
- [ ] Create OG image (1200x630)
- [ ] Switch Stripe to Live mode
- [ ] Update Stripe webhook to production URL
- [ ] Test full user journey (register → subscribe → referral)
- [ ] Verify all email templates work
- [ ] Test Stripe payment flow

### Recommended

- [ ] Add error.tsx component
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit
- [ ] Check console for errors
- [ ] Verify sitemap accessible
- [ ] Test PWA install

### Nice to Have

- [ ] Add env vars validation
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Add user preferences table
- [ ] Implement response caching

---

## 🚦 Launch Decision

### RED (Not Ready)

- Missing critical env vars
- Email domain not verified
- Stripe not configured
- Critical bugs in core flows

### YELLOW (Launch with Caution)

- Minor UI bugs
- Missing nice-to-have features
- Performance could be better
- Limited browser testing

### GREEN (Ready to Launch) ✅

- All critical features working
- Email domain verified
- Stripe configured and tested
- Full user journey tested
- No critical bugs

---

**Current Status: 🟡 YELLOW → 🟢 GREEN**

**Completed:**
1. ✅ VAPID keys (done locally, need Vercel)
2. ✅ OAuth providers removed (Google/Facebook)

**Still need:**
1. 🔴 Email domain verification (vrachka.eu)
2. 🟡 OG image (1200x630)
3. 🟡 Stripe Live mode switch

**→ ПОЧТИ ГОТОВ ЗА DEPLOY! 🚀**

---

**Prepared by:** Claude Code
**For:** Vrachka - vrachka.eu
**Version:** 1.0.0
