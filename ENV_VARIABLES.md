# Environment Variables Documentation

Пълно ръководство за всички environment variables в Vrachka App.

## Table of Contents

1. [Supabase Configuration](#supabase-configuration)
2. [OpenAI Configuration](#openai-configuration)
3. [Stripe Configuration](#stripe-configuration)
4. [App Configuration](#app-configuration)
5. [Setup Instructions](#setup-instructions)

---

## Supabase Configuration

### `NEXT_PUBLIC_SUPABASE_URL`

**Описание:** Public URL на твоя Supabase project
**Тип:** Public (visible in browser)
**Пример:** `https://xxxxxxxxxxxxx.supabase.co`
**Къде да го вземеш:**
1. Отвори Supabase Dashboard
2. Settings → API
3. Copy "Project URL"

**Използва се за:**
- Client-side Supabase queries
- Authentication
- Real-time subscriptions

---

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Описание:** Public anonymous key за Supabase
**Тип:** Public (visible in browser)
**Пример:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
**Къде да го вземеш:**
1. Supabase Dashboard → Settings → API
2. Copy "anon public" key

**Използва се за:**
- Client-side authentication
- Row Level Security (RLS) enforcement
- Public API access

**Важно:**
- Този key е safe да бъде public
- RLS policies защитават data-та

---

### `SUPABASE_SERVICE_ROLE_KEY`

**Описание:** Service role key за server-side операции
**Тип:** **SECRET** (never expose in browser!)
**Пример:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
**Къде да го вземеш:**
1. Supabase Dashboard → Settings → API
2. Copy "service_role secret" key

**Използва се за:**
- Server-side queries
- Admin operations
- Bypass RLS when needed

**Важно:**
- НИКОГА не го expose-вай в client code!
- Само за server-side routes (API routes, Server Components)

---

## AI Provider Configuration (OpenRouter)

### `OPENROUTER_API_KEY`

**Описание:** API key за OpenRouter (cost-effective AI aggregator)
**Тип:** **SECRET**
**Пример:** `sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxx`
**Къде да го вземеш:**
1. Отвори https://openrouter.ai
2. Sign up / Login
3. Go to Keys → Create new API key
4. Copy key

**Използва се за:**
- Horoscope generation (`/api/horoscope`)
- Oracle AI responses (`/api/oracle`)
- Tarot interpretations (`/api/tarot`)

**Model:** `openai/gpt-4.1-mini`

**Cost & Billing:**
- OpenRouter е много по-евтин от директно OpenAI
- No upfront payment needed
- Pay only for what you use
- Average cost: ~$0.001-0.003 per request (10x по-евтино!)
- $5 credit е достатъчно за 1500+ requests

**Важно:**
- Много по-евтино от директно OpenAI API
- Същото качество на GPT-4
- Automatic failover between providers
- Monitor usage в https://openrouter.ai/activity

---

## Stripe Configuration

### `STRIPE_SECRET_KEY`

**Описание:** Secret key за Stripe API
**Тип:** **SECRET**
**Пример:** `sk_test_51A...` (test) или `sk_live_51A...` (production)
**Къде да го вземеш:**
1. Stripe Dashboard → Developers → API keys
2. Copy "Secret key"

**Използва се за:**
- Creating checkout sessions
- Managing subscriptions
- Webhook verification

**Важно:**
- Test mode: `sk_test_...`
- Live mode: `sk_live_...`
- Използвай test key за development!

---

### `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Описание:** Public Stripe key
**Тип:** Public
**Пример:** `pk_test_51A...` (test) или `pk_live_51A...` (production)
**Къде да го вземеш:**
1. Stripe Dashboard → Developers → API keys
2. Copy "Publishable key"

**Използва се за:**
- Client-side Stripe.js initialization
- Payment forms

---

### `STRIPE_WEBHOOK_SECRET`

**Описание:** Webhook signing secret
**Тип:** **SECRET**
**Пример:** `whsec_xxxxxxxxxxxxxxxxxxxxxxxx`
**Къде да го вземеш:**
1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Copy "Signing secret"

**Използва се за:**
- Verifying webhook authenticity
- Preventing webhook spoofing

**Важно:**
- Различен за test и live mode!
- Различен за всеки webhook endpoint!

---

### `STRIPE_BASIC_PRICE_ID`

**Описание:** Price ID за Basic plan
**Тип:** Public (но по-добре като secret)
**Пример:** `price_xxxxxxxxxxxxxxxxxxxxxxxx`
**Къде да го вземеш:**
1. Stripe Dashboard → Products
2. Create product "Basic Plan - 9.99 лв/месец"
3. Copy Price ID от Pricing section

**Използва се за:**
- Checkout sessions за Basic plan
- Subscription creation

---

### `STRIPE_ULTIMATE_PRICE_ID`

**Описание:** Price ID за Ultimate plan
**Тип:** Public (но по-добре като secret)
**Пример:** `price_yyyyyyyyyyyyyyyyyyyyyyyy`
**Къде да го вземеш:**
1. Stripe Dashboard → Products
2. Create product "Ultimate Plan - 19.99 лв/месец"
3. Copy Price ID

**Използва се за:**
- Checkout sessions за Ultimate plan
- Subscription creation

---

## App Configuration

### `NEXT_PUBLIC_URL`

**Описание:** Base URL на приложението
**Тип:** Public
**Пример:**
- Development: `http://localhost:3000`
- Production: `https://vrachka-app.vercel.app`

**Използва се за:**
- Absolute URLs в metadata
- OG images
- Sitemap generation

---

### `NEXT_PUBLIC_APP_URL`

**Описание:** Same като NEXT_PUBLIC_URL (за legacy compatibility)
**Тип:** Public
**Пример:** Same като NEXT_PUBLIC_URL

**Използва се за:**
- Stripe redirect URLs (success_url, cancel_url)
- Customer portal return_url

**Важно:**
- Трябва да е същият като NEXT_PUBLIC_URL
- Променяй го когато deploy-ваш

---

## Setup Instructions

### Local Development

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Fill in all values:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxxx...

# OpenRouter (AI Provider)
OPENROUTER_API_KEY=sk-or-v1-xxxx

# Stripe (use TEST keys!)
STRIPE_SECRET_KEY=sk_test_xxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx
STRIPE_BASIC_PRICE_ID=price_xxxx
STRIPE_ULTIMATE_PRICE_ID=price_yyyy

# App
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Start development server:
```bash
npm run dev
```

---

### Vercel Production

1. Отвори Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add all variables:

**For Production:**
- Use LIVE Stripe keys (`sk_live_...`, `pk_live_...`)
- Use production webhook secret
- Set URLs to production domain

**Environment:** Production

**Example:**
```
NEXT_PUBLIC_URL = https://vrachka-app.vercel.app
NEXT_PUBLIC_APP_URL = https://vrachka-app.vercel.app
```

5. Redeploy за да вземат effect

---

## Security Best Practices

### DO:
- Keep SECRET keys в `.env.local` (gitignored)
- Use test keys в development
- Rotate keys периодично
- Monitor OpenRouter usage
- Monitor Stripe webhooks

### DON'T:
- Commit `.env.local` в Git
- Share secret keys
- Use production keys в development
- Expose `SUPABASE_SERVICE_ROLE_KEY` в browser
- Skip webhook signature verification

---

## Verification Checklist

След setup, провери:

- [ ] `npm run dev` стартира без errors
- [ ] Login работи (Supabase auth)
- [ ] Dashboard показва horoscope (OpenRouter AI)
- [ ] Checkout работи (Stripe)
- [ ] Webhooks получават events (Stripe dashboard)
- [ ] No console errors
- [ ] Environment variable warnings в terminal

---

## Troubleshooting

### "OpenRouter API key not configured"
**Problem:** OPENROUTER_API_KEY липсва или е грешен
**Solution:** Check `.env.local` или Vercel environment variables. Get key from https://openrouter.ai

### "Failed to create checkout session"
**Problem:** Stripe keys или price IDs са грешни
**Solution:**
1. Verify STRIPE_SECRET_KEY
2. Verify STRIPE_BASIC_PRICE_ID и STRIPE_ULTIMATE_PRICE_ID
3. Check Stripe dashboard за correct product IDs

### "Webhook signature verification failed"
**Problem:** STRIPE_WEBHOOK_SECRET е грешен
**Solution:**
1. Check webhook endpoint в Stripe
2. Copy correct signing secret
3. Redeploy

### "Supabase: No API key found"
**Problem:** Supabase keys липсват
**Solution:**
1. Check `.env.local`
2. Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
3. Restart dev server

### "Build fails on Vercel"
**Problem:** Environment variables не са настроени
**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Add ALL required variables
3. Set environment to "Production"
4. Redeploy

---

## Support

За въпроси относно environment variables:
- Check DEPLOYMENT.md за deployment checklist
- Check README.md за setup instructions
- Open GitHub issue ако имаш проблем
