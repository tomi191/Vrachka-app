# 📋 TODO - Action Plan Hub

**Last Updated:** 29 October 2025 - После анализ на проекта
**Focus:** 🇧🇬 100% Български език (без i18n за сега)

---

## 🎯 АКТУАЛНО СЪСТОЯНИЕ НА ПРОЕКТА

### ✅ ГОТОВИ FEATURES (Work Well!)

| Feature | Status | Location | Notes |
|---------|--------|----------|-------|
| **Social Sharing** | ✅ 100% | `/components/blog/ShareButtons.tsx` | Facebook, Twitter, Copy Link - работи отлично! |
| **Tarot Card of Day** | ✅ 100% | `/components/TarotReading.tsx` | Пълна реализация с анимации и звуци |
| **Oracle Chat** | ✅ 100% | `/app/(authenticated)/oracle/` | AI chat работи перфектно |
| **Blog System (Core)** | ✅ 90% | `/app/blog/` | Listing + детайли работят |
| **Tarot Readings** | ✅ 100% | `/app/(authenticated)/tarot/` | Всички spreads готови |

### ⚠️ ЧАСТИЧНО ГОТОВИ (Need Work)

| Feature | Status | What's Missing | Priority |
|---------|--------|---------------|----------|
| **Blog Categories** | ⚠️ 50% | Липсва `/blog/category/[slug]/page.tsx` | 🔴 HIGH |
| **Blog Tags** | ⚠️ 50% | Липсва `/blog/tag/[slug]/page.tsx` | 🔴 HIGH |
| **Email Subscription** | ⚠️ 30% | UI има, липсва backend + DB + cron | 🔴 HIGH |
| **Lucky Elements** | ⚠️ 60% | Има Numbers/Element/Planet/Color, липсват Stones/Plants/Hours | 🟡 MEDIUM |
| **Service Pages** | ⚠️ 70% | Има basic content, може по-богато образование | 🟡 MEDIUM |

### ❌ ЛИПСВАЩИ FEATURES (To Build)

| Feature | Priority | Effort | Impact |
|---------|----------|--------|--------|
| **Rating System** | 🔴 HIGH | 3h | 🔥🔥🔥 Social proof |
| **About Page** | 🔴 HIGH | 3h | 🔥🔥🔥 Trust building |
| **Moon Phase Tracker** | 🟡 MEDIUM | 4h | 🔥🔥🔥🔥 Engagement |
| **Daily Mantra** | 🟡 MEDIUM | 2h | 🔥🔥 Engagement |

---

## 🚨 REVISED PRIORITY PLAN (БЕЗ i18n!)

### 🔴 PHASE 0: Critical SEO & Structure (Week 1-2)

| # | Task | Status | Effort | Priority |
|---|------|--------|--------|----------|
| 1 | ✅ ~~i18n structure~~ | SKIP | - | ОТХВЪРЛЕНО (само БГ) |
| 2 | ✅ ~~hreflang tags~~ | SKIP | - | ОТХВЪРЛЕНО (само БГ) |
| 3 | ❌ Създай `/blog/category/[slug]/page.tsx` | TODO | 4h | ⭐⭐⭐⭐⭐ |
| 4 | ❌ Създай `/blog/tag/[slug]/page.tsx` | TODO | 3h | ⭐⭐⭐⭐ |
| 5 | ⚠️ Добави съдържание към service pages | IN PROGRESS | 6h | ⭐⭐⭐⭐ |
| 6 | ❌ Създай "За нас" страница | TODO | 3h | ⭐⭐⭐⭐⭐ |
| 7 | ⚠️ Update sitemap.xml | PARTIAL | 1h | ⭐⭐⭐ |

**Total Effort:** ~17 часа
**Deadline:** ASAP (Week 1-2)

---

### ⚡ PHASE 1: Quick Wins (Week 3-4)

