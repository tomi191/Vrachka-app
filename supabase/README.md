# Supabase Setup Guide

## Стъпка 1: Създаване на Supabase проект

1. Отиди на [supabase.com](https://supabase.com)
2. Създай нов проект
3. Запази следните credentials:
   - Project URL
   - Anon/Public key
   - Service Role key (ВАЖНО: Не го споделяй!)

## Стъпка 2: Конфигуриране на environment variables

Копирай `.env.example` към `.env.local` и попълни:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Стъпка 3: Приложи database migrations

В Supabase Dashboard:
1. Отиди на SQL Editor
2. Копирай съдържанието на `migrations/001_initial_schema.sql`
3. Изпълни SQL скрипта
4. Копирай `seed.sql` и го изпълни

## Стъпка 4: Настройка на Authentication Providers

### Google OAuth:
1. Supabase Dashboard → Authentication → Providers
2. Enable Google
3. Създай OAuth app в [Google Cloud Console](https://console.cloud.google.com/)
4. Добави authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
5. Копирай Client ID и Client Secret в Supabase

### Facebook OAuth:
1. Supabase Dashboard → Authentication → Providers
2. Enable Facebook
3. Създай Facebook App в [Facebook Developers](https://developers.facebook.com/)
4. Добави redirect URI
5. Копирай App ID и App Secret

## Стъпка 5: Настройка на Storage (за avatars и tarot images)

1. Supabase Dashboard → Storage
2. Създай bucket `avatars` (public)
3. Създай bucket `tarot-cards` (public)
4. Качи таро карти изображения в `tarot-cards`

## Стъпка 6: Email Templates

Supabase Dashboard → Authentication → Email Templates

Персонализирай:
- Confirm signup email
- Magic link email
- Reset password email

## SQL Queries

### Check if tables are created:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

### Check RLS policies:
```sql
SELECT * FROM pg_policies;
```

### Create test user profile:
```sql
-- First, create user via Supabase Auth UI, then:
INSERT INTO profiles (id, full_name, birth_date, zodiac_sign, onboarding_completed)
VALUES (
  'your-user-uuid',
  'Test User',
  '1990-05-15',
  'taurus',
  true
);
```

## Troubleshooting

### RLS Error "permission denied"
Убедете се, че:
1. Auth user е логнат
2. RLS policies са създадени правилно
3. User ID съвпада с auth.uid()

### Migrations не се прилагат
1. Проверете за syntax errors
2. Уверете се че UUID extension е активиран
3. Проверете дали таблиците вече съществуват

## Next Steps

След setup:
1. Тествай authentication flow
2. Създай тестов потребител
3. Провери дали таблиците се populate-ват
4. Тествай RLS policies
