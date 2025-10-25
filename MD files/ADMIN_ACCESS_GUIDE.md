# Admin Panel Access Guide

## 🔐 Как да влезеш в Admin панела

### ⚠️ ВАЖНО: Admin панелът все още НЯМА защита!

Понастоящем `/admin` маршрутите са достъпни за всеки. **КРИТИЧНО е да се добави middleware защита преди production!**

---

## 📋 Setup Steps

### 1. Добави `is_admin` колона в profiles таблицата

```sql
-- Supabase SQL Editor
-- Отвори: https://supabase.com/dashboard → SQL Editor

-- Добави колона
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Добави индекс за бързо търсене
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin
  ON profiles(is_admin)
  WHERE is_admin = TRUE;

-- RLS policy за admin достъп
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    is_admin = TRUE
    OR auth.uid() = id
  );
```

### 2. Направи себе си admin

Има 2 начина:

**Начин А: През Supabase Dashboard** (препоръчвам)

```sql
-- Supabase SQL Editor
-- Замени EMAIL-a с твоя email от регистрацията

UPDATE profiles
SET is_admin = TRUE
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'твоя-email@example.com'
);
```

**Начин Б: През Supabase Table Editor**

1. Supabase Dashboard → Table Editor
2. Избери `profiles` таблица
3. Намери твоя профил (search по email или име)
4. Click на реда → Edit
5. Смени `is_admin` на `true`
6. Save

### 3. Добави Admin Middleware защита

Създай `middleware.ts` в root на проекта:

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Admin routes protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options })
            response = NextResponse.next({ request: { headers: request.headers } })
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: '', ...options })
            response = NextResponse.next({ request: { headers: request.headers } })
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Check admin permission
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
```

### 4. Рестартирай dev server

```bash
# Спри текущия server (Ctrl+C)
# Стартирай отново
npm run dev
```

---

## 🚀 Достъп до Admin панела

След като си направил горните стъпки:

1. **Login** като admin user (email-ът с `is_admin = true`)
2. **Navigate** към `http://localhost:3000/admin`
3. Ще видиш admin dashboard! 🎉

---

## 📍 Admin Routes

- `/admin` - Dashboard (stats overview)
- `/admin/users` - User management
- `/admin/subscriptions` - Subscription management
- `/admin/content` - Content management
- `/admin/settings` - App settings

---

## 🔒 Security Checklist

Преди production:

- [ ] Middleware защита е активна
- [ ] `is_admin` колона съществува
- [ ] Поне 1 admin user е създаден
- [ ] Тествай че non-admin users НЕ могат да влязат
- [ ] Тествай че admin може да влиза нормално
- [ ] Добави logging за admin actions
- [ ] Consider 2FA за admin accounts

---

## 🐛 Troubleshooting

### "Cannot access admin panel"

**Решение:**
1. Провери че си логнат
2. Провери че `is_admin = TRUE` в базата:
   ```sql
   SELECT email, is_admin
   FROM profiles p
   JOIN auth.users u ON p.id = u.id
   WHERE u.email = 'твоя-email@example.com';
   ```
3. Clear browser cache и cookies
4. Restart dev server

### "Page redirects to /dashboard"

Това значи middleware работи, но user-ът не е admin.

**Решение:**
```sql
UPDATE profiles
SET is_admin = TRUE
WHERE id = (SELECT auth.uid());
```

### "Middleware not running"

**Провери:**
- `middleware.ts` е в root директорията (не в `/app`)
- Файлът се казва точно `middleware.ts` (не `middleware.js`)
- Dev server е рестартиран

---

## 👥 Добавяне на още admins

```sql
-- Направи user admin по email
UPDATE profiles
SET is_admin = TRUE
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'new-admin@example.com'
);

-- Виж всички admins
SELECT u.email, p.full_name, p.is_admin, p.created_at
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = TRUE
ORDER BY p.created_at DESC;

-- Remove admin access
UPDATE profiles
SET is_admin = FALSE
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'user@example.com'
);
```

---

## 🎯 Next Steps

След като admin достъпът работи:

1. **Populate admin dashboard** с реални metrics
2. **Add admin logs** table за tracking
3. **Email notifications** за важни admin actions
4. **Rate limiting** за admin API endpoints
5. **2FA** за допълнителна сигурност

---

**Security Note:** НИ КАТО не commit-вай реални admin credentials в git! Винаги използвай environment variables за sensitive data.

Готово! Сега имаш пълен достъп до admin панела! 🚀
