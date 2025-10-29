# 📋 VRACHKA.EU - МАСТЪР CHECKLIST
**Актуализиран:** 29 Октомври 2025
**Фокус:** 🇧🇬 100% Български език, структура първо!
**Базирано на:** TODO папка + анализ на проекта

---

## 📊 EXECUTIVE SUMMARY

### Обща статистика:
- ✅ **Завършени:** 12 задачи
- ⚠️ **Частично:** 5 задачи
- ❌ **TODO:** 28 задачи
- **Общо усилие:** ~120 часа (3-4 месеца при 10h/седмица)

### Текущо състояние:
- ✅ Core функции работят отлично (Blog, Tarot, Oracle, Auth, Payments)
- ⚠️ SEO структура ЧАСТИЧНО готова (категории/тагове готови, но липсва съдържание)
- ❌ Growth features липсват (Rating, Moon Phase, Mantra)
- ❌ i18n структура НЕ е приоритет (само БГ за сега)

---

## 🚨 КРИТИЧНИ ЗАДАЧИ (START NOW!)

### 🔴 PHASE 0: Critical Structure & SEO (2 седмици, 25h)

| # | Задача | Статус | Усилие | Приоритет | Deadline |
|---|--------|--------|--------|-----------|----------|
| 1 | ~~i18n структура (`/en/` URLs)~~ | ✅ SKIP | - | - | ОТХВЪРЛЕНО |
| 2 | ~~hreflang tags за multilingual~~ | ✅ SKIP | - | - | ОТХВЪРЛЕНО |
| 3 | Добави богато съдържание към **Blog Category** pages | ⚠️ PARTIAL | 3h | ⭐⭐⭐⭐⭐ | Week 1 |
| 4 | Добави богато съдържание към **Blog Tag** pages | ⚠️ PARTIAL | 2h | ⭐⭐⭐⭐ | Week 1 |
| 5 | Обогати **About** page (история, мисия, екип) | ⚠️ BASIC | 3h | ⭐⭐⭐⭐⭐ | Week 1 |
| 6 | Обогати всички **Service Pages** (`/tarot`, `/synastry`, etc.) | ⚠️ THIN | 8h | ⭐⭐⭐⭐ | Week 2 |
| 7 | Update **sitemap.xml** с категории/тагове | ⚠️ TODO | 1h | ⭐⭐⭐ | Week 2 |
| 8 | Apply **newsletter_subscribers migration** to Supabase | ❌ TODO | 30min | ⭐⭐⭐⭐⭐ | Week 1 |
| 9 | Homepage SEO optimization (H1, meta, schema) | ❌ TODO | 2h | ⭐⭐⭐⭐ | Week 1 |
| 10 | Horoscope Main page SEO optimization | ❌ TODO | 2h | ⭐⭐⭐⭐ | Week 1 |

**✅ Готови вече:**
- Blog category pages структура (`/blog/category/[slug]`) ✅
- Blog tag pages структура (`/blog/tag/[slug]`) ✅
- About page съществува ✅
- Newsletter subscribe API endpoint ✅

**📍 Action Items - Week 1:**
```bash
1. Apply newsletter migration to Supabase (30min)
2. Обогати About page с история + мисия (3h)
3. Добави SEO съдържание към категории (3h)
4. Homepage SEO optimization (2h)
5. Horoscope main SEO optimization (2h)
```

---

## ⚡ PHASE 1: Quick Wins - Growth Features (3 седмици, 17h)

### 📧 Email & Engagement

| # | Feature | Статус | Усилие | Impact | Приоритет |
|---|---------|--------|--------|--------|-----------|
| 11 | Newsletter subscription widget на видими места | ✅ DONE | - | 🔥🔥🔥🔥🔥 | - |
| 12 | **Daily email cron job** (7:00 AM хороскоп на имейл) | ❌ TODO | 2h | 🔥🔥🔥🔥🔥 | P0 |
| 13 | **Welcome email** при регистрация | ❌ TODO | 1h | 🔥🔥🔥 | P1 |
| 14 | **Unsubscribe page** (`/unsubscribe`) | ❌ TODO | 1h | 🔥🔥 | P1 |

