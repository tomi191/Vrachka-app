import fs from 'fs';
import path from 'path';

export interface Keyword {
  keyword: string;
  searchVolume: string;
  difficulty: string;
  priority: string;
  targetPage?: string;
  currentRanking?: string;
}

export interface KeywordCategory {
  name: string;
  keywords: Keyword[];
}

export interface KeywordLibrary {
  primary: Keyword[];
  secondary: {
    astrology: Keyword[];
    tarot: Keyword[];
    numerology: Keyword[];
  };
  longTail: Keyword[];
  blog: Keyword[];
  transactional: Keyword[];
  local: Keyword[];
  seasonal: Keyword[];
  allKeywords: string[]; // Flat list of all keyword strings
}

/**
 * Parses the SEO Keyword Library markdown file
 */
export function parseKeywordLibrary(): KeywordLibrary {
  const filePath = path.join(process.cwd(), 'docs', 'SEO-KEYWORD-LIBRARY.md');

  if (!fs.existsSync(filePath)) {
    console.warn('SEO-KEYWORD-LIBRARY.md not found, returning empty library');
    return createEmptyLibrary();
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const library: KeywordLibrary = {
    primary: [],
    secondary: {
      astrology: [],
      tarot: [],
      numerology: [],
    },
    longTail: [],
    blog: [],
    transactional: [],
    local: [],
    seasonal: [],
    allKeywords: [],
  };

  let currentSection: string | null = null;
  let currentSubsection: 'astrology' | 'tarot' | 'numerology' | null = null;
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect sections
    if (line.startsWith('## Primary Keywords')) {
      currentSection = 'primary';
      currentSubsection = null;
      continue;
    }
    if (line.startsWith('## Secondary Keywords')) {
      currentSection = 'secondary';
      continue;
    }
    if (line.startsWith('### Астрология')) {
      currentSubsection = 'astrology';
      continue;
    }
    if (line.startsWith('### Таро')) {
      currentSubsection = 'tarot';
      continue;
    }
    if (line.startsWith('### Нумерология')) {
      currentSubsection = 'numerology';
      continue;
    }
    if (line.startsWith('## Long-tail Keywords')) {
      currentSection = 'longTail';
      currentSubsection = null;
      continue;
    }
    if (line.startsWith('## Blog Content Keywords')) {
      currentSection = 'blog';
      currentSubsection = null;
      continue;
    }
    if (line.startsWith('## Transactional Keywords')) {
      currentSection = 'transactional';
      currentSubsection = null;
      continue;
    }
    if (line.startsWith('## Local Keywords')) {
      currentSection = 'local';
      currentSubsection = null;
      continue;
    }
    if (line.startsWith('## Seasonal Keywords')) {
      currentSection = 'seasonal';
      currentSubsection = null;
      continue;
    }

    // Detect table headers (skip them)
    if (line.startsWith('|') && line.includes('Keyword') && line.includes('Search Volume')) {
      inTable = true;
      i++; // Skip separator line
      continue;
    }

    // Parse table rows
    if (inTable && line.startsWith('|') && line !== '|' && !line.includes('---')) {
      const keyword = parseTableRow(line);
      if (keyword && currentSection) {
        // Add to appropriate category
        if (currentSection === 'primary') {
          library.primary.push(keyword);
        } else if (currentSection === 'secondary' && currentSubsection) {
          library.secondary[currentSubsection].push(keyword);
        } else if (currentSection === 'longTail') {
          library.longTail.push(keyword);
        } else if (currentSection === 'blog') {
          library.blog.push(keyword);
        } else if (currentSection === 'transactional') {
          library.transactional.push(keyword);
        } else if (currentSection === 'local') {
          library.local.push(keyword);
        } else if (currentSection === 'seasonal') {
          library.seasonal.push(keyword);
        }
      }
    }

    // Exit table on empty line or new section
    if (line === '' || line.startsWith('#')) {
      inTable = false;
    }
  }

  // Build flat keyword list
  library.allKeywords = [
    ...library.primary.map(k => k.keyword),
    ...library.secondary.astrology.map(k => k.keyword),
    ...library.secondary.tarot.map(k => k.keyword),
    ...library.secondary.numerology.map(k => k.keyword),
    ...library.longTail.map(k => k.keyword),
    ...library.blog.map(k => k.keyword),
    ...library.transactional.map(k => k.keyword),
    ...library.local.map(k => k.keyword),
    ...library.seasonal.map(k => k.keyword),
  ];

  return library;
}

