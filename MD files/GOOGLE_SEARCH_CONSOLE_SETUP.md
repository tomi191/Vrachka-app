# Google Search Console Setup за Vrachka

## 🎯 Защо е важно?

Google Search Console ти позволява да:
- Submitt-неш sitemap-а за по-бързо индексиране
- Виждаш кои keywords генерират clicks
- Мониториш SEO performance
- Откриваш и fix-ваш crawl errors
- Виждаш backlinks към сайта

---

## 📋 Стъпки за Setup

### 1. Отвори Google Search Console

🔗 https://search.google.com/search-console

Влез с Google акаунт (препоръчвам да използваш business email, не личен)

---

### 2. Добави Property

Има 2 типа property:

**Option A: Domain Property (Препоръчвам)**
- URL: `vrachka.app` (без https://)
- Верифицира всички subdomain-и и protocols (http, https, www, non-www)
- **По-добро за analytics**

**Option B: URL Prefix Property**
- URL: `https://vrachka.app`
- Само един specific URL

Избери **Domain Property** и натисни Continue.

---

### 3. Verification (Domain Property)

Google ще ти даде TXT record който трябва да добавиш в DNS:

```
Type: TXT
Name: @
Value: google-site-verification=XXXXXXXXXXXXXXXXXXXXX
```

#### Къде да добавиш DNS Record:

**Ако domain-а е на Vercel:**
1. Vercel Dashboard → Project → Settings → Domains
2. Scroll до DNS Records
3. Add Record:
   - Type: `TXT`
   - Name: `@`
   - Value: `google-site-verification=...` (копирай от Google)

**Ако domain-а е на друг registrar (GoDaddy, Namecheap, etc):**
1. Влез в domain registrar панела
2. DNS Management / DNS Settings
3. Add TXT Record както е описано по-горе

#### Verify

След като добавиш DNS record:
- Изчакай 1-5 минути (DNS propagation)
- Върни се в Google Search Console
- Натисни **Verify**

✅ Ако е успешно: "Ownership verified"
❌ Ако грешка: Изчакай още 10-15 минути и опитай пак

---

### 4. Submit Sitemap

След verification:

1. **В Google Search Console:** Sitemaps → Add new sitemap
2. **URL:** `https://vrachka.app/sitemap.xml`
3. **Submit**

Google ще започне да crawl-ва сайта. Първото индексиране отнема 1-7 дни.

#### Какво да очакваш:

| Време | Статус |
|-------|--------|
| 1-2 часа | Google е получил sitemap |
| 1-3 дни | Първи страници индексирани |
| 1 седмица | Пълно индексиране на всички страници |
| 2-4 седмици | SEO rankings започват да се появяват |

---

### 5. Monitor Performance

След 2-3 дни ще видиш данни в:

**Performance Tab:**
- Clicks, Impressions, CTR, Position
- Топ queries (keywords)
- Топ pages

**Coverage Tab:**
- Кои страници са indexed
- Errors, warnings

**Enhancements:**
- Mobile usability issues
- Core Web Vitals

---

## 🚀 Оптимизации след Setup

### Submit URL за бързо индексиране

Ако искаш конкретна страница да се индексира веднага:

1. Google Search Console → URL Inspection (top bar)
2. Въведи URL: `https://vrachka.app`
3. Test Live URL
4. Request Indexing

Правиш това за:
- Homepage: `https://vrachka.app`
- Pricing: `https://vrachka.app/pricing`
- Main pages

---

### Важни Keywords за tracking

След 1-2 седмици, провери rankings за:

**Primary Keywords:**
- дневен хороскоп
- таро четене онлайн
- астрология българия
- хороскоп днес
- безплатен хороскоп

**Branded:**
- vrachka
- врачка приложение

**Long-tail:**
- безплатно таро четене онлайн
- дневен хороскоп за [зодия]
- ai оракул

---

## 📊 Expected Results

### Week 1-2:
- 10-50 impressions/ден
- Indexed pages: 20-30

### Month 1:
- 100-500 impressions/ден
- Indexed pages: All (~33 pages)
- First clicks from "vrachka" branded searches

### Month 2-3:
- 500-2000 impressions/ден
- 10-50 clicks/ден
- Rankings за "дневен хороскоп" (position 30-50)

### Month 6:
- 2000-5000 impressions/ден
- 100-300 clicks/ден
- Rankings за main keywords (position 10-30)

---

## 🔥 Pro Tips

1. **Submit Sitemap weekly** за нови страници
2. **Check Coverage errors** всяка седмица
3. **Monitor Core Web Vitals** - трябва да са в "Good" zone
4. **Create blog content** с targeted keywords
5. **Build backlinks** от astrology/spiritual websites

---

## ✅ Checklist

- [ ] Add Vrachka domain в Google Search Console
- [ ] Verify ownership (DNS TXT record)
- [ ] Submit sitemap (`/sitemap.xml`)
- [ ] Request indexing за homepage
- [ ] Request indexing за /pricing
- [ ] Setup email notifications за errors
- [ ] Bookmark GSC dashboard за weekly checks

---

**След setup:**
Провери performance след 7-14 дни. Може да me ping-неш ако имаш въпроси или искаш да analyze данните! 🚀