### 📱 Social & Virality

| # | Feature | Статус | Усилие | Impact | Приоритет |
|---|---------|--------|--------|-----------|-----------|
| 15 | Social sharing buttons | ✅ DONE | - | 🔥🔥🔥🔥 | - |
| 16 | **Rating System** (⭐ 1-5 stars за хороскопи/blog) | ❌ TODO | 3h | 🔥🔥🔥🔥 | P0 |
| 17 | Display average ratings в blog cards | ❌ TODO | 1h | 🔥🔥🔥 | P1 |
| 18 | Social proof counter ("5,000+ потребители ни се доверяват") | ❌ TODO | 30min | 🔥🔥 | P1 |

### 🎯 User Experience

| # | Feature | Статус | Усилие | Impact | Приоритет |
|---|---------|--------|--------|-----------|-----------|
| 19 | **Moon Phase Tracker** 🌙 widget | ❌ TODO | 4h | 🔥🔥🔥🔥 | P0 |
| 20 | **Tarot Card of the Day** widget | ✅ DONE | - | 🔥🔥🔥 | - |
| 21 | **Daily Mantra / Affirmation** widget | ❌ TODO | 2h | 🔥🔥 | P1 |
| 22 | **Lucky Elements Expanded** (stones, plants, hours, food) | ❌ TODO | 2h | 🔥🔥 | P1 |

**Total Effort:** ~17 часа
**Expected Impact:** 📈 +30% engagement, 📧 Email list building, 🔄 Social virality

---

## 🎯 PHASE 2: Core Enhancements (1-2 месеца, 46h)

### 📅 Calendar & Planning

| # | Feature | Статус | Усилие | Impact |
|---|---------|--------|--------|--------|
| 23 | Weekly horoscope calendar view | ❌ TODO | 6h | 🔥🔥🔥 |
| 24 | Monthly horoscope calendar view | ❌ TODO | 6h | 🔥🔥🔥 |
| 25 | Astrology events calendar (Mercury retrograde, eclipses) | ❌ TODO | 8h | 🔥🔥🔥🔥 |
| 26 | Planetary transits widget | ❌ TODO | 10h | 🔥🔥🔥 |

### 💬 AI & Personalization

| # | Feature | Статус | Усилие | Impact |
|---|---------|--------|--------|--------|
| 27 | AI chat widget (quick access bubble) | ❌ TODO | 6h | 🔥🔥🔥🔥 |
| 28 | Specialized AI oracles (Love, Career, Health) | ❌ TODO | 8h | 🔥🔥🔥 |
| 29 | Saved preferences & history | ❌ TODO | 4h | 🔥🔥🔥 |

### 🧮 Interactive Tools

| # | Feature | Статус | Усилие | Impact |
|---|---------|--------|--------|--------|
| 30 | Interactive compatibility calculator | ❌ TODO | 8h | 🔥🔥🔥 |

---

## 🚀 PHASE 3: Advanced Features (2-3 месеца, 52h)

### 🎂 Advanced Astrology

| # | Feature | Статус | Усилие | Impact |
|---|---------|--------|--------|--------|
| 31 | Birth Chart Generator (full natal chart) | ❌ TODO | 20h | 🔥🔥🔥🔥 |
| 32 | Charts & trends visualization | ❌ TODO | 12h | 🔥🔥 |

### 🔔 Notifications & Community

| # | Feature | Статус | Усилие | Impact |
|---|---------|--------|--------|--------|
| 33 | Push notifications system | ❌ TODO | 12h | 🔥🔥🔥🔥 |
| 34 | Community comments (moderated) | ❌ TODO | 8h | 🔥🔥 |

---