| # | Feature | Current | Needed | Effort | Priority |
|---|---------|---------|--------|--------|----------|
| 1 | Email Subscription | ⚠️ UIOnly | Backend + DB + Cron | 3h | ⭐⭐⭐⭐⭐ |
| 2 | Social Sharing | ✅ DONE | Nothing! | 0h | ✅ |
| 3 | Rating System | ❌ NONE | Full Implementation | 3h | ⭐⭐⭐⭐ |
| 4 | Lucky Elements | ⚠️ Basic | Expand (stones, plants) | 2h | ⭐⭐⭐ |
| 5 | Daily Mantra | ❌ NONE | Full Implementation | 2h | ⭐⭐⭐ |
| 6 | Tarot Card of Day | ✅ DONE | Nothing! | 0h | ✅ |
| 7 | Moon Phase | ❌ NONE | Full Implementation | 4h | ⭐⭐⭐⭐ |

**Total Effort:** ~14 часа (minus completed)
**Already Done:** Social Sharing, Tarot Card ✅

---

### 🎯 PHASE 2: Core Enhancements (Month 2)

| # | Feature | Effort | Status |
|---|---------|--------|--------|
| 8 | Weekly/Monthly Calendar View | 8h | 🟡 TODO |
| 9 | AI Chat Widget (Quick Access) | 6h | 🟡 TODO |
| 10 | Enhanced Schema Markup | 4h | 🟡 TODO |
| 11 | Planetary Transits Widget | 10h | 🟡 TODO |
| 12 | Interactive Compatibility | 8h | 🟡 TODO |

---

## 📊 АКТУАЛЕН STATUS BOARD

### 🔴 CRITICAL (Започни ВЕДНАГА)

**1. Blog Category Pages** ⚠️ ЛИПСВА
- **File:** Create `app/blog/category/[slug]/page.tsx`
- **Why:** SEO - губим rankings за broad keywords
- **Effort:** 4 часа
- **Impact:** 🔥🔥🔥🔥🔥

**2. Blog Tag Pages** ⚠️ ЛИПСВА
- **File:** Create `app/blog/tag/[slug]/page.tsx`
- **Why:** SEO + user navigation
- **Effort:** 3 часа
- **Impact:** 🔥🔥🔥🔥

**3. Email Subscription Backend** ⚠️ НЯМА BACKEND
- **Current:** UI exists in `app/blog/[slug]/page.tsx` (lines 554-578)
- **Need:**
  - `app/api/newsletter/subscribe/route.ts`
  - `newsletter_subscribers` table migration
  - Daily email cron job
- **Effort:** 3 часа
- **Impact:** 🔥🔥🔥🔥🔥

**4. About Page** ❌ ЛИПСВА
- **File:** Create `app/about/page.tsx`
- **Why:** Trust building, SEO
- **Effort:** 3 часа
- **Impact:** 🔥🔥🔥🔥🔥

---

### 🟠 HIGH PRIORITY (След критичните)

**5. Rating System** ❌ ЛИПСВА
- **Need:**
  - `components/RatingWidget.tsx`
  - `app/api/ratings/submit/route.ts`
  - `ratings` table migration
- **Effort:** 3 часа
- **Impact:** 🔥🔥🔥🔥

**6. Moon Phase Tracker** ❌ ЛИПСВА
- **Need:**
  - Install `suncalc` package
  - `lib/moon.ts`
  - `components/MoonPhaseWidget.tsx`
- **Effort:** 4 часа
- **Impact:** 🔥🔥🔥🔥

---

### 🟡 MEDIUM PRIORITY (Когато имаш време)

**7. Lucky Elements Expansion** ⚠️ ЧАСТИЧНО
- **Current:** Numbers, Element, Planet, Color готови
- **Missing:** Stones, Plants, Lucky Hours, Direction, Food
- **File:** Update `app/horoscope/[sign]/page.tsx`
- **Effort:** 2 часа
- **Impact:** 🔥🔥🔥

**8. Daily Mantra** ❌ ЛИПСВА
- **Need:** `components/DailyMantra.tsx`
- **Effort:** 2 часа
- **Impact:** 🔥🔥

**9. Service Pages Content** ⚠️ МОЖЕ ПО-ДОБРЕ
- **Current:** Natal Chart, Tarot, Oracle имат content
- **Need:** Expand educational content, add FAQs
- **Effort:** 6 часа (1-2h per page)
- **Impact:** 🔥🔥🔥

---

## 📋 DETAILED TASK LIST

### ✅ Task #1: Blog Category Hub Pages (4h)

