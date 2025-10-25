# OG Image / Open Graph Image

## Текущо състояние ✅

- **Файл:** `og-image.svg`
- **Размер:** 1200x630px
- **Формат:** SVG (vector)
- **Използва се в:** `app/layout.tsx`

SVG форматът работи перфектно за Open Graph images и има предимства:
- ✅ Малък размер (KB вместо MB)
- ✅ Винаги sharp качество
- ✅ Поддържа се от Facebook, Twitter, LinkedIn

---

## Ако искаш PNG версия (optional)

Някои платформи (рядко) може да не поддържат SVG. Ето как да конвертираш:

### Метод 1: Online Tool (най-бързо)
1. Отвори https://cloudconvert.com/svg-to-png
2. Upload `og-image.svg`
3. Set width: 1200px, height: 630px
4. Download като `og-image.png`
5. Копирай в `public/` папката

### Метод 2: Figma/Photoshop
1. Отвори `og-image.svg` във Figma или Photoshop
2. Export as PNG (1200x630)
3. Запази като `og-image.png`

### Метод 3: Command Line (за advanced users)
```bash
# Използвай Inkscape (безплатен)
inkscape og-image.svg -w 1200 -h 630 --export-filename=og-image.png

# Или ImageMagick
convert -background none og-image.svg -resize 1200x630 og-image.png
```

### След конверсия:
Промени в `app/layout.tsx`:
```typescript
url: '/og-image.png', // от '/og-image.svg'
type: 'image/png',    // от 'image/svg+xml'
```

---

## Персонализация на OG Image

Ако искаш да промениш дизайна:

1. **Редактирай SVG директно:**
   - Отвори `og-image.svg` в text editor
   - Промени цветовете в gradient definitions
   - Промени текста в `<text>` елементите

2. **Или използвай design tool:**
   - Canva (easiest)
   - Figma (advanced)
   - Adobe Illustrator (professional)

**Важно:** Запази размер 1200x630px за оптимално качество.

---

## Testing OG Image

След промяна, провери как изглежда:

1. **Facebook Debugger:**
   https://developers.facebook.com/tools/debug/

2. **Twitter Card Validator:**
   https://cards-dev.twitter.com/validator

3. **LinkedIn Post Inspector:**
   https://www.linkedin.com/post-inspector/

4. **Generic OG Checker:**
   https://www.opengraph.xyz/

---

## Размери за различни платформи

| Платформа | Препоръчителен размер |
|-----------|----------------------|
| Facebook | 1200x630px ✅ |
| Twitter | 1200x628px ✅ |
| LinkedIn | 1200x627px ✅ |
| WhatsApp | 1200x630px ✅ |

Текущият 1200x630px работи перфектно за всички!