## 📄 SEO CONTENT OPTIMIZATION

### Homepage SEO Tasks

| Task | Статус | Усилие |
|------|--------|--------|
| H1: "Врачка: Твоята Дигитална Врачка и Личен Астролог в България" | ❌ TODO | 15min |
| Meta title: "Врачка: Дигитална Врачка, Хороскопи, Таро и Астрология" | ❌ TODO | 5min |
| Meta description: оптимизирано с keywords | ❌ TODO | 10min |
| H2 секции: Услуги, Хороскопи, История, FAQ | ❌ TODO | 1h |
| Богато съдържание под H1 (200+ думи) | ❌ TODO | 30min |
| FAQ section с schema markup | ❌ TODO | 30min |

### Horoscope Main Page SEO

| Task | Статус | Усилие |
|------|--------|--------|
| H1: "Дневни Хороскопи за Всички Зодиакални Знаци" | ❌ TODO | 10min |
| Meta title: "Дневни Хороскопи за Всички Зодии \| Vrachka" | ❌ TODO | 5min |
| H2: "Какво е Хороскоп и Как се Изготвя?" с 200+ думи | ❌ TODO | 30min |
| Добави днешна дата prominently | ❌ TODO | 15min |
| Breadcrumb schema | ❌ TODO | 15min |

### Service Pages Content Expansion

**Страници за обогатяване:**

| Страница | Текущо | Нужно | Усилие |
|----------|--------|-------|--------|
| `/tarot` | Форма only | 500+ думи educational content + FAQ | 1.5h |
| `/tarot/love` | Форма only | 400+ думи за любовно таро | 1h |
| `/tarot/career` | Форма only | 400+ думи за кариерно таро | 1h |
| `/tarot/three-card` | Форма only | 400+ думи за 3-card spread | 1h |
| `/synastry` | Форма only | 500+ думи за compatibility | 1.5h |
| `/oracle` | Базов текст | Expand с 300+ думи за AI oракул | 1h |
| `/personal-horoscope` | Базов текст | Expand с 300+ думи | 1h |

**Template за всяка service page:**
```markdown
## Структура на service page:

1. Hero Section
   - H1 заглавие
   - 1-2 sentences intro

2. Educational Section (200-500 думи)
   - "Какво е [Service]?"
   - "Как работи [Service]?"
   - "Какво ще научиш от [Service]?"

3. Benefits List
   - 5-7 bullet points

4. FAQ Section (5+ въпроса)
   - С FAQPage schema markup

5. CTA / Tool Section
   - Формата/инструмента
```

---

## 🗂️ КАТЕГОРИЗАЦИЯ ПО ТИП

### 🔍 SEO & Content (35h)
- Homepage SEO (2h)
- Horoscope main SEO (2h)
- About page enrichment (3h)
- Service pages expansion (8h)
- Blog category content (3h)
- Blog tag content (2h)
- Sitemap update (1h)
- Meta tags optimization (2h)
- Schema markup enhancements (4h)
- Internal linking strategy (2h)
- URL structure audit (2h)
- FAQ sections creation (4h)

### 💻 Frontend Development (32h)
- Rating widget (3h)
- Moon phase tracker (4h)
- Daily mantra widget (2h)
- Lucky elements expansion (2h)
- Social proof counter (30min)
- Display ratings in cards (1h)
- Weekly calendar view (6h)
- Monthly calendar view (6h)
- AI chat widget (6h)
- Unsubscribe page (1h)

### ⚙️ Backend & API (15h)
- Daily email cron (2h)
- Welcome email (1h)
- Rating API (2h)
- Newsletter migration (30min)
- Astrology events calendar (8h)
- Planetary transits API (10h) - overlaps with frontend

### 🎨 Design & UX (8h)
- Homepage redesign elements (2h)
- Service pages layout improvements (3h)
- Mobile optimization pass (2h)
- Accessibility improvements (1h)

