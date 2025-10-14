# 🔐 Stripe Setup Инструкции за Vrachka

## 📋 Преди да започнеш:
- ✅ Имаш Stripe акаунт на https://stripe.com
- ✅ Всички файлове са създадени (pricing, checkout, webhooks, etc.)

---

## 🔑 Стъпка 1: Вземи API Keys

1. Отвори Stripe Dashboard: https://dashboard.stripe.com
2. Кликни на **Developers** в горното меню
3. Избери **API keys** от лявото меню
4. Ще видиш:
   - **Publishable key** (започва с `pk_test_...`)
   - **Secret key** (кликни "Reveal test key" - започва с `sk_test_...`)

### Копирай ги и добави в `.env.local`:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_твоя_secret_key_тук
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_твоя_publishable_key_тук

# Webhook Secret (ще го получиш в стъпка 3)
STRIPE_WEBHOOK_SECRET=whsec_твоя_webhook_secret_тук

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3005
```

---

## 💳 Стъпка 2: Създай Products & Prices

### 2.1 Създай Basic Plan:

1. Отиди на **Products** в Stripe Dashboard
2. Кликни **+ Add product**
3. Попълни:
   - **Name**: `Vrachka Basic`
   - **Description**: `Дневни хороскопи + 3 таро четения + 3 Oracle въпроса на ден`
   - **Pricing model**: `Standard pricing`
   - **Price**: `9.99 BGN` (или EUR/USD според твоята локация)
   - **Billing period**: `Monthly`
4. Кликни **Save product**
5. **ВАЖНО:** Копирай **Price ID** (започва с `price_...`)

### 2.2 Създай Ultimate Plan:

1. Кликни **+ Add product** отново
2. Попълни:
   - **Name**: `Vrachka Ultimate`
   - **Description**: `Неограничени таро четения + 10 Oracle въпроса + седмични прогнози`
   - **Price**: `19.99 BGN`
   - **Billing period**: `Monthly`
3. Кликни **Save product**
4. **ВАЖНО:** Копирай **Price ID**

### 2.3 Добави Price IDs в `.env.local`:

```env
# Price IDs
STRIPE_BASIC_PRICE_ID=price_твоя_basic_price_id_тук
STRIPE_ULTIMATE_PRICE_ID=price_твоя_ultimate_price_id_тук
```

---

## 🔔 Стъпка 3: Setup Webhooks (ВАЖНО!)

Webhooks са как Stripe ти казва когато някой се абонира/откаже абонамент.

### 3.1 Използвай Stripe CLI за локално тестване:

#### Инсталирай Stripe CLI:

**Windows:**
```bash
# С Scoop
scoop install stripe

# Или изтегли от: https://github.com/stripe/stripe-cli/releases
```

**Mac:**
```bash
brew install stripe/stripe-cli/stripe
```

#### Login и Forward webhooks:

```bash
# Login
stripe login

# Forward webhooks към твоя локален сървър
stripe listen --forward-to localhost:3005/api/webhooks/stripe
```

Ще видиш нещо като:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

**Копирай този `whsec_...` ключ** и го добави в `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_твоя_webhook_secret_от_CLI
```

### 3.2 За Production (след deploy):

1. Отиди на **Developers > Webhooks** в Stripe Dashboard
2. Кликни **+ Add endpoint**
3. Попълни:
   - **Endpoint URL**: `https://твоя-domain.vercel.app/api/webhooks/stripe`
   - **Description**: `Vrachka Production Webhooks`
4. Избери следните events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. Кликни **Add endpoint**
6. Копирай **Signing secret** (започва с `whsec_...`)
7. Добави го в production environment variables във Vercel

---

## 🧪 Стъпка 4: Тестване

### 4.1 Стартирай приложението:

```bash
cd vrachka
npm run dev
```

### 4.2 В отделен терминал стартирай Stripe CLI:

```bash
stripe listen --forward-to localhost:3005/api/webhooks/stripe
```

### 4.3 Тествай checkout flow:

