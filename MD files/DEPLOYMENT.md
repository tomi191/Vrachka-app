# Vrachka — Ръководство за Деплой

## Преди Деплой

### 1) База данни (Supabase)
- Създайте проект в Supabase.
- Пуснете миграциите в `supabase/migrations` по ред (001 → ...).
- Активирайте RLS и проверете политиките за таблиците.
- Конфигурирайте Auth: email confirmation ENABLED в production.

### 2) Stripe
- Настройте продукти/цени за плановете:
  - Basic (BGN/EUR)
  - Ultimate (BGN/EUR)
- Настройте webhook endpoint: `https://<domain>/api/webhooks/stripe`
- Активирайте следните събития:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.paid`
  - `invoice.payment_failed`

### 3) OpenRouter
- Създайте акаунт и API ключ.
- Уверете се, че имате наличен кредит/лимити.

### 4) Променливи на средата
Конфигурирайте следните ключове (локално и във Vercel):

Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxxx...
```

OpenRouter:
```
OPENROUTER_API_KEY=sk-or-v1-xxxx
```

Stripe:
```
STRIPE_SECRET_KEY=sk_live_xxxx (или sk_test_xxxx)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxx (или pk_test_xxxx)
STRIPE_WEBHOOK_SECRET=whsec_xxxx
STRIPE_BASIC_PRICE_ID_BGN=price_xxxx
STRIPE_BASIC_PRICE_ID_EUR=price_xxxx
STRIPE_ULTIMATE_PRICE_ID_BGN=price_yyyy
STRIPE_ULTIMATE_PRICE_ID_EUR=price_yyyy
```

App URLs:
```
NEXT_PUBLIC_APP_URL=https://www.vrachka.eu
```

PWA Push (по избор):
```
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
```

## Деплой във Vercel
- Build: `npm run build`
- Install: `npm install`
- Node.js: 20.x
- Output: `.next`
- Добавете Cron задачи в `vercel.json` (виж по-долу).

## След Деплой

### 1) Seed на таро карти
```
curl -X POST https://<domain>/api/admin/seed-tarot
```

### 2) Тестване
- Auth: регистрация/вход/изход, onboarding
- Dashboard: хороскопи, линкове
- Tarot: карта на деня, премиум разтвори (заключени за free)
- Oracle: лимити по план, история на разговорите
- Плащания: pricing → checkout → webhook → subscription status
- Admin: достъп, табла, действия

### 3) Производителност и SEO
- Lighthouse > 90, без грешки в конзолата
- OG/Twitter изображения, sitemap, robots

## Cron задачи (Vercel)
В `vercel.json` опишете нужните маршрути и график. Пример:
```
{
  "crons": [
    { "path": "/api/cron/generate-horoscopes", "schedule": "0 6 * * *" },
    { "path": "/api/cron/trial-expiring", "schedule": "0 9 * * *" },
    { "path": "/api/cron/daily-reminders", "schedule": "0 8 * * *" },
    { "path": "/api/cron/renewal-reminder", "schedule": "0 10 * * *" },
    { "path": "/api/cron/weekly-digest", "schedule": "0 7 * * 1" },
    { "path": "/api/cron/upsell-campaign", "schedule": "0 12 * * 5" }
  ]
}
```

## Забележки за сигурност
- Минимизирайте inline скриптовете; използвайте nonce/hash където е възможно.
- Съхранявайте секрети само на сървър (никога в публичен код).
- За rate limiting в production използвайте Redis/Upstash или Supabase вместо in‑memory имплементация.