/**
 * Parse a single table row into a Keyword object
 */
function parseTableRow(line: string): Keyword | null {
  const cells = line
    .split('|')
    .map(cell => cell.trim())
    .filter(cell => cell !== '');

  if (cells.length < 4) return null;

  const keyword: Keyword = {
    keyword: cells[0],
    searchVolume: cells[1],
    difficulty: cells[2],
    priority: cells[3],
  };

  // Optional fields
  if (cells[4]) keyword.currentRanking = cells[4];
  if (cells[5]) keyword.targetPage = cells[5];

  return keyword;
}

/**
 * Get keywords relevant to a specific page path
 */
export function getKeywordsForPage(pagePath: string): Keyword[] {
  const library = parseKeywordLibrary();
  const allKeywords = [
    ...library.primary,
    ...library.secondary.astrology,
    ...library.secondary.tarot,
    ...library.secondary.numerology,
    ...library.longTail,
    ...library.blog,
    ...library.transactional,
    ...library.local,
    ...library.seasonal,
  ];

  // Filter keywords that target this page
  return allKeywords.filter(keyword => {
    if (!keyword.targetPage) return false;

    // Normalize paths for comparison
    const normalizedTarget = keyword.targetPage.toLowerCase().replace(/^\//, '');
    const normalizedPage = pagePath.toLowerCase().replace(/^\//, '');

    return normalizedTarget === normalizedPage ||
           normalizedTarget.startsWith(normalizedPage) ||
           normalizedPage.startsWith(normalizedTarget);
  });
}

/**
 * Get top priority keywords
 */
export function getTopPriorityKeywords(count: number = 10): Keyword[] {
  const library = parseKeywordLibrary();

  // Priority P0 and P1 keywords
  const priorityKeywords = [
    ...library.primary,
    ...library.secondary.astrology,
    ...library.secondary.tarot,
    ...library.secondary.numerology,
  ].filter(k => k.priority.includes('P0') || k.priority.includes('P1'));

  return priorityKeywords.slice(0, count);
}

/**
 * Search keywords by query
 */
export function searchKeywords(query: string): Keyword[] {
  const library = parseKeywordLibrary();
  const allKeywords = [
    ...library.primary,
    ...library.secondary.astrology,
    ...library.secondary.tarot,
    ...library.secondary.numerology,
    ...library.longTail,
    ...library.blog,
  ];

  const lowerQuery = query.toLowerCase();
  return allKeywords.filter(k =>
    k.keyword.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get keyword suggestions for content based on topic
 */
export function getKeywordSuggestions(topic: 'astrology' | 'tarot' | 'numerology' | 'general'): string[] {
  const library = parseKeywordLibrary();

  if (topic === 'astrology') {
    return library.secondary.astrology.map(k => k.keyword).slice(0, 10);
  }
  if (topic === 'tarot') {
    return library.secondary.tarot.map(k => k.keyword).slice(0, 10);
  }
  if (topic === 'numerology') {
    return library.secondary.numerology.map(k => k.keyword).slice(0, 10);
  }

  // General - return top priority from all categories
  return library.primary.map(k => k.keyword).slice(0, 10);
}

function createEmptyLibrary(): KeywordLibrary {
  return {
    primary: [],
    secondary: {
      astrology: [],
      tarot: [],
      numerology: [],
    },
    longTail: [],
    blog: [],
    transactional: [],
    local: [],
    seasonal: [],
    allKeywords: [],
  };
}
