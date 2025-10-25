# Vrachka API Playbook

Кратки, практични примери за тестване на основните API маршрути. Примерите са насочени към разработчици и QA.

## Предварителни бележки
- Базов URL: `export BASE_URL="http://localhost:3005"` (или продакшън домейн)
- Повечето защитени маршрути изискват Supabase сесия (cookies). За тестване извън браузър:
  - Използвайте сесийните cookies от браузър DevTools (sb-access-token / sb-refresh-token) и ги подайте в `-H "Cookie: ..."`.
  - Пример: `-H "Cookie: sb-access-token=...; sb-refresh-token=..."`
- Rate limiting: на 429 ще получите `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`.
- Състояния на грешки: 400 (invalid input), 401 (unauthorized), 403 (forbidden/premium only), 429 (rate limit), 500 (server error).

## Плащания (Stripe)

### Checkout (Subscription)
- Път: `POST /api/checkout`
- Тяло: `multipart/form-data`
- Полета:
  - `priceId` = `basic` | `ultimate`
  - `currency` = `bgn` | `eur` (по подразбиране `bgn`)

Пример:
```
curl -i -X POST "$BASE_URL/api/checkout" \
  -H "Cookie: sb-access-token=...; sb-refresh-token=..." \
  -F priceId=basic \
  -F currency=bgn
```
Отговор:
```
HTTP/1.1 200 OK
{"url":"https://checkout.stripe.com/c/session_..."}
```

### Customer Portal
- Път: `POST /api/customer-portal`

Пример:
```
curl -i -X POST "$BASE_URL/api/customer-portal" \
  -H "Cookie: sb-access-token=...; sb-refresh-token=..."
```

### Stripe Webhooks (локално)
- Слушане:
```
stripe listen --forward-to "$BASE_URL/api/webhooks/stripe"
```

## Хороскопи

### Генериране/вземане на хороскоп
- Път: `GET /api/horoscope`
- Параметри:
  - `zodiac` = oven|telec|bliznaci|rak|lav|deva|vezni|skorpion|strelec|kozirog|vodolej|ribi
  - `period` = `daily` | `weekly` | `monthly` (седмичен/месечен изисква платен план)

Пример:
```
curl -i "$BASE_URL/api/horoscope?zodiac=deva&period=daily" \
  -H "Cookie: sb-access-token=...; sb-refresh-token=..."
```
Отговор: JSON с полета `general`, `love`, `career`, `health`, `advice`, звезди и късметлийски числа.

## Таро

### Четене
- Път: `POST /api/tarot`
- Тяло (JSON):
  - `spreadType` = `single` | `three-card` | `love` | `career`
  - `question` = свободен текст (по избор за някои разтвори)

Пример (единична карта):
```
curl -i -X POST "$BASE_URL/api/tarot" \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=...; sb-refresh-token=..." \
  -d '{"spreadType":"single","question":"Как да започна седмицата?"}'
```

Premium разтвори (`three-card`, `love`, `career`) изискват Basic/Ultimate (или Ultimate за някои), иначе 403.

## Оракул (AI)

### Въпрос към оракул
- Път: `POST /api/oracle`
- Тяло (JSON): `{ "question": "...", "conversation_id": "..." }` (conversation_id по избор за контекст)

Пример:
```
curl -i -X POST "$BASE_URL/api/oracle" \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=...; sb-refresh-token=..." \
  -d '{"question":"Ще имам ли успех в проекта тази седмица?"}'
```

Лимити: Basic (3/ден), Ultimate (10/ден). При изчерпване: 429 с пояснение.

## Push Известия

### Абонамент (subscribe)
- Път: `POST /api/push/subscribe`
- Тяло (JSON): `{ subscription: PushSubscriptionJSON, userAgent?: string }`

Пример:
```
curl -i -X POST "$BASE_URL/api/push/subscribe" \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=...; sb-refresh-token=..." \
  -d '{"subscription":{"endpoint":"https://fcm.googleapis.com/fcm/send/...","keys":{"p256dh":"...","auth":"..."}},"userAgent":"Mozilla/5.0"}'
```

### Отписване (unsubscribe)
- Път: `POST /api/push/unsubscribe`
- Тяло: `{ endpoint: string }`

### Тест
- Път: `POST /api/push/test` (само за оторизирани; изпраща тестово известие към текущия потребител)

## Профил и Настройки

### Обновяване на профил
- Път: `POST /api/profile/update`
- Тяло: FormData или JSON според имплементацията (виж файла)

### Качване на аватар
- Път: `POST /api/profile/avatar`
- Тяло: `multipart/form-data` с поле `file`

## Нотификации (in-app)

### Брой непрочетени
- Път: `GET /api/notifications/count`
```
curl -i "$BASE_URL/api/notifications/count" \
  -H "Cookie: sb-access-token=...; sb-refresh-token=..."
```

### Списък / Маркиране като прочетени
- Пътища: виж `app/api/notifications/*` (list, mark-read)

## Натална Карта

### Създаване
- Път: `POST /api/natal-chart/calculate`
- Тяло (JSON): birth данни (дата/час/локация). Нужен Ultimate план.

### Списък
- Път: `GET /api/natal-chart/list`

### Вземане по ID
- Път: `GET /api/natal-chart/[id]`

## Админ

### Seed Таро Карти
- Път: `POST /api/admin/seed-tarot`

### Управление на абонаменти/потребители
- Пътища: `app/api/admin/subscriptions/*`, `app/api/admin/users/*` (изискват админ)

## Cron (Vercel)
- Описани в `vercel.json`. Локално може да симулирате с `curl`:
```
curl -i "$BASE_URL/api/cron/generate-horoscopes"
curl -i "$BASE_URL/api/cron/trial-expiring"
```

## Rate Limiting
- По IP: автоматично чрез `rateLimitAdaptive` (Supabase RPC + fallback in-memory)
- По потребител: лимити по план за таро и оракул
- На 429:
```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2025-01-01T10:00:00.000Z
Retry-After: 120
{"error":"Too many requests. Please try again later.","rate_limit_exceeded":true}
```

## Отстраняване на проблеми
- 401 Unauthorized: липсва/невалидна сесия (cookies). Влезте през UI и копирайте cookies.
- 403 Premium Only: маршрут/функция изисква Basic/Ultimate или Admin.
- 400 Invalid Input: липсващ/невалиден параметър (`zodiac`, `period`, и т.н.).
- 500 Server Error: вижте логовете (Vercel, Supabase logs). Проверете ENV ключовете.