**Status:** ❌ TODO
**Priority:** 🔴 CRITICAL
**Impact:** SEO blocking

**Files to create:**
```
app/blog/category/[slug]/page.tsx
```

**What it does:**
- Shows all blog posts from specific category
- URL: `/blog/category/astrology`, `/blog/category/tarot`, etc.
- SEO optimized for broad keywords

**Code:** See `TODO/QUICK_WINS.md` → Task #3

---

### ✅ Task #2: Blog Tag Hub Pages (3h)

**Status:** ❌ TODO
**Priority:** 🔴 CRITICAL
**Impact:** SEO + Navigation

**Files to create:**
```
app/blog/tag/[slug]/page.tsx
```

**What it does:**
- Shows all blog posts with specific tag
- URL: `/blog/tag/mercury-retrograde`, etc.
- Improves internal linking

**Code:** See `TODO/QUICK_WINS.md` → Task #4

---

### ✅ Task #3: Email Subscription Backend (3h)

**Status:** ⚠️ UI EXISTS, NO BACKEND
**Priority:** 🔴 CRITICAL
**Impact:** Growth blocker

**Current state:**
- ✅ UI form exists at `app/blog/[slug]/page.tsx` (lines 554-578)
- ❌ No `/api/newsletter/subscribe` endpoint
- ❌ No `newsletter_subscribers` table
- ❌ No daily email cron

**Files to create:**
```
app/api/newsletter/subscribe/route.ts
supabase/migrations/016_newsletter_subscribers.sql
app/api/cron/send-daily-horoscope/route.ts
```

**Code:** See `TODO/QUICK_WINS.md` → Task #1

---

### ✅ Task #4: About Page (3h)

**Status:** ❌ DOESN'T EXIST
**Priority:** 🔴 CRITICAL
**Impact:** Trust & SEO

**Files to create:**
```
app/about/page.tsx
```

**What it needs:**
- За Vrachka section
- Нашата мисия
- Как работи AI-то
- Защо ни доверяват
- Контакт CTA

**Code:** See `TODO/CRITICAL_SEO_FIXES.md` → Task #6

---

### ✅ Task #5: Rating System (3h)

**Status:** ❌ DOESN'T EXIST
**Priority:** 🟠 HIGH
**Impact:** Social proof

**Files to create:**
```
components/RatingWidget.tsx
app/api/ratings/submit/route.ts
supabase/migrations/017_ratings.sql
```

**Code:** See `TODO/QUICK_WINS.md` → Task #3

---

### ✅ Task #6: Moon Phase Tracker (4h)

**Status:** ❌ DOESN'T EXIST
**Priority:** 🟠 HIGH
**Impact:** Unique feature

**Install:**
```bash
npm install suncalc
```

**Files to create:**
```
lib/moon.ts
components/MoonPhaseWidget.tsx
```

**Where to add:**
- Horoscope pages
- Dashboard
- Blog sidebar

**Code:** See `TODO/QUICK_WINS.md` → Task #7

---

### ✅ Task #7: Lucky Elements Expansion (2h)

**Status:** ⚠️ BASIC VERSION EXISTS
**Priority:** 🟡 MEDIUM
**Current:**
- ✅ Lucky Numbers (in data, not displayed)
- ✅ Element (fire, earth, air, water)
- ✅ Planet (ruling planet)
- ✅ Color

**Missing:**
- ❌ Stones (камъни)
- ❌ Plants (растения)
- ❌ Lucky Hour (късметлийски час)
- ❌ Direction (посока)
- ❌ Food (храна)

**File to update:**
```
app/horoscope/[sign]/page.tsx
```

**Code:** See `TODO/QUICK_WINS.md` → Task #4

---

### ✅ Task #8: Daily Mantra (2h)

**Status:** ❌ DOESN'T EXIST
**Priority:** 🟡 MEDIUM
**Impact:** Engagement

**Files to create:**
```
components/DailyMantra.tsx
```

**Integration:**
- Add to horoscope pages
- Generate with AI (same call as horoscope)

**Code:** See `TODO/QUICK_WINS.md` → Task #5

---

## 🎯 RECOMMENDED EXECUTION ORDER

