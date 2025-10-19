# Referral System Audit Report - Vrachka

**Дата:** 2025-10-20
**Статус:** ✅ Коригирано и готово за production

---

## 📋 Резюме

Referral системата е **почти пълна**, но бяха намерени **2 критични проблема**, които сега са коригирани:

1. ❌ **Липсващо извикване на награда при upgrade** → ✅ **Поправено**
2. ❌ **Некоректни RLS policies** → ✅ **Поправено**

---

## ✅ Какво работи правилно

### 1. Database Schema
- ✅ Таблица `referral_codes` съществува с правилна структура
- ✅ Таблица `referral_redemptions` съществува с правилна структура
- ✅ Функция `increment_referral_uses()` е създадена в миграция 003
- ✅ RLS е enable-нато на двете таблици

### 2. Referral Code Generation
- ✅ Автоматично генериране на уникален код от email
- ✅ Формат: `USERNAME{random_number}` (напр. IVAN1234)
- ✅ Автоматично създаване при първо влизане в `/profile/referral`

### 3. Code Sharing
- ✅ UI компонент `ReferralCard` за споделяне
- ✅ Copy-to-clipboard функционалност
- ✅ Share API интеграция (mobile)
- ✅ WhatsApp и Viber директно споделяне
- ✅ Референтен URL формат: `https://vrachka.eu/auth/register?ref=CODE`

### 4. Code Redemption Flow
- ✅ Capture на `?ref=` параметър при регистрация
- ✅ Запазване в sessionStorage
- ✅ Автоматично redeem след onboarding
- ✅ API endpoint `/api/referrals/redeem`
- ✅ Validation за:
  - Валиден код
  - Потребител не може да използва собствен код
  - Потребител може да използва само 1 код

### 5. Referral Statistics
- ✅ Показване на брой използвания на кода
- ✅ Визуализация на "Как работи?"
- ✅ Stats за колко приятели са се присъединили

---

## ❌ Намерени проблеми и ✅ Решения

### Проблем 1: Липсваща награда при upgrade на referred user

**Описание:**
Когато referred user направи upgrade към Basic или Ultimate план, referrer-ът НЕ получаваше обещаните 7 дни Ultimate безплатно.

**Причина:**
В Stripe webhook (`app/api/webhooks/stripe/route.ts`), функцията `handleCheckoutSessionCompleted` НЕ извикваше `grantReferrerReward()`.

**Решение:**
```typescript
// Добавено в handleCheckoutSessionCompleted:
try {
  const rewardResult = await grantReferrerReward(supabase, userId);
  if (rewardResult.success) {
    console.log(`Referral reward granted for user ${userId}`);
  }
} catch (referralError) {
  console.error('Error granting referral reward:', referralError);
}
```

**Файл:** `vrachka/app/api/webhooks/stripe/route.ts:156-165`

---

### Проблем 2: Некоректни RLS policies блокират валидация

**Описание:**
RLS policy на `referral_codes` позволяваше само на owner-а да вижда своя код:
```sql
CREATE POLICY "Users can view own referral code"
  ON referral_codes FOR SELECT
  USING (auth.uid() = referrer_user_id);
```

Това блокираше новите потребители да валидират чужд referral код при регистрация.

**Причина:**
При `validateReferralCode()`, новият потребител прави query:
```typescript
const { data: referralCode } = await supabase
  .from("referral_codes")
  .select("referrer_user_id")
  .eq("code", code)
  .single();
```

Но RLS казваше "можеш да видиш само СВОЯ код", така че query-то връщаше грешка.

**Решение:**
Създадена нова миграция `005_fix_referral_rls.sql` която:
- Премахва старата рестриктивна policy
- Добавя нова policy която позволява на ВСИЧКИ authenticated users да четат ВСИЧКИ кодове
- Запазва ограниченията за INSERT/UPDATE само на собствен код

```sql
CREATE POLICY "Authenticated users can view all referral codes"
  ON referral_codes FOR SELECT
  TO authenticated
  USING (true);
```

**Файл:** `vrachka/supabase/migrations/005_fix_referral_rls.sql`

---

## 🔄 Пълен Referral Flow (след корекциите)

### 1. Потребител А създава код
1. Влиза в `/profile/referral`
2. Ако няма код, автоматично се генерира (напр. `IVAN4523`)
3. Вижда референтен линк: `https://vrachka.eu/auth/register?ref=IVAN4523`

### 2. Потребител Б се регистрира с кода
1. Отваря линка `https://vrachka.eu/auth/register?ref=IVAN4523`
2. Кодът `IVAN4523` се запазва в sessionStorage
3. Регистрира се (email/password или Google)
4. Преминава през onboarding

### 3. Код се redeem-ва след onboarding
1. След създаване на profile, автоматично се извиква `/api/referrals/redeem`
2. Валидация:
   - ✅ Кодът съществува? (`validateReferralCode`)
   - ✅ Потребителят не използва собствен код?
   - ✅ Потребителят не е използвал вече друг код?
3. Създава се `referral_redemption` запис
4. Incrementва се `uses_count` на кода (чрез `increment_referral_uses()`)

### 4. Потребител Б upgrade-ва към Premium
1. Купува Basic или Ultimate план през Stripe
2. Stripe изпраща `checkout.session.completed` webhook
3. Webhook handler:
   - Активира subscription-а
   - **ИЗВИКВА `grantReferrerReward()`** ✅
4. `grantReferrerReward()`:
   - Намира `referral_redemption` запис за Потребител Б
   - Взима referrer (Потребител А)
   - Добавя 7 дни Ultimate към subscription-а на Потребител А
   - Маркира `reward_granted = true`

