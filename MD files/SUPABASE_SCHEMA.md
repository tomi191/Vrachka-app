# Supabase Схема и Политики — Vrachka

Този документ обобщава таблиците, индексите, RLS политиките и ключовите функции, извлечени от миграциите в `supabase/migrations`.

## Обзор
- Auth огледало: използва се `auth.users` за референции.
- Основни домейни: профили, абонаменти, съдържание (хороскопи), таро, оракул, нотификации, реферали, финанси/аналитика, push, user preferences, натални карти, блог.
- RLS: self‑access за потребителски данни; service_role има пълен достъп за бекенд операции.

## Основни Таблици
- `profiles` (001_initial_schema.sql)
  - Ключови колони: `id (auth.users)`, `full_name`, `birth_date`, `zodiac_sign`, `avatar_url`, `onboarding_completed`, `daily_streak`.
  - Индекс/ограничения: PK(id).
  - RLS: потребителят вижда/вмъква/обновява само своя профил.
- `subscriptions` (001)
  - `user_id`, `stripe_customer_id`, `stripe_subscription_id`, `plan_type (free|basic|ultimate)`, `status`, периоди.
  - UNIQUE(user_id).
  - RLS: потребителят вижда своя абонамент.
- `daily_content` (001)
  - Кеш на съдържание: `content_type ('horoscope'|'weekly_horoscope'|'monthly_horoscope'|'tarot_daily_meaning')`, `target_date`, `target_key`, `content_body JSONB`.
  - UNIQUE(content_type, target_date, target_key), индекс за lookup.
  - RLS: `authenticated` могат да четат.
- `tarot_cards` (001)
  - Карти: `name`, `name_bg`, `card_type`, `suit`, `image_url`, `upright_meaning`, `reversed_meaning`.
  - RLS: `authenticated` могат да четат.
- `oracle_conversations` (001 + 018)
  - История: `user_id`, `question`, `answer`, `asked_at`, индекси по (user_id, asked_at DESC).
  - RLS: self‑read/insert; (018) забрана за UPDATE, позволено DELETE на собствени записи.
- `api_usage_limits` (001)
  - По user и ден: броячи за oracle/tarot.
  - PK(user_id, date). RLS: self read/insert/update.
- Реферали (001 + 014): `referral_codes`, `referral_redemptions`
  - `referral_codes`: UNIQUE(code), self‑view; service може insert; индекси за отчети (014).
  - `referral_redemptions`: връзка referrer↔referred, индекси и ограничения (014), политики за селект.
- `user_preferences` (006)
  - Нотификации/UX: `email_notifications`, `push_notifications`, `daily_reminders`, `weekly_digest`, `theme`, `language`.
  - UNIQUE(user_id), тригер за `updated_at`, RLS self‑access, helper `get_or_create_user_preferences(UUID)`.
- Push известия (004)
  - `push_subscriptions`: endpoint + ключове, `is_active`, индекси по `user_id`, `is_active`, `last_used_at`; RLS self‑access.
  - `push_notification_logs`: история на изпратени push‑ове; RLS self‑read; индекси.
  - Функции: `cleanup_old_push_subscriptions()`, `mark_subscription_inactive(endpoint)`.
- In‑app нотификации (010)
  - `notifications`: `type`, `title`, `message`, `link`, `read`; индекси (вкл. unread), RLS self; service insert.
  - Функции: `cleanup_old_notifications()`, `get_unread_notification_count(user_id)`, `mark_all_notifications_read(user_id)`.
- Финанси/Аналитика (012 + 014)
  - `ai_usage_logs`: логове за разходи по AI; индекси user/feature/time/cost; RLS admin‑view, service insert.
  - `stripe_webhook_events`: логове на уебхукове; индекси; RLS admin‑view, service insert/update (014).
  - `subscription_analytics`: време‑линия на абонаменти; индекси; RLS admin‑view, service manage.
  - `financial_snapshots`: дневни snapshot‑и (revenue/costs/MRR/ARR); индекси; RLS admin‑view, service manage.
  - Помощни функции: `calculate_ai_costs`, `calculate_mrr`, `get_active_subscription_count(plan)` и др.
- Натални карти (016)
  - `natal_charts`: `user_id`, birth_* полета, `birth_location JSONB`, `chart_data JSONB`, `interpretation JSONB`;
  - Индекси: по user, created_at, (user,birth_date,birth_time); RLS: self view/insert/delete; service_role: ALL.
  - Функции: `update_natal_charts_updated_at()` (тригер), `get_user_natal_chart_count(UUID)`, `can_create_natal_chart(UUID)` (Ultimate only).
- Блог (20250124)
  - `blog_posts` и индекси (виж миграцията `20250124_create_blog_posts.sql`).
- Cron/Jobs (20251024, 20251025)
  - Миграции за задачи и конфигурация на cron (описани в README_CRON_SETUP.md).
- Rate limiting (20251026)
  - `rate_limits` и RPC `rate_limit_increment(key, window_seconds, max_requests)` — използван от `rateLimitAdaptive()`.

## RLS Политики (извадка)
- Self‑access: `profiles`, `subscriptions`, `oracle_conversations` (select/insert + delete), `api_usage_limits`, `user_preferences`, `notifications` (update/delete self), `push_subscriptions`, `push_notification_logs`.
- Public‑read (authenticated): `daily_content`, `tarot_cards`.
- Admin‑view: финансови таблици (AI logs, webhooks, analytics, snapshots) чрез policy с `profiles.is_admin = true`.
- Service‑role: пълен достъп където е нужно (notifications insert, финансови manage, natal_charts all, др.).

## Индекси и Производителност
- Критични индекси: `idx_daily_content_lookup`, `idx_oracle_user_date`, индекси по user/read/time за notifications/push_logs, множество индекси за финансовите таблици.
- Индекси за натални карти: по user и време; комбиниран индекс за duplicate check.

## Функции / RPC (избрани)
- Preferences: `get_or_create_user_preferences(user_id)`
- Notifications: `get_unread_notification_count`, `mark_all_notifications_read`, `cleanup_old_notifications`
- Push: `cleanup_old_push_subscriptions`, `mark_subscription_inactive`
- Финанси: `calculate_ai_costs`, `calculate_mrr`, `get_active_subscription_count`
- Натални карти: `get_user_natal_chart_count`, `can_create_natal_chart`, тригер `update_natal_charts_updated_at`
- Rate limiting: `rate_limit_increment` (RPC)

## Как да извикваме през MCP (Supabase)
- MCP клиентът чете `mcp.json` и инжектира:
  - `x-supabase-url: ${NEXT_PUBLIC_SUPABASE_URL}`
  - `x-supabase-key: ${SUPABASE_SERVICE_ROLE_KEY}`
- Ползвайте предоставените инструменти за:
  - Списък на таблици/функции
  - Проверка на RLS политики и grants
  - Read‑only справки към таблици (внимание: service_role има пълни права — работете на доверена машина)

## Бележки
- Някои миграции (014) включват cleanup функции и индекси за аналитика; прегледайте `README_014_MIGRATION.md` за контекст и поредност.
- За промени по schema: добавяйте нова миграция, вкл. RLS и индекси. Не редактирайте старите миграции.