```
Week 1: Critical SEO Fixes
├─ Day 1-2: Task #1 - Blog Category Pages (4h)
├─ Day 2-3: Task #2 - Blog Tag Pages (3h)
├─ Day 3-4: Task #4 - About Page (3h)
└─ Day 4-5: Task #3 - Email Backend (3h)

Week 2-3: Quick Wins
├─ Day 6-7: Task #5 - Rating System (3h)
├─ Day 7-8: Task #6 - Moon Phase (4h)
├─ Day 8-9: Task #7 - Lucky Elements (2h)
└─ Day 9-10: Task #8 - Daily Mantra (2h)

Total: ~24 часа = 3 седмици при 8h/седмица
```

---

## 📊 SUCCESS METRICS

### Week 1-2 (Critical Tasks):
- ✅ Blog categories functional
- ✅ Blog tags functional
- ✅ About page live
- ✅ Email backend working
- 📈 Email signups: 10+/day

### Week 3-4 (Quick Wins):
- ✅ Ratings receiving feedback
- ✅ Moon phase showing
- ✅ Lucky elements expanded
- ✅ Daily mantra displaying
- 📈 User engagement: +30%

### Month 2-3 (Impact):
- 📈 SEO traffic: +50% (category/tag pages)
- 📈 Email list: 500+ subscribers
- 📈 Average session: +2 minutes
- 📈 Social shares: 100+/month

---

## 🔗 DETAILED DOCUMENTATION

### Implementation Guides:
- 📄 [QUICK_WINS.md](./QUICK_WINS.md) - Code examples за всички quick wins
- 📄 [CRITICAL_SEO_FIXES.md](./CRITICAL_SEO_FIXES.md) - SEO fixes (updated без i18n)
- 📄 [PRIORITY_ACTION_PLAN.md](./PRIORITY_ACTION_PLAN.md) - Full roadmap

### Quick Links:
- Current blog listing: `app/blog/page.tsx`
- Current blog post: `app/blog/[slug]/page.tsx`
- Email UI (needs backend): `app/blog/[slug]/page.tsx:554-578`
- Social sharing (✅ done): `components/blog/ShareButtons.tsx`
- Tarot (✅ done): `components/TarotReading.tsx`

---

## ⚠️ IMPORTANT NOTES

### What's REMOVED from plan:
- ❌ i18n/multilingual support - SKIP FOR NOW
- ❌ `/en/` URLs - НЕ Е НУЖНО
- ❌ hreflang tags - НЕ Е НУЖНО
- ❌ Language switcher - НЕ Е НУЖНО

### What's ADDED:
- ✅ Фокус 100% на български
- ✅ Структурата първо, превод после
- ✅ Focus на SEO за BG keywords

### What's ALREADY DONE:
- ✅ Social Sharing - перфектно работи!
- ✅ Tarot Card of Day - пълна реализация!
- ✅ Oracle Chat - AI работи отлично!
- ✅ Blog core system - listing + posts

---

## 🚀 NEXT ACTIONS

### For Product Owner:
1. ✅ Review updated plan
2. ✅ Approve priorities
3. ✅ Allocate 24 hours dev time
4. ✅ Track weekly progress

### For Developer (START HERE):
1. **TODAY:** Create `app/blog/category/[slug]/page.tsx` (4h)
2. **TOMORROW:** Create `app/blog/tag/[slug]/page.tsx` (3h)
3. **DAY 3:** Create `app/about/page.tsx` (3h)
4. **DAY 4:** Finish email backend (3h)
5. **WEEK 2:** Quick wins (ratings, moon, etc.)

### For Content:
1. Write "About Us" copy
2. Expand service pages content
3. Create category descriptions

---

## 📞 HELP & RESOURCES

**Code Examples:**
- All ready-to-use code in `TODO/QUICK_WINS.md`
- Step-by-step guides in `TODO/CRITICAL_SEO_FIXES.md`

**Questions?**
- Technical: Check code examples first
- SEO: Check CRITICAL_SEO_FIXES.md
- General: Read PRIORITY_ACTION_PLAN.md

---

**Last Review:** 29 October 2025
**Status:** Active - Ready to execute
**Focus:** 🇧🇬 Bulgarian only, structure first!
**Next Update:** After Phase 0 completion
