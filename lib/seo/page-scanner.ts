import fs from 'fs';
import path from 'path';
import { PageMetadata, calculateSEOScore, SEOScoreBreakdown } from './score-calculator';

export interface ScannedPage {
  path: string;
  displayName: string;
  category: 'service' | 'content' | 'legal' | 'other';
  metadata: PageMetadata;
  score: SEOScoreBreakdown;
  isStatic: boolean; // Can be edited in code vs database
}

/**
 * List of all public pages to scan
 * (Static pages - metadata in code)
 */
const PUBLIC_PAGES: Array<{
  path: string;
  displayName: string;
  category: 'service' | 'content' | 'legal' | 'other';
  filePath: string;
}> = [
  // Service Pages
  { path: '/', displayName: 'Начална страница', category: 'service', filePath: 'app/page.tsx' },
  { path: '/horoscope', displayName: 'Дневен Хороскоп', category: 'service', filePath: 'app/horoscope/page.tsx' },
  { path: '/natal-chart', displayName: 'Натална Карта', category: 'service', filePath: 'app/natal-chart/page.tsx' },
  { path: '/tarot', displayName: 'Таро Гадаене', category: 'service', filePath: 'app/tarot/page.tsx' },
  { path: '/moon-phase', displayName: 'Лунен Календар', category: 'service', filePath: 'app/moon-phase/page.tsx' },
  { path: '/features', displayName: 'Функции', category: 'service', filePath: 'app/features/page.tsx' },
  { path: '/pricing', displayName: 'Ценоразпис', category: 'service', filePath: 'app/pricing/page.tsx' },

  // Content Pages
  { path: '/about', displayName: 'За нас', category: 'content', filePath: 'app/about/page.tsx' },
  { path: '/blog', displayName: 'Блог (списък)', category: 'content', filePath: 'app/blog/page.tsx' },
  { path: '/contact', displayName: 'Контакт', category: 'content', filePath: 'app/contact/page.tsx' },

  // Legal Pages
  { path: '/privacy', displayName: 'Поверителност (БГ)', category: 'legal', filePath: 'app/privacy/page.tsx' },
  { path: '/privacy-en', displayName: 'Поверителност (EN)', category: 'legal', filePath: 'app/privacy-en/page.tsx' },
  { path: '/terms', displayName: 'Условия (БГ)', category: 'legal', filePath: 'app/terms/page.tsx' },
  { path: '/terms-en', displayName: 'Условия (EN)', category: 'legal', filePath: 'app/terms-en/page.tsx' },
  { path: '/cookies-policy', displayName: 'Бисквитки (БГ)', category: 'legal', filePath: 'app/cookies-policy/page.tsx' },
  { path: '/cookies-policy-en', displayName: 'Бисквитки (EN)', category: 'legal', filePath: 'app/cookies-policy-en/page.tsx' },
  { path: '/refund-policy', displayName: 'Възстановявания (БГ)', category: 'legal', filePath: 'app/refund-policy/page.tsx' },
  { path: '/refund-policy-en', displayName: 'Възстановявания (EN)', category: 'legal', filePath: 'app/refund-policy-en/page.tsx' },
];

/**
 * Scan all public pages and return metadata with SEO scores
 */
export async function scanAllPages(): Promise<ScannedPage[]> {
  const scannedPages: ScannedPage[] = [];

  // Scan static pages
  for (const page of PUBLIC_PAGES) {
    try {
      const metadata = await extractMetadataFromFile(page.filePath, page.path);
      const score = calculateSEOScore(metadata);

      scannedPages.push({
        path: page.path,
        displayName: page.displayName,
        category: page.category,
        metadata,
        score,
        isStatic: true,
      });
    } catch (error) {
      console.error(`Error scanning ${page.path}:`, error);
      // Add page with empty metadata
      scannedPages.push({
        path: page.path,
        displayName: page.displayName,
        category: page.category,
        metadata: { pagePath: page.path },
        score: calculateSEOScore({ pagePath: page.path }),
        isStatic: true,
      });
    }
  }

  return scannedPages;
}

/**
 * Extract metadata from a page.tsx file
 */
