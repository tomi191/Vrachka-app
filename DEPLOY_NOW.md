# 🚀 DEPLOY TO PRODUCTION - STEP BY STEP

**Date:** 2025-10-20
**Status:** READY TO DEPLOY ✅

---

## ✅ Pre-Deployment Checklist (DONE)

- ✅ Email domain updated to `noreply@vrachka.eu`
- ✅ VAPID keys generated and added locally
- ✅ OAuth providers removed (Google/Facebook)
- ✅ Referral system fully working
- ✅ All database migrations applied
- ✅ OG image fallback set (using icon-512.png)
- ✅ Stripe in Test mode (as requested)

---

## 🎯 DEPLOYMENT STEPS

### Step 1: Build Locally (Test)

```bash
cd D:\AI AGENT SUPPORTER\Vrachka-app\vrachka

# Type check
npm run type-check

# Build
npm run build

# Test production build locally
npm run start
```

**Expected:** No errors, app runs on http://localhost:3000

---

### Step 2: Install Vercel CLI

```bash
# Install globally
npm i -g vercel

# Login to Vercel
vercel login
```

**Expected:** Browser opens, you login with your Vercel account

---

### Step 3: Link Project

```bash
# In project directory
vercel link
```

**Questions:**
- Set up and deploy "~/vrachka"? **Y**
- Which scope? Select your account
- Link to existing project? **N** (or **Y** if already created)
- What's your project's name? **vrachka**
- In which directory is your code located? **./** (press Enter)

---

### Step 4: Add Environment Variables

**Option A: Via Vercel CLI** (Recommended)

```bash
# Get all values from your .env.local file!

# Supabase
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your NEXT_PUBLIC_SUPABASE_URL from .env.local

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your NEXT_PUBLIC_SUPABASE_ANON_KEY from .env.local

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Paste your SUPABASE_SERVICE_ROLE_KEY from .env.local

# OpenRouter
vercel env add OPENROUTER_API_KEY
# Paste your OPENROUTER_API_KEY from .env.local

# Resend
vercel env add RESEND_API_KEY
# Paste your RESEND_API_KEY from .env.local

# Stripe (TEST MODE)
vercel env add STRIPE_SECRET_KEY
# Paste your STRIPE_SECRET_KEY from .env.local

vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# Paste your NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY from .env.local

vercel env add STRIPE_WEBHOOK_SECRET
# Paste your STRIPE_WEBHOOK_SECRET from .env.local

vercel env add STRIPE_BASIC_PRICE_ID
# Paste your STRIPE_BASIC_PRICE_ID from .env.local

vercel env add STRIPE_ULTIMATE_PRICE_ID
# Paste your STRIPE_ULTIMATE_PRICE_ID from .env.local

# App URL
vercel env add NEXT_PUBLIC_APP_URL
# Paste: https://vrachka.eu

# VAPID Keys (from .env.local)
vercel env add NEXT_PUBLIC_VAPID_PUBLIC_KEY
# Paste your NEXT_PUBLIC_VAPID_PUBLIC_KEY from .env.local

vercel env add VAPID_PUBLIC_KEY
# Paste your VAPID_PUBLIC_KEY from .env.local

vercel env add VAPID_PRIVATE_KEY
# Paste your VAPID_PRIVATE_KEY from .env.local
```

**IMPORTANT:** For each variable, select:
- Environment: **Production, Preview, Development** (select all)

**Option B: Via Vercel Dashboard**

1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add all variables from above (one by one)

---

### Step 5: Deploy Preview

```bash
# Deploy to preview first
vercel
```

**Expected:**
- Vercel builds the project
- Returns a preview URL: https://vrachka-xxxxx.vercel.app

**Test the preview:**
1. Open the preview URL
2. Test registration
3. Test login
4. Test basic functionality

---

### Step 6: Deploy to Production

```bash
# Deploy to production
vercel --prod
```

**Expected:**
- Vercel builds for production
- Deploys to https://vrachka.vercel.app (or your custom domain)

---

### Step 7: Configure Custom Domain

**In Vercel Dashboard:**

1. Go to Project Settings → Domains
2. Add Domain: **vrachka.eu**
3. Add Domain: **www.vrachka.eu**
4. Vercel will show DNS configuration

**Update DNS (at your domain registrar):**

For **vrachka.eu**:
```
Type: A
Name: @
Value: 76.76.21.21
```

For **www.vrachka.eu**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Wait:** 10-30 minutes for DNS propagation

**Verify:** Vercel will auto-verify and issue SSL certificate

---

### Step 8: Update Supabase URLs

Go to Supabase Dashboard → Authentication → URL Configuration

**Site URL:**
```
https://vrachka.eu
```

**Redirect URLs (Add these):**
```
https://vrachka.eu/auth/callback
https://vrachka.eu/**
https://www.vrachka.eu/auth/callback
https://www.vrachka.eu/**
```

---

### Step 9: Update Stripe Webhook (PRODUCTION READY)

**Current Status:** Using TEST mode webhook

**When ready to switch to LIVE:**

1. Stripe Dashboard → Developers → Webhooks
2. Click **"Add endpoint"**
3. Endpoint URL: `https://vrachka.eu/api/webhooks/stripe`
4. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy **Signing secret**
6. Update `STRIPE_WEBHOOK_SECRET` in Vercel env vars

---

### Step 10: Post-Deployment Tests

**Critical User Flows:**

- [ ] Home page loads
- [ ] Register new user (email + password)
- [ ] Verify email received (check spam)
- [ ] Complete onboarding
- [ ] View dashboard
- [ ] Generate horoscope
- [ ] Tarot reading works
- [ ] Oracle chat works (Premium only)
- [ ] Create referral code
- [ ] Register with referral code
- [ ] Subscribe to Basic plan (Test mode)
- [ ] Verify Stripe webhook fires
- [ ] Check subscription in dashboard
- [ ] Referrer receives 7-day Ultimate reward
- [ ] Push notification subscription works
- [ ] Profile settings work
- [ ] Logout/Login works

**Performance:**

- [ ] Lighthouse score > 85
- [ ] First load < 3s
- [ ] No console errors
- [ ] All images load
- [ ] PWA installable

---

## 🔍 Monitoring After Launch

### Check These Dashboards Daily (First Week):

1. **Vercel Dashboard**
   - Functions → Logs
   - Analytics → Page views
   - Speed Insights

2. **Supabase Dashboard**
   - Logs → Recent queries
   - Database → Connection pooling
   - Auth → Users count

3. **Stripe Dashboard**
   - Payments → All payments
   - Webhooks → Recent deliveries
   - Test mode vs Live mode

4. **Resend Dashboard**
   - Emails → Recent sends
   - Bounces / Spam reports

---

## 🐛 Common Issues & Solutions

### Issue: Build fails with env var error

**Solution:**
```bash
# Check all env vars are set
vercel env ls

# Pull env vars locally for testing
vercel env pull .env.local
```

### Issue: Emails not sending

**Check:**
1. RESEND_API_KEY is correct
2. Domain vrachka.eu is verified in Resend
3. FROM_EMAIL = 'Vrachka <noreply@vrachka.eu>'
4. Check Resend Dashboard → Logs

### Issue: Stripe webhook not firing

**Check:**
1. Webhook URL is correct: https://vrachka.eu/api/webhooks/stripe
2. STRIPE_WEBHOOK_SECRET matches Stripe dashboard
3. Events are selected correctly
4. Check Stripe Dashboard → Webhooks → Recent deliveries

### Issue: Database connection errors

**Check:**
1. SUPABASE_SERVICE_ROLE_KEY is correct
2. Supabase project is not paused
3. Check Supabase Dashboard → Logs

### Issue: Push notifications not working

**Check:**
1. All 3 VAPID keys are set in Vercel
2. Browser permissions granted
3. HTTPS enabled (required for push)
4. Check browser console for errors

---

## 📊 Success Metrics

**First 24 Hours:**
- ✅ Site is accessible
- ✅ No 500 errors
- ✅ At least 1 successful registration
- ✅ At least 1 email sent
- ✅ No critical bugs

**First Week:**
- Registrations > 10
- Email delivery rate > 95%
- Uptime > 99%
- Average response time < 500ms

**First Month:**
- Active users > 100
- Free → Paid conversion > 1%
- Referral redemption rate > 5%

---

## 🎉 FINAL PRE-LAUNCH CHECKLIST

Before running `vercel --prod`:

- [ ] `npm run build` succeeds locally
- [ ] All env vars added to Vercel
- [ ] Email domain verified (vrachka.eu)
- [ ] Supabase URL config updated
- [ ] Tested preview deployment
- [ ] DNS records configured
- [ ] Ready to monitor dashboards

---

## 🚀 DEPLOY COMMAND

When ready:

```bash
# Final production deploy
vercel --prod
```

**Then:**

1. Open https://vrachka.eu
2. Test full user journey
3. Monitor all dashboards
4. Celebrate! 🎉

---

**Good luck with your launch! 🌟**

---

## 📝 Notes

- Stripe is in TEST mode (as requested)
- OG image is using icon-512.png (create proper 1200x630 later)
- All critical features are working
- Email system ready with vrachka.eu domain
- Push notifications ready with VAPID keys
- Referral system fully functional

**To switch Stripe to LIVE mode later:**
1. Replace STRIPE_SECRET_KEY with sk_live_...
2. Replace STRIPE_PUBLISHABLE_KEY with pk_live_...
3. Update STRIPE_WEBHOOK_SECRET with production webhook
4. Update STRIPE_BASIC_PRICE_ID and STRIPE_ULTIMATE_PRICE_ID with live prices

---

**Prepared by:** Claude Code
**For:** Vrachka - vrachka.eu
**Version:** 1.0.0 - Production Ready
