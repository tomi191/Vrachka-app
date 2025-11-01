# Viber Channel Integration Setup

Това ръководство обяснява как да настроите Viber интеграцията за автоматично публикуване на blog постове в канала.

## Какво прави интеграцията?

Когато публикувате нов blog post (статус: `published`), системата автоматично:
- Създава красиво форматирано съобщение с Rich Media Card
- Публикува го в Viber канала
- Логва резултата в Supabase (`viber_notifications` таблица)

## 📋 Предварителни изисквания

1. **Viber Public Account (Channel)**
   - Трябва да имате активен Viber Public Account
   - Трябва да сте superadmin на този канал

2. **Auth Token**
   - Вземете го от Viber Admin Panel
   - Settings → Account Info → Authentication token

3. **SSL Certificate**
   - Webhook-ът изисква HTTPS с валиден SSL сертификат
   - Vercel автоматично предоставя SSL

## 🚀 Стъпки за настройка

### Стъпка 1: Конфигурация на .env.local

Добавете следните променливи в `.env.local`:

```bash
# Viber Bot API
VIBER_AUTH_TOKEN=your_auth_token_here

# Optional - ще се взима автоматично от API
VIBER_CHANNEL_ID=

# Base URL на приложението (за webhook)
NEXT_PUBLIC_BASE_URL=https://vrachka.eu
```

### Стъпка 2: Deploy в Vercel

```bash
git add .
git commit -m "feat: configure Viber channel integration"
git push
```

Vercel автоматично ще deploy-не промените.

### Стъпка 3: Настройка на Webhook

След deploy-а, логнете се като **admin** и направете POST request към:

```
POST https://vrachka.eu/api/viber/setup-webhook
```

Или използвайте curl:

```bash
curl -X POST https://vrachka.eu/api/viber/setup-webhook \
  -H "Cookie: your-auth-cookie"
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Webhook configured successfully",
  "webhook": {
    "url": "https://vrachka.eu/api/viber/webhook",
    "eventTypes": ["subscribed", "unsubscribed"]
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message here"
}
```

### Стъпка 4: Проверка

Проверете дали webhook-ът е настроен:

```bash
GET https://vrachka.eu/api/viber/setup-webhook
```

**Response:**
```json
{
  "success": true,
  "webhook": {
    "url": "https://vrachka.eu/api/viber/webhook",
    "eventTypes": ["subscribed", "unsubscribed"],
    "isConfigured": true
  }
}
```

### Стъпка 5: Тест

Публикувайте нов blog post през Admin панела:

1. Отидете на `/admin/blog`
2. Създайте нов пост или редактирайте съществуващ
3. Сменете статуса на `published`
4. Проверете Viber канала за новото съобщение

## 📊 Мониторинг

### Проверка на логовете

**Vercel Logs:**
```bash
vercel logs production
```

Търсете за:
- `[Viber Service] Post published to channel successfully`
- `[Viber Logger] Notification logged successfully`

**Supabase:**
```sql
-- Последни 10 изпратени съобщения
SELECT
  id,
  status,
  sent_at,
  metadata->>'title' as title,
  error_message
FROM viber_notifications
ORDER BY sent_at DESC
LIMIT 10;

-- Статистика
SELECT
  status,
  COUNT(*) as count,
  COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () as percentage
FROM viber_notifications
GROUP BY status;
```

### Чести грешки

**Error 10: "webhookNotSet"**
- Причина: Webhook не е настроен
- Решение: Изпълнете Стъпка 3 отново

**Error 2: "Invalid authentication token"**
- Причина: Грешен или изтекъл VIBER_AUTH_TOKEN
- Решение: Вземете нов token от Viber Admin Panel

**Error 12: "Rate limit exceeded"**
- Причина: Твърде много API requests
- Решение: Изчакайте 5 минути и опитайте отново

## 🔧 Техническа информация

### API Endpoints

| Endpoint | Описание |
|----------|----------|
| `/api/viber/webhook` | Получава callbacks от Viber API |
| `/api/viber/setup-webhook` | Настройва webhook (POST) или проверява статус (GET) |
| `/api/blog/publish` | Публикува blog post и изпраща Viber notification |

### Database Schema

```sql
-- viber_notifications table
CREATE TABLE viber_notifications (
  id UUID PRIMARY KEY,
  blog_post_id UUID REFERENCES blog_posts(id),
  message_token TEXT,          -- Viber's message ID
  status TEXT,                 -- 'success' or 'failed'
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  metadata JSONB               -- title, excerpt, slug, etc.
);
```

### Rich Media Card Format

Съобщенията се изпращат като Rich Media Cards с:
- Featured image (ако има)
- Category badge с цветно кодиране
- Заглавие (max 80 chars)
- Excerpt (max 120 chars)
- "Read More" бутон → линк към статията

## 🎨 Категория цветове

| Категория | Цвят | Hex |
|-----------|------|-----|
| Astrology | Purple | #9333ea |
| Tarot | Pink | #ec4899 |
| Numerology | Cyan | #06b6d4 |
| Spirituality | Violet | #8b5cf6 |
| General | Indigo | #6366f1 |

## 📝 Допълнителни функции

### Ръчно изпращане на notification

Можете да изпратите notification програмно:

```typescript
import { getViberService } from '@/lib/viber/viber-service';
import { createBlogNotificationMessage } from '@/lib/viber/templates/blog-notification';

const viberService = getViberService();
const message = createBlogNotificationMessage(blogPost);
const result = await viberService.postToChannel(message);
```

### Проверка за дубликати

Системата автоматично проверява дали съобщението вече е изпратено:

```typescript
import { hasExistingNotification } from '@/lib/viber/viber-logger';

const exists = await hasExistingNotification(blogPostId);
if (exists) {
  console.log('Notification already sent');
}
```

## 🔒 Сигурност

- **RLS Policies**: Само admins могат да вмъкват/редактират notifications
- **Authentication**: Setup endpoint изисква admin права
- **Rate Limiting**: Автоматично retry с exponential backoff
- **Error Handling**: Non-blocking - грешките не блокират публикуването

## 📞 Support

Ако имате проблеми:

1. Проверете Vercel logs
2. Проверете Supabase `viber_notifications` таблица
3. Проверете дали webhook-ът е настроен правилно
4. Проверете дали VIBER_AUTH_TOKEN е валиден

## 🔗 Полезни линкове

- [Viber REST Bot API Documentation](https://developers.viber.com/docs/api/rest-bot-api/)
- [Viber Admin Panel](https://partners.viber.com/)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://supabase.com/dashboard)