async function extractMetadataFromFile(
  relativeFilePath: string,
  pagePath: string
): Promise<PageMetadata> {
  const fullPath = path.join(process.cwd(), relativeFilePath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`File not found: ${fullPath}`);
    return { pagePath };
  }

  const content = fs.readFileSync(fullPath, 'utf-8');

  // Extract metadata export
  const metadata: PageMetadata = { pagePath };

  // Match: export const metadata: Metadata = {
  const metadataMatch = content.match(/export\s+const\s+metadata:\s*Metadata\s*=\s*\{([\s\S]*?)\n\}/);

  if (metadataMatch) {
    const metadataBlock = metadataMatch[1];

    // Extract title
    const titleMatch = metadataBlock.match(/title:\s*['"`](.*?)['"`]/);
    if (titleMatch) {
      metadata.title = titleMatch[1];
    }

    // Extract description
    const descMatch = metadataBlock.match(/description:\s*['"`](.*?)['"`]/s);
    if (descMatch) {
      metadata.description = descMatch[1].replace(/\n/g, ' ').trim();
    }

    // Extract keywords (array)
    const keywordsMatch = metadataBlock.match(/keywords:\s*\[([\s\S]*?)\]/);
    if (keywordsMatch) {
      const keywordsStr = keywordsMatch[1];
      metadata.keywords = keywordsStr
        .split(',')
        .map(k => k.trim().replace(/['"]/g, ''))
        .filter(k => k.length > 0);
    }

    // Extract OG image
    const ogImageMatch = metadataBlock.match(/images:\s*\[?\s*['"`]([^'"`]+)['"`]/);
    if (ogImageMatch) {
      metadata.ogImage = ogImageMatch[1];
    } else {
      // Try alternative format: images: [{ url: '...' }]
      const ogImageObjMatch = metadataBlock.match(/url:\s*['"`]([^'"`]+)['"`]/);
      if (ogImageObjMatch) {
        metadata.ogImage = ogImageObjMatch[1];
      }
    }
  }

  return metadata;
}

/**
 * Get metadata for a single page by path
 */
export async function getPageMetadata(pagePath: string): Promise<ScannedPage | null> {
  const page = PUBLIC_PAGES.find(p => p.path === pagePath);
  if (!page) return null;

  try {
    const metadata = await extractMetadataFromFile(page.filePath, page.path);
    const score = calculateSEOScore(metadata);

    return {
      path: page.path,
      displayName: page.displayName,
      category: page.category,
      metadata,
      score,
      isStatic: true,
    };
  } catch (error) {
    console.error(`Error getting metadata for ${pagePath}:`, error);
    return null;
  }
}

/**
 * Update metadata for a static page
 * WARNING: This modifies the source code file!
 */
export async function updatePageMetadata(
  pagePath: string,
  newMetadata: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  }
): Promise<boolean> {
  const page = PUBLIC_PAGES.find(p => p.path === pagePath);
  if (!page) {
    throw new Error(`Page not found: ${pagePath}`);
  }

  const fullPath = path.join(process.cwd(), page.filePath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }

  let content = fs.readFileSync(fullPath, 'utf-8');

  // Find and replace metadata block
  const metadataRegex = /export\s+const\s+metadata:\s*Metadata\s*=\s*\{([\s\S]*?)\n\}/;
  const match = content.match(metadataRegex);

  if (!match) {
    throw new Error(`No metadata export found in ${page.filePath}`);
  }

  // Build new metadata object
  const newMetadataStr = buildMetadataString(newMetadata);

  // Replace old metadata with new
  content = content.replace(metadataRegex, `export const metadata: Metadata = ${newMetadataStr}`);

  // Write back to file
  fs.writeFileSync(fullPath, content, 'utf-8');

  return true;
}

/**
 * Build metadata object string for TypeScript
 */
function buildMetadataString(metadata: {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
}): string {
  const parts: string[] = [];

  if (metadata.title) {
    parts.push(`  title: "${metadata.title}"`);
  }

  if (metadata.description) {
    const escapedDesc = metadata.description.replace(/"/g, '\\"');
    parts.push(`  description: "${escapedDesc}"`);
  }

  if (metadata.keywords && metadata.keywords.length > 0) {
    const keywordsStr = metadata.keywords.map(k => `"${k}"`).join(', ');
    parts.push(`  keywords: [${keywordsStr}]`);
  }

  if (metadata.ogImage) {
    parts.push(`  openGraph: {\n    images: ["${metadata.ogImage}"]\n  }`);
  }

  return `{\n${parts.join(',\n')}\n}`;
}
