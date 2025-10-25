# 🧪 Vrachka - Testing Guide

Comprehensive guide за тестване на всички функционалности в приложението.

---

## 🌐 Live URL

**Production:** https://vrachka.eu

---

## 👤 Test Users

### Free User (Създай нов)
- Register на `/auth/register`
- Има достъп до basic функции

### Premium User (Създай и upgrade)
- Register → Login → `/pricing` → Checkout
- Пълен достъп до всички функции

### Admin User
- Трябва да се добави manual в database:
  ```sql
  UPDATE profiles SET is_admin = true WHERE id = 'user-id';
  ```

---

## 📱 CORE FEATURES - Ready to Test

### 1. 🏠 **Landing Page**
**URL:** `/`

**Тествай:**
- ✅ Hero section с CTA buttons
- ✅ Features showcase
- ✅ Pricing cards
- ✅ Testimonials
- ✅ Footer навигация
- ✅ Responsive дизайн
- ✅ Mobile navigation

**Очаквано:**
- Професионален dark mode дизайн
- Smooth animations
- Call-to-action buttons work

---

### 2. 🔐 **Authentication System**

#### A. Register
**URL:** `/auth/register`

**Тествай:**
- ✅ Email + Password регистрация
- ✅ Валидация на полета
- ✅ Email verification flow
- ✅ Redirect към dashboard след успех

**Очаквано:**
- Verification email изпратен
- Account създаден в database
- Redirect към `/auth/verify-email`

#### B. Login
**URL:** `/auth/login`

**Тествай:**
- ✅ Login с email/password
- ✅ "Remember me" functionality
- ✅ Forgot password link
- ✅ Error handling (wrong credentials)

**Очаквано:**
- Успешен login → redirect към `/dashboard`
- Session persistence

#### C. Password Reset
**URL:** `/auth/forgot-password`

**Тествай:**
- ✅ Request password reset
- ✅ Email получен
- ✅ Reset link работи
- ✅ Нова парола set-ната

---

### 3. 📊 **Dashboard** (AUTHENTICATED)
**URL:** `/dashboard`

**Тествай:**
- ✅ Дневен хороскоп card
- ✅ Streak counter
- ✅ Quick actions (Таро, Оракул)
- ✅ Premium features highlight
- ✅ Profile completion status
- ✅ Daily greeting с име

**Очаквано:**
- Персонализиран dashboard
- Responsive grid layout
- Smooth card animations

---

### 4. 🌙 **Daily Horoscope**
**URL:** `/horoscope/[sign]`

**Example:** `/horoscope/oven` (Овен)

**Всички зодии:**
- `/horoscope/oven` - Овен
- `/horoscope/telec` - Телец
- `/horoscope/bliznaci` - Близнаци
- `/horoscope/rak` - Рак
- `/horoscope/lav` - Лъв
- `/horoscope/deva` - Дева
- `/horoscope/vezni` - Везни
- `/horoscope/skorpion` - Скорпион
- `/horoscope/strelec` - Стрелец
- `/horoscope/kozirog` - Козирог
- `/horoscope/vodolej` - Водолей
- `/horoscope/ribi` - Риби

**Тествай:**
- ✅ AI-генериран дневен хороскоп
- ✅ Любов секция
- ✅ Кариера секция
- ✅ Здраве секция
- ✅ Късметлийски числа
- ✅ Съвместимост
- ✅ Famous personalities

**Очаквано:**
- Уникален AI horoscope всеки ден
- Красиво форматиране
- Zodiac icon animations

---

### 5. 🃏 **Tarot Readings** (AUTHENTICATED)

#### A. Daily Card
**URL:** `/tarot`

**Тествай:**
- ✅ Дневна таро карта
- ✅ AI интерпретация
- ✅ Card animation
- ✅ Limit: 1 per day (Free users)

#### B. Love Reading
**URL:** `/tarot/love`

**Тествай:**
- ✅ 3-card любовно четене
- ✅ AI интерпретация за любов
- ✅ Beautiful card display
- ✅ Premium feature (requires Basic+)

#### C. Career Reading
**URL:** `/tarot/career`

**Тествай:**
- ✅ 3-card кариерно четене
- ✅ AI кариерни съвети
- ✅ Premium feature

#### D. Three-Card Spread
**URL:** `/tarot/three-card`

**Тествай:**
- ✅ Custom въпрос
- ✅ Past-Present-Future spread
- ✅ AI интерпретация
- ✅ Save history (Premium)

**Очаквано:**
- Major Arcana карти (22 бр)
- Smooth flip animations
- AI analysis в Rachel Pollack стил

---

### 6. 🔮 **Digital Oracle** (PREMIUM ONLY)
**URL:** `/oracle`

**Тествай:**
- ✅ AI chat интерфейс
- ✅ Задавай духовни въпроси
- ✅ GPT-4 отговори
- ✅ Conversation history
- ✅ Daily question limit (5 за Premium)
- ✅ Save conversations
- ✅ Delete conversations

**Очаквано:**
- Jung + Stoicism + Daoism стил отговори
- Smooth chat UX
- Real-time typing indicator
- Message persistence

