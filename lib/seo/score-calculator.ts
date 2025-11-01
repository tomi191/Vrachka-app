import { parseKeywordLibrary } from './keyword-library';

export interface SEOScoreBreakdown {
  titleScore: number; // 0-20
  descriptionScore: number; // 0-20
  keywordsScore: number; // 0-15
  keywordsInTitleScore: number; // 0-15
  keywordsInDescriptionScore: number; // 0-15
  ogImageScore: number; // 0-10
  keywordLibraryMatchScore: number; // 0-5
  totalScore: number; // 0-100
  issues: string[];
  recommendations: string[];
}

export interface PageMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  pagePath: string;
}

/**
 * Calculate SEO score for a page (0-100)
 */
export function calculateSEOScore(metadata: PageMetadata): SEOScoreBreakdown {
  const breakdown: SEOScoreBreakdown = {
    titleScore: 0,
    descriptionScore: 0,
    keywordsScore: 0,
    keywordsInTitleScore: 0,
    keywordsInDescriptionScore: 0,
    ogImageScore: 0,
    keywordLibraryMatchScore: 0,
    totalScore: 0,
    issues: [],
    recommendations: [],
  };

  // 1. Title Score (0-20 points)
  breakdown.titleScore = scoreTitleLength(metadata.title, breakdown);

  // 2. Description Score (0-20 points)
  breakdown.descriptionScore = scoreDescriptionLength(metadata.description, breakdown);

  // 3. Keywords Score (0-15 points)
  breakdown.keywordsScore = scoreKeywordsCount(metadata.keywords, breakdown);

  // 4. Keywords in Title (0-15 points)
  breakdown.keywordsInTitleScore = scoreKeywordsInTitle(
    metadata.title,
    metadata.keywords,
    breakdown
  );

  // 5. Keywords in Description (0-15 points)
  breakdown.keywordsInDescriptionScore = scoreKeywordsInDescription(
    metadata.description,
    metadata.keywords,
    breakdown
  );

  // 6. OG Image Score (0-10 points)
  breakdown.ogImageScore = scoreOGImage(metadata.ogImage, breakdown);

  // 7. Keyword Library Match (0-5 points)
  breakdown.keywordLibraryMatchScore = scoreKeywordLibraryMatch(
    metadata.pagePath,
    metadata.keywords,
    breakdown
  );

  // Calculate total
  breakdown.totalScore =
    breakdown.titleScore +
    breakdown.descriptionScore +
    breakdown.keywordsScore +
    breakdown.keywordsInTitleScore +
    breakdown.keywordsInDescriptionScore +
    breakdown.ogImageScore +
    breakdown.keywordLibraryMatchScore;

  return breakdown;
}

/**
 * Score title length (ideal: 50-60 chars)
 */
function scoreTitleLength(title: string | undefined, breakdown: SEOScoreBreakdown): number {
  if (!title) {
    breakdown.issues.push('Липсва meta title');
    breakdown.recommendations.push('Добави meta title (50-60 символа)');
    return 0;
  }

  const length = title.length;

  if (length === 0) {
    breakdown.issues.push('Празен title');
    return 0;
  }

  if (length >= 50 && length <= 60) {
    return 20; // Perfect
  }

  if (length >= 40 && length < 50) {
    breakdown.recommendations.push(`Title е малко къс (${length} chars). Идеал: 50-60.`);
    return 15;
  }

  if (length > 60 && length <= 70) {
    breakdown.recommendations.push(`Title е малко дълъг (${length} chars). Идеал: 50-60.`);
    return 15;
  }

  if (length < 40) {
    breakdown.issues.push(`Title е твърде къс (${length} chars)`);
    breakdown.recommendations.push('Увеличи title до 50-60 символа');
    return 10;
  }

  // length > 70
  breakdown.issues.push(`Title е твърде дълъг (${length} chars)`);
  breakdown.recommendations.push('Намали title до 50-60 символа');
  return 10;
}

/**
 * Score description length (ideal: 150-160 chars)
 */
function scoreDescriptionLength(
  description: string | undefined,
  breakdown: SEOScoreBreakdown
): number {
  if (!description) {
    breakdown.issues.push('Липсва meta description');
    breakdown.recommendations.push('Добави meta description (150-160 символа)');
    return 0;
  }

  const length = description.length;

  if (length === 0) {
    breakdown.issues.push('Празна description');
    return 0;
  }

  if (length >= 150 && length <= 160) {
    return 20; // Perfect
  }

  if (length >= 130 && length < 150) {
    breakdown.recommendations.push(`Description е малко къса (${length} chars). Идеал: 150-160.`);
    return 15;
  }

  if (length > 160 && length <= 180) {
    breakdown.recommendations.push(`Description е малко дълга (${length} chars). Идеал: 150-160.`);
    return 15;
  }

  if (length < 130) {
    breakdown.issues.push(`Description е твърде къса (${length} chars)`);
    breakdown.recommendations.push('Увеличи description до 150-160 символа');
    return 10;
  }

  // length > 180
  breakdown.issues.push(`Description е твърде дълга (${length} chars)`);
  breakdown.recommendations.push('Намали description до 150-160 символа');
  return 10;
}