1. Отвори `http://localhost:3005/pricing`
2. Кликни **Абонирай се** на Basic или Ultimate
3. Използвай тест карта: `4242 4242 4242 4242`
   - **Expiry**: Всяка бъдеща дата (напр. `12/25`)
   - **CVC**: Всеки 3-цифрен код (напр. `123`)
   - **ZIP**: Всеки postal code
4. След успешно плащане трябва да те пренасочи към `/subscription/success`

### 4.4 Провери дали webhook работи:

Отвори терминала с `stripe listen` - трябва да видиш:
```
[200] POST /api/webhooks/stripe [evt_xxxxx]
checkout.session.completed
```

### 4.5 Провери в базата данни:

В Supabase, таблицата `subscriptions` трябва да се е обновила:
- `plan_type` трябва да е `basic` или `ultimate`
- `status` трябва да е `active`
- `stripe_subscription_id` и `stripe_customer_id` трябва да са попълнени

---

## 🎯 Стъпка 5: Настрой Customer Portal

Customer Portal позволява на потребителите да управляват абонамента си (откажат, променят план, обновят карта).

1. Отиди на **Settings > Billing > Customer portal** в Stripe Dashboard
2. Кликни **Configure**
3. Настрой:
   - ✅ Enable **Cancel subscriptions**
   - ✅ Enable **Update payment method**
   - ✅ Enable **View invoices**
   - ⚙️ Customizations (по желание - лого, цветове, etc.)
4. Запази промените

---

## ✅ Checklist - Всичко готово когато:

- [ ] API Keys са добавени в `.env.local`
- [ ] 2 Products са създадени (Basic & Ultimate)
- [ ] Price IDs са добавени в `.env.local`
- [ ] Stripe CLI е инсталиран и running (`stripe listen`)
- [ ] Webhook secret е добавен в `.env.local`
- [ ] Тест checkout работи
- [ ] Webhooks получават events
- [ ] Subscription се обновява в Supabase
- [ ] Customer portal е конфигуриран

---

## 🎉 След това можеш да:

1. Тествай премиум функциите (таро четения, oracle)
2. Deploy към production (Vercel)
3. Setup production webhooks
4. Включи live mode в Stripe (след добавяне на банкова сметка)

---

## 📝 Тест Cards за различни сценарии:

| Карта              | Сценарий                        |
|--------------------|---------------------------------|
| 4242 4242 4242 4242 | Успешно плащане                |
| 4000 0000 0000 0002 | Карта отказана                  |
| 4000 0000 0000 9995 | Insufficient funds             |
| 4000 0025 0000 3155 | Изисква 3D Secure              |

**CVC**: Всеки 3 цифри
**Expiry**: Всяка бъдеща дата
**ZIP**: Всеки postal code

---

## 🆘 Проблеми?

### Webhook не работи:
- Проверявай дали `stripe listen` running
- Проверявай `.env.local` за correct webhook secret
- Restart dev server след промяна на `.env.local`

### Checkout redirect не работи:
- Проверявай `NEXT_PUBLIC_APP_URL` в `.env.local`
- Трябва да е `http://localhost:3005` (без trailing slash)

### Subscription не се обновява:
- Проверявай Supabase logs
- Проверявай дали RLS policies позволяват write access

---

## 🔗 Полезни линкове:

- Stripe Dashboard: https://dashboard.stripe.com
- Stripe Docs: https://stripe.com/docs
- Test Cards: https://stripe.com/docs/testing
- Webhooks Testing: https://stripe.com/docs/webhooks/test

---

## 🚀 Production Notes:

Когато deploy-неш към production:

1. Създай production webhook endpoint в Stripe Dashboard
2. Добави production environment variables във Vercel:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_... (от production webhook)
   STRIPE_BASIC_PRICE_ID=price_... (production price)
   STRIPE_ULTIMATE_PRICE_ID=price_... (production price)
   ```
3. Активирай live mode в Stripe (след добавяне на банкова информация)
4. Тествай с real cards (малки суми)

**ВАЖНО:** Никога не commit-вай `.env.local` в Git!
