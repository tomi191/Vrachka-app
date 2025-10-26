# Rate Limiting (Production)

Текущата имплементация (`lib/rate-limit.ts`) е in‑memory и не е подходяща за serverless/множество инстанции.

Препоръчителни подходи:

- Upstash Redis (минимални промени):
  - Добавете зависимост `@upstash/redis` и ключове: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
  - Имплементирайте брояч с ключ по `identifier` и TTL = `interval`.
- Supabase (SQL базирано):
  - Таблица `rate_limits(id, key, window_end_at, count)` + индекс по `(key)`.
  - RPC/функция за атомарно инкрементиране и проверка.

Съвети:
- Винаги връщайте хедъри `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`.
- Разделяйте по endpoint (oracle/tarot/horoscope/auth) за по-гъвкаво управление.
- Логвайте отказите (429) за наблюдение.