### 📊 Analytics & Tracking (4h)
- Event tracking setup (2h)
- Conversion funnel tracking (1h)
- A/B testing infrastructure (1h)

---

## 📅 ПРЕПОРЪЧАН TIMELINE

### Week 1-2: Critical SEO & Structure (13h)
```
День 1: Newsletter migration + Homepage SEO (2.5h)
День 2: Horoscope SEO + About enrichment (5h)
День 3-4: Service pages expansion (8h) - разпределено
День 5: Blog category/tag content (5h)
```

### Week 3-4: Quick Wins - Email & Social (8h)
```
День 6: Daily email cron + Welcome email (3h)
День 7: Rating system (3h)
День 8: Display ratings + Social proof (1.5h)
День 9: Unsubscribe page (1h)
```

### Week 5-6: Quick Wins - UX Widgets (8h)
```
День 10: Moon phase tracker (4h)
День 11: Daily mantra widget (2h)
День 12: Lucky elements expansion (2h)
```

### Month 2: Core Enhancements (Calendar & AI)
```
Week 7-8: Calendar views (12h)
Week 9-10: AI chat widget + personalization (10h)
Week 11: Astrology events calendar (8h)
Week 12: Interactive compatibility (8h)
```

### Month 3+: Advanced Features
```
Birth chart generator (20h)
Push notifications (12h)
Charts visualization (12h)
Community features (8h)
```

---

## ✅ CHECKLIST ПО PRIORITY TIERS

### 🔴 P0 - CRITICAL (START NOW!)
- [ ] Apply newsletter_subscribers migration
- [ ] Homepage SEO optimization
- [ ] Horoscope main SEO optimization
- [ ] About page enrichment
- [ ] Daily email cron job
- [ ] Rating system implementation
- [ ] Moon phase tracker

### 🟠 P1 - HIGH (Week 2-3)
- [ ] Service pages content expansion
- [ ] Blog category/tag content
- [ ] Welcome email
- [ ] Unsubscribe page
- [ ] Display ratings в cards
- [ ] Social proof counter
- [ ] Daily mantra widget
- [ ] Lucky elements expansion

### 🟡 P2 - MEDIUM (Month 2)
- [ ] Weekly calendar view
- [ ] Monthly calendar view
- [ ] AI chat widget
- [ ] Astrology events calendar
- [ ] Planetary transits widget
- [ ] Interactive compatibility
- [ ] Saved preferences

### 🟢 P3 - LOW (Month 3+)
- [ ] Birth chart generator
- [ ] Push notifications
- [ ] Charts visualization
- [ ] Community comments
- [ ] Specialized AI oracles
- [ ] Video/audio horoscopes

---

## 🎯 SUCCESS METRICS

### Week 2 (After Phase 0):
- ✅ Newsletter migration applied
- ✅ Homepage SEO score 90+
- ✅ All service pages have 400+ words
- ✅ About page complete
- 📈 Organic traffic baseline established

### Week 4 (After Quick Wins):
- ✅ Daily emails sending
- ✅ 50+ email subscribers
- ✅ Rating system functional
- ✅ 100+ ratings collected
- ✅ Moon phase showing
- 📈 Email signup rate: 5%+
- 📈 User engagement: +20%

### Month 2 (After Core Enhancements):
- ✅ Calendar views functional
- ✅ AI chat widget live
- ✅ Events calendar populated
- 📈 Email list: 500+
- 📈 Daily active users: +50%
- 📈 Average session time: +30%

### Month 3+ (After Advanced):
- ✅ Birth chart generator live
- ✅ Push notifications enabled
- 📈 Free-to-paid conversion: 5%+
- 📈 Monthly revenue: target met
- 📈 User retention: 70%+

---

## 🔧 TECHNICAL DEPENDENCIES

### Needed Now:
- ✅ Supabase (ready)
- ✅ OpenAI API (ready)
- ✅ Stripe (ready)
- ⚠️ Resend / Email service (configure)
- ⚠️ suncalc package (install for moon phase)

