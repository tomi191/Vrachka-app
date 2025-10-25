# Environment Variables — Vrachka

Този документ описва всички ключови променливи на средата за приложението Vrachka и как да ги конфигурирате.

## Supabase

- `NEXT_PUBLIC_SUPABASE_URL` — Публичният URL на Supabase проекта (public)
  - Пример: `https://xxxxxxxxxxxxx.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Публичният anon ключ (public)
  - Пример: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- `SUPABASE_SERVICE_ROLE_KEY` — Service role ключ за сървърни операции (SECRET)
  - Никога не го излагайте в клиентския код.

## AI Provider (OpenRouter)

- `OPENROUTER_API_KEY` — API ключ за OpenRouter (SECRET)
  - Използва се за хороскопи, оракул и таро.
  - Модел по подразбиране: `openai/gpt-4.1-mini` (или друг, според плана).

## Stripe

- `STRIPE_SECRET_KEY` — Секретен ключ за Stripe (SECRET)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Публичен ключ за Stripe (public)
- `STRIPE_WEBHOOK_SECRET` — Signing secret за webhook-и (SECRET)

Мултивалута (BGN/EUR) — задайте и за двата плана и валути:

- `STRIPE_BASIC_PRICE_ID_BGN`
- `STRIPE_BASIC_PRICE_ID_EUR`
- `STRIPE_ULTIMATE_PRICE_ID_BGN`
- `STRIPE_ULTIMATE_PRICE_ID_EUR`

Тези ключове се използват в:
- `lib/config/plans.ts`
- `app/api/checkout/route.ts`

## Push Notifications (по избор)

- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`

## App URLs

- `NEXT_PUBLIC_APP_URL` — Публичният URL на приложението (използва се за OG/SEO, линкове, редиректи)
  - Пример: `https://www.vrachka.eu`
- `NEXT_PUBLIC_URL` — Резервен URL (по избор)

## Настройка (локално и Vercel)

1. Създайте `.env.local` за локална разработка и попълнете ключовете по-горе.
2. Във Vercel → Project Settings → Environment Variables добавете същите ключове за `Preview` и `Production`.
3. Потвърдете, че билдът минава и `lib/env.ts` не хвърля грешки за липсващи ключове.

## Проверка и отстраняване на проблеми

- Ако плащанията не работят: проверете `STRIPE_*` ключовете и webhook секрета; вижте логовете на `/api/webhooks/stripe`.
- Ако хороскопите/оракулът не работят: проверете `OPENROUTER_API_KEY` и баланс/лимити в OpenRouter.
- Ако Supabase заявки падат: валидирайте `NEXT_PUBLIC_SUPABASE_*` и `SUPABASE_SERVICE_ROLE_KEY` (само сървърно).

