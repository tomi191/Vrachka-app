# Vrachka — Архитектура и Ориентация по Кода

Този документ дава практичен обзор на системата: технологии, структура, даннен модел, основни потоци и ключови интеграции (Supabase, Stripe, OpenRouter, PWA, cron). Полезен е за бързо запознаване и последователна работа по проекта.

## Технологии
- Next.js (App Router, TypeScript)
- TailwindCSS
- Supabase (Postgres, Auth, RLS, Edge Functions/cron през маршрути)
- Stripe (Checkout, Billing Portal, Webhooks)
- OpenRouter (AI агрегатор — хороскопи/оракул/таро)
- PWA (next-pwa) + Service Worker за push известия
- Vercel (деплой + cron задачи)

## Структура на Репото
- `app/`
  - `layout.tsx` — глобални метаданни, SEO и структурирани данни (BG локализация)
  - `auth/*` — login/register/forgot/reset/verify + layout
  - `api/*` — всички API маршрути (по-долу)
- `components/`
  - `ui/*` — шейд/базови UI компоненти (button, card, dialog, input, select, tabs, toast, и др.)
  - `landing/*` — лендинг секции (hero, features, testimonials, comparison)
  - `admin/*` — UI за админ панел (users/subscriptions/actions/reports)
  - фичъри: `TarotReading`, `OracleChat`, `HoroscopeCard`, навигация, нотификации
- `lib/`
  - `env.ts` — валидация на променливите на средата
  - `supabase/{client,server}.ts` — клиенти за браузър/сървър
  - `subscription/*` — логика за лимити и trial
  - `stripe.ts` + `stripe/*` — Stripe клиент и помощни (analytics, mode-detector)
  - `rate-limit.ts` — in-memory + DB-базиран адаптивен limiter (Supabase RPC)
  - `ai/*` — OpenRouter интеграции (prompts/комплети)
  - `utils/*`, `types.ts`, `zodiac.ts`, `sounds.ts` и помощни
- `supabase/`
  - `migrations/` — schema, RLS, функции, индекси, cron, и др.
  - `email-templates/` — системни имейл темплейти
- `public/` — assets (икони, таро изображения, og-image, манифест)
- `worker/` — custom service worker за push (bundle-ва се от next-pwa)

## API Маршрути (избрани)
- Плащания
  - `POST /api/checkout` — създава Stripe Checkout Session (централизирани планове/валути)
  - `POST /api/customer-portal` — линк към Stripe Billing Portal
  - `POST /api/webhooks/stripe` — обработка на Stripe webhooks (активиране/обновяване/анулиране)
- Фичъри
  - `POST /api/oracle` — AI оракул (premium), с IP rate limit и пер-юзър лимити
  - `POST /api/tarot` — таро четения (single/three-card/love/career)
  - `GET  /api/horoscope` — дневен/седмичен/месечен хороскоп + кеш в `daily_content`
- Push известия
  - `POST /api/push/subscribe` — записва Web Push subscription
  - `POST /api/push/unsubscribe`, `POST /api/push/test`
- Профил/аватар, нотификации, натална карта
  - `POST /api/profile/update`, `POST /api/profile/avatar`
  - `GET/POST /api/notifications/*`
  - `GET /api/natal-chart/list`, `POST /api/natal-chart/calculate`, `GET /api/natal-chart/[id]`
- Админ
  - `POST /api/admin/seed-tarot` — seed на таро карти
  - `POST /api/admin/subscriptions/*`, `POST /api/admin/users/*`
- Cron (Vercel)
  - `GET/POST /api/cron/generate-horoscopes` — генерира хороскопи (автоматизирано)
  - `GET/POST /api/cron/daily-horoscopes`, `trial-expiring`, `renewal-reminder`, `daily-reminders`, `weekly-digest`, `upsell-campaign`

## Данни и Схема (Supabase)
Основни таблици (виж миграциите в `supabase/migrations`):
- `profiles` — потребителски профили (zodiac, birth, avatar, onboarding)
- `subscriptions` — абонаменти (Stripe customer/subscription IDs, план, статус, период)
- `daily_content` — кеш/съдържание за хороскопи (дневен/седмичен/месечен)
- `tarot_cards` — таро карти (име, bg превод, тип, suit, значения)
- `oracle_conversations` — история на оракула (въпрос/отговор/токени/време)
- `api_usage_limits` — дневни лимити по user за oracle/tarot
- Реферална система: `referral_codes`, `referral_redemptions`
- Нотификации: in-app notifications таблици (виж `010_in_app_notifications.sql`)
- Роли и админ: `011_admin_roles.sql`
- Финанси/аналитика: `012_financial_tracking.sql` и `lib/stripe/analytics.ts`
- Натални карти: `016_natal_charts.sql`
- Блог: `20250124_create_blog_posts.sql`
- Cron: `20251024_setup_daily_horoscope_cron.sql`, `20251025_setup_additional_cron_jobs.sql`
- Rate limit (DB): `20251026_rate_limit_backend.sql` (таблица `rate_limits` + RPC `rate_limit_increment`)

RLS политики са дефинирани за потребителските таблици (self-access) и публично четене за някои (карти/съдържание) за `authenticated`.

## Поток на Плащане (Stripe)
- Checkout: `POST /api/checkout` → създава Session според план (`basic`/`ultimate`) и валута (`bgn`/`eur`) с централизирани Price IDs
- Webhook: `POST /api/webhooks/stripe` → активира/обновява абонамента в `subscriptions`, синхронизира аналитики, праща имейли
- Customer Portal: дава достъп за самостоятелно управление на абонамента

Цени и валути:
- Централизирани в `lib/config/plans.ts` (ползва `STRIPE_*_PRICE_ID_BGN|EUR`; с fallback към `STRIPE_*_PRICE_ID` за legacy env)

## Rate Limiting
- IP rate limit: `lib/rate-limit.ts` → `rateLimitAdaptive()` предпочита Supabase RPC `rate_limit_increment`, иначе in-memory
- Пер-юзър лимити: `lib/subscription.ts` + `api_usage_limits` (дневни лимити по план)

## PWA и Push
- `next-pwa` конфигурация в `next.config.js`
- Service Worker: `worker/index.js` (push events, click navigation, subscription refresh)
- API маршрути за subscribe/unsubscribe

## Безопасност
- Middleware: auth/онбординг/админ защита
- CSP заглавки в `next.config.js` (премахнато `'unsafe-eval'`, препоръчително е nonce за inline)
- RLS политики в базата; server-side действия ползват service role клиент

## Cron (Vercel)
- Файл `vercel.json` описва графика и пътищата; cron маршрутите са в `app/api/cron/*`

## Конфигурация и MCP
- ENV: виж `ENV_VARIABLES.md` и `.env.local` (локални ключове)
- MCP (Supabase): `mcp.json` подава `x-supabase-url` и `x-supabase-key` от env; виж `MCP_SUPABASE.md`

## Как да работим ефективно
- За фичър „платени планове“ — използвайте `PLAN_CONFIGS` и `getStripePriceIdForPlan`
- За хороскоп/оракул/таро — ползвайте AI слой от `lib/ai/*` и съществуващите API шаблони
- За нови таблици — добавете миграция в `supabase/migrations`, RLS и индекси
- За limits — предпочитайте DB limiter (`rateLimitAdaptive`) за консистентност
- За UI — спазвайте стила на `components/ui/*` и темата в Tailwind конфигурацията

---

Това е практическата карта на системата. Ако искаш, мога да добавя диаграма (mermaid) за потока на абонаменти и AI заявките, или скрипт за автоматизирана проверка на критични ENV/таблици.