**Тест въпроси:**
- "Какъв е смисълът на живота ми?"
- "Как да намеря вътрешен мир?"
- "Какво казва вселената за моята кариера?"

---

### 7. 🌟 **Natal Chart** (NEW - BETA)
**URL:** `/natal-chart`

**Тествай:**
- ✅ Calculate natal chart
- ✅ Birth data input (date, time, location)
- ✅ Planet positions
- ✅ Houses
- ✅ AI interpretation
- ✅ Save charts
- ✅ View history

**URL:** `/natal-chart/[id]` - View specific chart

**Очаквано:**
- Astronomical calculations
- Beautiful chart visualization
- AI personality analysis

---

### 8. 👤 **Profile Management**

#### A. View Profile
**URL:** `/profile`

**Тествай:**
- ✅ Profile info display
- ✅ Avatar
- ✅ Zodiac sign
- ✅ Subscription status
- ✅ Trial status

#### B. Edit Profile
**URL:** `/profile/edit`

**Тествай:**
- ✅ Upload avatar
- ✅ Change full name
- ✅ Change zodiac sign
- ✅ Update birth date
- ✅ Form validation
- ✅ Save changes

#### C. Settings
**URL:** `/profile/settings`

**Тествай:**
- ✅ Push notification toggle
- ✅ Email preferences
- ✅ Privacy settings
- ✅ Dark mode toggle (already default)
- ✅ Language selection

#### D. Referral System
**URL:** `/profile/referral`

**Тествай:**
- ✅ Unique referral code
- ✅ Copy to clipboard
- ✅ Share links (WhatsApp, Telegram, Facebook)
- ✅ Referral stats (pending/successful)
- ✅ Rewards tracking

**Как работи:**
1. Copy твоя referral code
2. Сподели с приятел
3. Приятел се регистрира с кода
4. Приятел купи subscription
5. Ти получаваш 7 дни безплатен Ultimate

#### E. History
**URL:** `/profile/history`

**Тествай:**
- ✅ Tarot reading history
- ✅ Oracle conversation history
- ✅ Horoscope view history
- ✅ Filter by date
- ✅ Delete entries

---

### 9. 💳 **Subscription & Payments**

#### A. Pricing Page
**URL:** `/pricing`

**Тествай:**
- ✅ 3 pricing tiers (Free, Basic, Ultimate)
- ✅ Feature comparison
- ✅ CTA buttons
- ✅ Trial badge

**Plans:**
- **Free:** Basic features
- **Basic (9.99 лв/месец):** Tarot readings, more horoscopes
- **Ultimate (19.99 лв/месец):** All features + Oracle

#### B. Checkout
**Flow:** `/pricing` → Click "Subscribe" → Stripe Checkout

**Тествай:**
- ✅ Redirect към Stripe
- ✅ Card payment
- ✅ Success redirect
- ✅ Subscription activated

**Test Cards (Stripe Test Mode):**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

#### C. Success Page
**URL:** `/subscription/success`

**Тествай:**
- ✅ Success message
- ✅ Subscription details
- ✅ Next steps
- ✅ CTA към dashboard

#### D. Customer Portal
**Access:** `/profile` → "Manage Subscription"

**Тествай:**
- ✅ View subscription
- ✅ Update payment method
- ✅ Cancel subscription
- ✅ Download invoices
- ✅ View billing history

---

### 10. 📝 **Blog & Content**

#### A. Blog Posts
**URL:** `/blog`

**Тествай:**
- ✅ Blog post listing
- ✅ Categories filter
- ✅ Search
- ✅ Pagination

#### B. Individual Post
**URL:** `/blog/[slug]`

**Тествай:**
- ✅ Full content
- ✅ Related posts
- ✅ Social sharing
- ✅ SEO metadata

**Auto-generated posts:**
- Дневни хороскопи за всички 12 зодии
- Generated via cron job

---

### 11. 🛡️ **Admin Dashboard** (ADMIN ONLY)

#### A. Admin Home
**URL:** `/admin`

**Тествай:**
- ✅ Stats overview
- ✅ Recent users
- ✅ Revenue metrics
- ✅ Quick actions

#### B. User Management
**URL:** `/admin/users`

**Тествай:**
- ✅ User listing
- ✅ Search users
- ✅ Filter by subscription
- ✅ Change user plan
- ✅ Make admin
- ✅ Ban user
- ✅ View user details

#### C. Content Management
**URL:** `/admin/content`

**Тествай:**
- ✅ Create blog posts
- ✅ Edit blog posts
- ✅ Delete posts
- ✅ Publish/unpublish
- ✅ SEO fields
- ✅ Category management

#### D. Subscriptions
**URL:** `/admin/subscriptions`

**Тествай:**
- ✅ All subscriptions view
- ✅ Filter by status (active/cancelled)
- ✅ Cancel subscription
- ✅ Create manual subscription
- ✅ Refund handling

#### E. Financial Reports
**URL:** `/admin/financial`

**Sub-pages:**
- `/admin/financial/revenue` - Revenue analytics
- `/admin/financial/ai-costs` - AI usage costs
- `/admin/financial/reports` - Monthly reports

