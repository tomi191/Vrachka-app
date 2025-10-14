# Vrachka App - Deployment Checklist

## Pre-Deployment Checklist

### 1. Database Setup (Supabase)

- [ ] Supabase project е създаден
- [ ] Migrations са приложени (`001_initial_schema.sql`)
- [ ] RLS политики са активни
- [ ] Auth settings са конфигурирани:
  - [ ] Email confirmation: DISABLED (за development) или ENABLED (за production)
  - [ ] OAuth providers (Google, Facebook) са настроени
  - [ ] Site URL е добавен в Redirect URLs

### 2. Stripe Setup

- [ ] Stripe account е създаден
- [ ] Products са създадени:
  - [ ] Basic Plan (9.99 лв/месец)
  - [ ] Ultimate Plan (19.99 лв/месец)
- [ ] Webhook endpoint е добавен: `https://your-domain.vercel.app/api/webhooks/stripe`
- [ ] Webhook events са селектирани:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.paid`
  - `invoice.payment_failed`

### 3. OpenAI Setup

- [ ] OpenAI account е създаден
- [ ] API key е генериран
- [ ] Billing е настроен (минимум 5$ credit)
- [ ] Usage limits са настроени (за защита от свръхразход)

### 4. Environment Variables

Проверка че всички променливи са настроени в Vercel:

**Supabase:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxxx...
```

**OpenAI:**
```bash
OPENAI_API_KEY=sk-proj-xxxx
```

**Stripe:**
```bash
STRIPE_SECRET_KEY=sk_test_xxxx  # (production: sk_live_xxxx)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx  # (production: pk_live_xxxx)
STRIPE_WEBHOOK_SECRET=whsec_xxxx
STRIPE_BASIC_PRICE_ID=price_xxxx
STRIPE_ULTIMATE_PRICE_ID=price_yyyy
```

**App:**
```bash
NEXT_PUBLIC_URL=https://vrachka-app.vercel.app
NEXT_PUBLIC_APP_URL=https://vrachka-app.vercel.app
```

### 5. Vercel Deployment

- [ ] GitHub repository е свързан с Vercel
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`
- [ ] Install command: `npm install`
- [ ] Node.js version: 18.x или 20.x
- [ ] Environment variables са добавени в Vercel Dashboard

## Post-Deployment Steps

### 1. Seed Tarot Cards (ЗАДЪЛЖИТЕЛНО!)

Едно-кратна операция след първи deploy:

```bash
curl -X POST https://vrachka-app.vercel.app/api/admin/seed-tarot
```

Проверка че са seed-нати:

```bash
curl https://vrachka-app.vercel.app/api/admin/seed-tarot
```

Очакван резултат:
```json
{
  "seeded": true,
  "count": 22,
  "cards": [...]
}
```

### 2. Test Core Functionality

**Authentication:**
- [ ] Register работи
- [ ] Login работи
- [ ] OAuth (Google/Facebook) работи
- [ ] Logout работи
- [ ] Onboarding flow работи

**Dashboard:**
- [ ] Horoscope се зарежда с AI
- [ ] Stars и lucky numbers се показват
- [ ] Links към Tarot и Pricing работят

**Tarot:**
- [ ] Card of the Day работи (free users)
- [ ] AI интерпретация се генерира
- [ ] Premium spreads са locked за free users
- [ ] Rate limiting работи

**Oracle (Premium):**
- [ ] Free users виждат lock screen
- [ ] Premium users могат да задават въпроси
- [ ] AI отговаря правилно
- [ ] Rate limiting работи (3/day Basic, 10/day Ultimate)
- [ ] Conversation history се показва

**Payments:**
- [ ] Pricing page показва цените
- [ ] Checkout процес работи
- [ ] Webhook получава events
- [ ] Subscription се активира в database
- [ ] Customer Portal работи
- [ ] Subscription се update-ва/cancel-ва

**Admin:**
- [ ] Admin dashboard работи (нужен admin user)
- [ ] Content management работи
- [ ] Users списък работи
- [ ] Subscriptions преглед работи

### 3. Performance Check

- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] No console errors

### 4. SEO & Metadata

- [ ] OG images работят
- [ ] Metadata е правилен на всички страници
- [ ] Sitemap се генерира
- [ ] robots.txt е правилен

### 5. Mobile Testing

- [ ] iOS Safari работи
- [ ] Android Chrome работи
- [ ] Bottom navigation работи правилно
- [ ] Touch interactions работят
- [ ] Responsive design е ОК на всички екрани

## Production URLs

- **App:** https://vrachka-app.vercel.app
- **Supabase:** https://xxxxx.supabase.co
- **Stripe Dashboard:** https://dashboard.stripe.com

## Troubleshooting

### Build Fails

**Problem:** Build fails с "Cannot find module"
**Solution:** Check package.json dependencies, run `npm install`

**Problem:** Build fails с TypeScript errors
**Solution:** Run `npm run type-check` локално

**Problem:** Build timeout
**Solution:** Check за безкрайни fetch loops в Server Components

### Horoscope Not Loading

**Problem:** Horoscope не се зарежда
**Solution:**
1. Check OpenAI API key в environment variables
2. Check Supabase connection
3. Check OpenAI billing credits
4. Check console за errors

### Tarot Cards Missing

**Problem:** "Failed to load tarot cards"
**Solution:**
1. Seed cards: `POST /api/admin/seed-tarot`
2. Check Supabase RLS policies
3. Check tarot_cards table има данни

### Payments Not Working

**Problem:** Checkout не работи
**Solution:**
1. Check Stripe keys (test vs live)
2. Check webhook endpoint е добавен в Stripe
3. Check NEXT_PUBLIC_APP_URL е правилен
4. Check Stripe price IDs са correct

### Oracle Not Responding

**Problem:** Oracle не генерира отговори
**Solution:**
1. Check user е premium
2. Check rate limiting не е достигнат
3. Check OpenAI API key
4. Check console за errors

## Monitoring

### Daily Checks

- [ ] Check Vercel analytics за errors
- [ ] Check Supabase dashboard за DB health
- [ ] Check OpenAI usage dashboard
- [ ] Check Stripe dashboard за payments

### Weekly Checks

- [ ] Review user feedback
- [ ] Check API costs (OpenAI)
- [ ] Check database size
- [ ] Review error logs

## Rollback Plan

Ако има критичен bug в production:

1. **Instant rollback в Vercel:**
   - Go to Deployments
   - Find last working deployment
   - Click "Promote to Production"

2. **Database rollback (ако е нужен):**
   - Supabase има automatic backups
   - Restore от backup ако е критично

3. **Notification:**
   - Съобщи на users за downtime
   - Fix bug локално
   - Test преди re-deploy

## Success Criteria

Deployment е успешен когато:

- [ ] Build минава без грешки
- [ ] Всички environment variables са настроени
- [ ] Tarot cards са seed-нати
- [ ] Authentication работи
- [ ] AI features работят (horoscope, oracle, tarot)
- [ ] Payments работят
- [ ] No critical console errors
- [ ] Mobile experience е добър
- [ ] Performance е добър (Lighthouse > 90)

## Support

За въпроси и проблеми:
- GitHub Issues: https://github.com/tomi191/Vrachka-app/issues
- Email: support@vrachka.com