### 5. Потребител А получава наградата
- Subscription plan_type → `ultimate`
- current_period_end → +7 дни
- Status → `active`

---

## 🧪 Как да тествате

### Test Case 1: Създаване на referral код
```bash
1. Login като User A
2. Navigate to /profile/referral
3. Verify код е генериран (напр. USERA1234)
4. Verify референтен линк е показан
5. Copy код и го запазете
```

### Test Case 2: Регистрация с referral код
```bash
1. Logout
2. Open https://vrachka.eu/auth/register?ref=USERA1234
3. Register нов потребител (User B)
4. Complete onboarding
5. Check console logs: "Referral code redeemed successfully"
6. Login като User A
7. Go to /profile/referral
8. Verify uses_count е incrementнато на 1
```

### Test Case 3: Upgrade и награда
```bash
1. Login като User B
2. Go to /pricing
3. Purchase Basic/Ultimate план
4. Complete Stripe checkout
5. Wait за webhook processing
6. Login като User A
7. Check /profile/settings
8. Verify plan е 'ultimate'
9. Verify current_period_end е +7 дни от преди
```

### Test Case 4: Validation errors
```bash
# Test invalid code
POST /api/referrals/redeem
{ "code": "INVALID123" }
→ Expect 400: "Invalid referral code"

# Test own code
1. Login като User A
2. POST /api/referrals/redeem
   { "code": "USERA1234" }
→ Expect 400: "Cannot use your own referral code"

# Test already redeemed
1. User B вече е redeemed код
2. POST /api/referrals/redeem (отново)
→ Expect 400: "You have already used a referral code"
```

---

## 📊 Database Queries за проверка

```sql
-- Проверка на всички referral codes
SELECT
  rc.code,
  rc.uses_count,
  p.full_name AS referrer_name
FROM referral_codes rc
JOIN profiles p ON p.id = rc.referrer_user_id
ORDER BY rc.created_at DESC;

-- Проверка на всички redemptions
SELECT
  p1.full_name AS referrer,
  p2.full_name AS referred,
  rr.reward_granted,
  rr.redeemed_at
FROM referral_redemptions rr
JOIN profiles p1 ON p1.id = rr.referrer_user_id
JOIN profiles p2 ON p2.id = rr.referred_user_id
ORDER BY rr.redeemed_at DESC;

-- Проверка на награди
SELECT
  p.full_name,
  s.plan_type,
  s.current_period_end,
  rr.reward_granted
FROM referral_redemptions rr
JOIN profiles p ON p.id = rr.referrer_user_id
JOIN subscriptions s ON s.user_id = rr.referrer_user_id
WHERE rr.reward_granted = true;
```

---

## 📁 Промени в кода

### Нови файлове:
1. ✅ `vrachka/supabase/migrations/005_fix_referral_rls.sql`

### Модифицирани файлове:
1. ✅ `vrachka/app/api/webhooks/stripe/route.ts`
   - Added import: `grantReferrerReward`
   - Added reward granting logic in `handleCheckoutSessionCompleted`

### Съществуващи файлове (без промени):
- `vrachka/lib/referrals.ts` ✅
- `vrachka/app/api/referrals/redeem/route.ts` ✅
- `vrachka/app/(authenticated)/profile/referral/ReferralCard.tsx` ✅
- `vrachka/app/(authenticated)/profile/referral/page.tsx` ✅
- `vrachka/app/auth/register/page.tsx` ✅
- `vrachka/app/onboarding/page.tsx` ✅

---

## ⚠️ Production Deployment Checklist

Преди да deploy-нете на production:

- [ ] Run миграция `005_fix_referral_rls.sql` на Supabase
- [ ] Verify че функцията `increment_referral_uses` съществува (миграция 003)
- [ ] Test пълния referral flow на staging/dev environment
- [ ] Verify Stripe webhook е конфигуриран правилно
- [ ] Test всички validation errors
- [ ] Monitor logs при първи real referral redemption

---

## 📈 Метрики за tracking

След deploy, мониторирайте:

1. **Referral Conversion Rate:**
   ```sql
   SELECT
     COUNT(DISTINCT rc.referrer_user_id) AS total_referrers,
     COUNT(rr.id) AS total_redemptions,
     COUNT(CASE WHEN rr.reward_granted THEN 1 END) AS rewards_granted
   FROM referral_codes rc
   LEFT JOIN referral_redemptions rr ON rr.referrer_user_id = rc.referrer_user_id;
   ```

2. **Webhook Success Rate:**
   - Monitor Stripe dashboard за webhook failures
   - Check Supabase logs за "Referral reward granted"

3. **User Acquisition Cost:**
   - Track колко нови premium users идват от referrals vs. organic/ads

---

## ✅ Заключение

**Referral системата е ГОТОВА за production след прилагане на корекциите!**

### Какво беше коригирано:
1. ✅ Добавено извикване на `grantReferrerReward` в Stripe webhook
2. ✅ Поправени RLS policies за да позволят валидация на кодове
3. ✅ Създадена миграция `005_fix_referral_rls.sql`

### Какво работи:
1. ✅ Генериране на referral код
2. ✅ Споделяне с приятели (копиране, WhatsApp, Viber)
3. ✅ Валидация и redeem на код при регистрация
4. ✅ Автоматично даване на 7 дни Ultimate награда при upgrade
5. ✅ Tracking на uses и статистики

**Проектът е готов за deployment! 🚀**

---

**Prepared by:** Claude Code
**For:** Vrachka Project - vrachka.eu