**Тествай:**
- ✅ Revenue charts
- ✅ MRR (Monthly Recurring Revenue)
- ✅ Churn rate
- ✅ AI cost tracking (OpenRouter)
- ✅ Export reports

#### F. Settings
**URL:** `/admin/settings`

**Тествай:**
- ✅ Site settings
- ✅ Email templates
- ✅ Payment settings
- ✅ API keys management

---

## 🤖 **AI Features - Testing**

### Current AI Models (Optimized - 90% Cost Reduction!)

| Feature | Model | Cost | Quality |
|---------|-------|------|---------|
| Horoscopes | Gemini 2.0 Flash | **FREE** | Excellent |
| Tarot | Gemini 2.0 Flash | **FREE** | Excellent |
| Oracle Basic | Gemini 2.0 Flash | **FREE** | Very Good |
| Oracle Premium | Claude 3.5 Sonnet | $3-15/1M | Best Bulgarian |
| Natal Chart | Claude 3.5 Sonnet | $3-15/1M | Best Quality |

### Test AI Quality

**Horoscope AI:**
- Go to `/horoscope/oven`
- Powered by: **Gemini 2.0 Flash** (FREE!)
- Check if style е като Susan Miller (detailed, empathetic)

**Tarot AI:**
- Go to `/tarot`
- Powered by: **Gemini 2.0 Flash** (FREE!)
- Check if interpretation е като Rachel Pollack (deep, symbolic)

**Oracle AI:**
- Go to `/oracle`
- Powered by: **Gemini Flash** (basic) or **Claude Sonnet** (premium)
- Ask: "What is my life purpose?"
- Check if response е philosophical (Jung + Stoicism)

**Natal Chart AI:**
- Go to `/natal-chart`
- Powered by: **Claude 3.5 Sonnet** (Best for Bulgarian personality analysis)
- Check quality и depth на интерпретацията

---

## 📧 **Email Testing**

### Triggered Emails

1. **Welcome Email**
   - Trigger: Register new account
   - Check inbox

2. **Email Verification**
   - Trigger: Register
   - Click verification link

3. **Password Reset**
   - Trigger: `/auth/forgot-password`
   - Check email

4. **Subscription Confirmation**
   - Trigger: Complete Stripe checkout
   - Check email

5. **Trial Expiring**
   - Auto-sent 2 days before trial ends

6. **Payment Failed**
   - Trigger: Failed Stripe payment

7. **Referral Reward**
   - Trigger: Referred user subscribes

---

## 🔔 **Push Notifications** (PWA)

### Setup

1. Allow notifications при prompt
2. Subscribe via `/profile/settings`

### Test

- Daily horoscope reminder
- Oracle question reminder
- Subscription renewal reminder

---

## 📱 **PWA Features**

### Install App

**Desktop:**
- Chrome: Address bar → Install icon

**Mobile:**
- Chrome: Menu → "Add to Home Screen"

### Offline Mode

1. Install PWA
2. Disconnect internet
3. Navigate to `/offline`

**Тествай:**
- ✅ Offline page loads
- ✅ Cached pages work
- ✅ Service worker active

---

## 🔗 **SEO Testing**

### Pages to Check

1. **Landing Page** `/`
   - Check meta tags
   - Check Open Graph
   - Check structured data

2. **Horoscope Pages** `/horoscope/[sign]`
   - Check canonical URLs
   - Check sitemap inclusion

3. **Blog Posts** `/blog/[slug]`
   - Check article schema
   - Check keywords

### Tools

- Google Search Console
- PageSpeed Insights
- Lighthouse

---

## 🐛 **Known Issues / Limitations**

1. **Natal Chart** - Beta (може да има bugs)
2. **Minor Arcana Tarot** - Не са включени (само 22 Major Arcana)
3. **Push Notifications** - May not work on iOS Safari
4. **Email Deliverability** - Check spam folder

---

## ✅ **Acceptance Criteria Checklist**

### Critical Paths

- [ ] User can register and verify email
- [ ] User can login/logout
- [ ] User can view daily horoscope
- [ ] User can get tarot reading
- [ ] User can subscribe to Basic/Ultimate
- [ ] User can access Oracle (Premium)
- [ ] User can manage subscription
- [ ] Admin can manage users
- [ ] Admin can view financial reports

### Performance

- [ ] Page load < 3s
- [ ] Lighthouse score > 90
- [ ] Mobile-friendly
- [ ] PWA installable

### Security

- [ ] Auth required for protected routes
- [ ] CRON endpoints secured
- [ ] Admin routes protected
- [ ] SQL injection prevented (Supabase RLS)

---

## 🎯 **Priority Testing Order**

1. **Authentication Flow** - Most critical
2. **Payment Flow** - Revenue critical
3. **Core Features** - Horoscope, Tarot, Oracle
4. **Profile & Settings** - User experience
5. **Admin Dashboard** - Management
6. **Edge Cases** - Error handling

---

## 📞 **Support**

Ако намериш bug:
1. Note URL
2. Note steps to reproduce
3. Screenshot if possible
4. Report in GitHub Issues

---

**Happy Testing! 🚀**