/**
 * Score keywords count (ideal: 5-15 keywords)
 */
function scoreKeywordsCount(keywords: string[] | undefined, breakdown: SEOScoreBreakdown): number {
  if (!keywords || keywords.length === 0) {
    breakdown.issues.push('Липсват keywords');
    breakdown.recommendations.push('Добави 5-15 релевантни keywords');
    return 0;
  }

  const count = keywords.length;

  if (count >= 5 && count <= 15) {
    return 15; // Perfect
  }

  if (count >= 3 && count < 5) {
    breakdown.recommendations.push(`Малко keywords (${count}). Препоръчително: 5-15.`);
    return 10;
  }

  if (count > 15 && count <= 20) {
    breakdown.recommendations.push(`Много keywords (${count}). Препоръчително: 5-15.`);
    return 10;
  }

  if (count < 3) {
    breakdown.issues.push(`Твърде малко keywords (${count})`);
    return 5;
  }

  // count > 20
  breakdown.issues.push(`Твърде много keywords (${count})`);
  breakdown.recommendations.push('Намали keywords до 5-15 най-релевантни');
  return 5;
}

/**
 * Score keyword presence in title
 */
function scoreKeywordsInTitle(
  title: string | undefined,
  keywords: string[] | undefined,
  breakdown: SEOScoreBreakdown
): number {
  if (!title || !keywords || keywords.length === 0) {
    return 0;
  }

  const titleLower = title.toLowerCase();
  const matchedKeywords = keywords.filter(kw =>
    titleLower.includes(kw.toLowerCase())
  );

  const matchRate = matchedKeywords.length / keywords.length;

  if (matchRate >= 0.4) {
    return 15; // Good keyword usage
  }

  if (matchRate >= 0.2) {
    breakdown.recommendations.push('Включи повече keywords в title');
    return 10;
  }

  breakdown.issues.push('Много малко keywords в title');
  breakdown.recommendations.push('Включи основни keywords в title');
  return 5;
}

/**
 * Score keyword presence in description
 */
function scoreKeywordsInDescription(
  description: string | undefined,
  keywords: string[] | undefined,
  breakdown: SEOScoreBreakdown
): number {
  if (!description || !keywords || keywords.length === 0) {
    return 0;
  }

  const descLower = description.toLowerCase();
  const matchedKeywords = keywords.filter(kw =>
    descLower.includes(kw.toLowerCase())
  );

  const matchRate = matchedKeywords.length / keywords.length;

  if (matchRate >= 0.3) {
    return 15; // Good keyword usage
  }

  if (matchRate >= 0.15) {
    breakdown.recommendations.push('Включи повече keywords в description');
    return 10;
  }

  breakdown.issues.push('Много малко keywords в description');
  breakdown.recommendations.push('Използвай keywords естествено в description');
  return 5;
}

/**
 * Score OG image presence
 */
function scoreOGImage(ogImage: string | undefined, breakdown: SEOScoreBreakdown): number {
  if (!ogImage || ogImage.trim() === '') {
    breakdown.issues.push('Липсва OG Image');
    breakdown.recommendations.push('Добави OG Image (1200x630px)');
    return 0;
  }

  // Check if it's a valid URL or path
  if (ogImage.startsWith('http') || ogImage.startsWith('/')) {
    return 10; // Has OG image
  }

  breakdown.issues.push('Невалиден OG Image URL');
  return 5;
}

/**
 * Score keyword library match
 */
function scoreKeywordLibraryMatch(
  pagePath: string,
  keywords: string[] | undefined,
  breakdown: SEOScoreBreakdown
): number {
  if (!keywords || keywords.length === 0) {
    return 0;
  }

  try {
    const library = parseKeywordLibrary();
    const allLibraryKeywords = library.allKeywords.map(k => k.toLowerCase());

    const matchedKeywords = keywords.filter(kw =>
      allLibraryKeywords.includes(kw.toLowerCase())
    );

    const matchRate = matchedKeywords.length / keywords.length;

    if (matchRate >= 0.5) {
      return 5; // Good match with keyword library
    }

    if (matchRate >= 0.3) {
      breakdown.recommendations.push('Използвай повече keywords от keyword library');
      return 3;
    }

    breakdown.recommendations.push('Добави keywords от SEO keyword library');
    return 1;
  } catch (error) {
    console.error('Error parsing keyword library:', error);
    return 0;
  }
}

/**
 * Get score color class for UI
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
}

/**
 * Get score badge class for UI
 */
export function getScoreBadge(score: number): string {
  if (score >= 80) return 'bg-green-500/20 text-green-400 border-green-500/30';
  if (score >= 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  if (score >= 40) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
  return 'bg-red-500/20 text-red-400 border-red-500/30';
}

/**
 * Get score label
 */
export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Отлично';
  if (score >= 60) return 'Добро';
  if (score >= 40) return 'Средно';
  return 'Лошо';
}