### Needed Later:
- Swiss Ephemeris / Astrology API (for natal chart)
- Push notification service
- More powerful AI models (GPT-4 Turbo/Claude 3)

---

## 📚 DOCUMENTATION REFERENCES

### Internal Docs:
- [TODO/README.md](./TODO/README.md) - Master plan overview
- [TODO/PRIORITY_ACTION_PLAN.md](./TODO/PRIORITY_ACTION_PLAN.md) - Full roadmap
- [TODO/CRITICAL_SEO_FIXES.md](./TODO/CRITICAL_SEO_FIXES.md) - SEO tasks (UPDATED без i18n)
- [TODO/QUICK_WINS.md](./TODO/QUICK_WINS.md) - Quick wins code examples
- [TODO/SEO-optimize/](./TODO/SEO-optimize/) - SEO templates за всяка страница

### External Resources:
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Integration Guide](https://stripe.com/docs)
- [Google Search Console](https://search.google.com/search-console)

---

## 🚀 NEXT IMMEDIATE ACTIONS

### За Developer (START TODAY):
```bash
# 1. Apply migration (30min)
npx supabase db push supabase/migrations/016_newsletter_subscribers.sql

# 2. Install suncalc package (5min)
npm install suncalc

# 3. Homepage SEO (2h)
# Edit app/page.tsx - optimize H1, meta, add content

# 4. Create email cron (2h)
# Create app/api/cron/send-daily-horoscope/route.ts

# 5. About page enrichment (3h)
# Edit app/about/page.tsx - add history, mission, team
```

### За Content Creator:
- Write "About Us" content (история, мисия, екип)
- Write FAQ sections за всяка service page
- Write educational content за service pages (200-500 думи per page)
- Create category descriptions за blog categories

### За Product Owner:
- Review and approve priorities
- Allocate 25h за Phase 0 (Week 1-2)
- Set up weekly progress review meetings
- Define exact success metrics

---

## 💡 ВАЖНИ ЗАБЕЛЕЖКИ

### ✅ Какво вече работи отлично:
- Blog system (listing, posts, categories, tags) ✅
- Social sharing buttons ✅
- Tarot readings ✅
- Oracle chat ✅
- Authentication & payments ✅
- Admin dashboard ✅
- Newsletter subscription API ✅

### ⚠️ Какво е ЧАСТИЧНО готово:
- About page (basic, но липсва история/мисия)
- Service pages (форми работят, но липсва educational content)
- Blog categories/tags (структура готова, но липсва SEO content)
- Newsletter (API готово, липсва cron job)

### ❌ Какво определено ЛИПСВА:
- Daily email cron job
- Rating system
- Moon phase tracker
- Daily mantra widget
- Lucky elements expansion
- Calendar views
- AI chat widget
- Birth chart generator

### 🚫 Какво НЕ правим засега:
- ❌ i18n/multilingual support - SKIP (само БГ)
- ❌ `/en/` URL structure - НЕ Е НУЖНО
- ❌ hreflang tags - НЕ Е НУЖНО
- ❌ Language switcher - НЕ Е НУЖНО

**Фокус:** 🇧🇬 100% Български език, структура и съдържание първо!

---

## 🎉 CONCLUSION

**Общ план:**
- Phase 0 (2 седмици): SEO & структура → foundation solid
- Phase 1 (3 седмици): Quick wins → user growth starts
- Phase 2 (2 месеца): Core enhancements → retention increases
- Phase 3 (2-3 месеца): Advanced features → premium conversions

**Total Timeline:** 4-6 месеца до пълно MVP с всички features

**Critical Path:** Phase 0 блокира растежа → START NOW!

---

**Създадено от:** Claude Code AI Assistant
**Последна актуализация:** 29 Октомври 2025
**Версия:** 1.0
**Статус:** 🟢 Active - Ready for execution
