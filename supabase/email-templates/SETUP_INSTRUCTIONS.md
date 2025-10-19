# Email Templates Setup за Supabase

## Как да конфигурирате Email Templates в Supabase Dashboard

### Стъпка 1: Отворете Dashboard
1. Отидете на https://supabase.com/dashboard/project/kpdumthwuahkuaggilpz
2. Навигирайте до **Authentication** → **Email Templates**

### Стъпка 2: Конфигурирайте основните настройки

#### SMTP Settings (Authentication → Settings → SMTP Settings)
- **Sender Name:** Vrachka
- **Sender Email:** noreply@vrachka.eu (или notifications@vrachka.eu)
- Уверете се, че домейнът vrachka.eu е верифициран

### Стъпка 3: Копирайте темплейтите

За всеки от темплейтите по-долу:

1. **Confirm signup** - confirm-signup.html
2. **Magic Link** - magic-link.html
3. **Change Email Address** - change-email.html
4. **Reset Password** - reset-password.html
5. **Invite User** - invite-user.html (ако използвате)

### Налични променливи в Supabase templates:

- `{{ .ConfirmationURL }}` - URL за потвърждение
- `{{ .Token }}` - Токен код (6-digit)
- `{{ .TokenHash }}` - Hash на токена
- `{{ .SiteURL }}` - URL на сайта (https://vrachka.eu)
- `{{ .Email }}` - Email адреса на потребителя
- `{{ .RedirectTo }}` - Redirect URL след action

### Стъпка 4: Тестване

След конфигуриране, тествайте всеки template:
1. Регистрирайте тестов потребител
2. Заявете password reset
3. Проверете получените имейли за правилно форматиране

## Важни бележки

- Всички URL-та трябва да са абсолютни (започват с https://)
- Използвайте inline CSS стилове (Supabase не поддържа `<style>` тагове)
- Тествайте на различни email клиенти (Gmail, Outlook, Apple Mail)
- Уверете се, че домейнът vrachka.eu е добавен в Site URL настройките
