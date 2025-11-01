'use client';

import { useEffect, useState } from 'react';
import { Search, RefreshCw, Filter, ChevronDown, ChevronUp, Sparkles, Check, X } from 'lucide-react';
import { ScannedPage } from '@/lib/seo/page-scanner';

interface SEOStats {
  total: number;
  excellent: number;
  good: number;
  needsWork: number;
  averageScore: number;
}

interface RegeneratedMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImagePrompt?: string;
  reasoning?: string;
}

export default function SEOManagerPage() {
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [filteredPages, setFilteredPages] = useState<ScannedPage[]>([]);
  const [stats, setStats] = useState<SEOStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const [expandedPage, setExpandedPage] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [regeneratedData, setRegeneratedData] = useState<Record<string, RegeneratedMetadata>>({});

  // Load pages on mount
  useEffect(() => {
    loadPages();
  }, []);

  // Filter pages when filters change
  useEffect(() => {
    filterPages();
  }, [pages, searchQuery, categoryFilter, scoreFilter]);

  async function loadPages() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/seo/pages');
      const data = await response.json();

      if (data.success) {
        setPages(data.pages);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load pages:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterPages() {
    let filtered = [...pages];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.displayName.toLowerCase().includes(query) ||
          p.path.toLowerCase().includes(query) ||
          p.metadata.title?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Score filter
    if (scoreFilter !== 'all') {
      if (scoreFilter === 'excellent') {
        filtered = filtered.filter(p => p.score.totalScore >= 80);
      } else if (scoreFilter === 'good') {
        filtered = filtered.filter(p => p.score.totalScore >= 60 && p.score.totalScore < 80);
      } else if (scoreFilter === 'needs-work') {
        filtered = filtered.filter(p => p.score.totalScore < 60);
      }
    }

    setFilteredPages(filtered);
  }

  async function regenerateMetadata(pagePath: string) {
    try {
      setRegenerating(pagePath);
      const response = await fetch('/api/admin/seo/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pagePath }),
      });

      const data = await response.json();

      if (data.success) {
        setRegeneratedData(prev => ({
          ...prev,
          [pagePath]: data.regenerated,
        }));
      }
    } catch (error) {
      console.error('Failed to regenerate:', error);
    } finally {
      setRegenerating(null);
    }
  }

  async function applyRegeneratedMetadata(pagePath: string) {
    const regenerated = regeneratedData[pagePath];
    if (!regenerated) return;

    try {
      const response = await fetch('/api/admin/seo/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pagePath,
          title: regenerated.title,
          description: regenerated.description,
          keywords: regenerated.keywords,
        }),
      });

      if (response.ok) {
        // Reload pages
        await loadPages();
        // Clear regenerated data
        setRegeneratedData(prev => {
          const updated = { ...prev };
          delete updated[pagePath];
          return updated;
        });
      }
    } catch (error) {
      console.error('Failed to apply metadata:', error);
    }
  }

  function getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  }

  function getScoreBadge(score: number): string {
    if (score >= 80) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (score >= 40) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-zinc-400">Loading SEO data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-50 mb-2">SEO Manager</h1>
        <p className="text-zinc-400">Manage metadata and SEO scores for all pages</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <div className="text-sm text-zinc-400 mb-1">Total Pages</div>
            <div className="text-2xl font-bold text-zinc-50">{stats.total}</div>
          </div>
          <div className="bg-zinc-900/50 border border-green-500/20 rounded-lg p-4">
            <div className="text-sm text-zinc-400 mb-1">Excellent (80+)</div>
            <div className="text-2xl font-bold text-green-500">{stats.excellent}</div>
          </div>
          <div className="bg-zinc-900/50 border border-yellow-500/20 rounded-lg p-4">
            <div className="text-sm text-zinc-400 mb-1">Good (60-79)</div>
            <div className="text-2xl font-bold text-yellow-500">{stats.good}</div>
          </div>
          <div className="bg-zinc-900/50 border border-red-500/20 rounded-lg p-4">
            <div className="text-sm text-zinc-400 mb-1">Needs Work (&lt;60)</div>
            <div className="text-2xl font-bold text-red-500">{stats.needsWork}</div>
          </div>
          <div className="bg-zinc-900/50 border border-accent-500/20 rounded-lg p-4">
            <div className="text-sm text-zinc-400 mb-1">Avg Score</div>
            <div className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
              {stats.averageScore.toFixed(1)}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-50 focus:border-accent-500 focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-50 focus:border-accent-500 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="service">Service Pages</option>
          <option value="content">Content Pages</option>
          <option value="legal">Legal Pages</option>
          <option value="other">Other</option>
        </select>

        {/* Score Filter */}
        <select
          value={scoreFilter}
          onChange={e => setScoreFilter(e.target.value)}
          className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-50 focus:border-accent-500 focus:outline-none"
        >
          <option value="all">All Scores</option>
          <option value="excellent">Excellent (80+)</option>
          <option value="good">Good (60-79)</option>
          <option value="needs-work">Needs Work (&lt;60)</option>
        </select>

        {/* Refresh Button */}
        <button
          onClick={loadPages}
          className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-50 hover:bg-zinc-800 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Pages Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-900 border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-400">Page</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-400">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-400">Score</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-400">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-400">Description</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.map(page => (
                <tr key={page.path} className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-zinc-50">{page.displayName}</div>
                      <div className="text-xs text-zinc-500">{page.path}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded">
                      {page.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getScoreBadge(page.score.totalScore)}`}>
                      <span className="text-lg font-bold">{page.score.totalScore}</span>
                      <span className="text-xs">/100</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="text-sm text-zinc-300 truncate">{page.metadata.title || '-'}</div>
                    <div className="text-xs text-zinc-500">{page.metadata.title?.length || 0} chars</div>
                  </td>
                  <td className="px-4 py-3 max-w-sm">
                    <div className="text-sm text-zinc-300 truncate">{page.metadata.description || '-'}</div>
                    <div className="text-xs text-zinc-500">{page.metadata.description?.length || 0} chars</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedPage(expandedPage === page.path ? null : page.path)}
                        className="p-2 text-zinc-400 hover:text-zinc-50 transition-colors"
                        title="View details"
                      >
                        {expandedPage === page.path ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => regenerateMetadata(page.path)}
                        disabled={regenerating === page.path}
                        className="p-2 text-accent-400 hover:text-accent-300 transition-colors disabled:opacity-50"
                        title="Regenerate with AI"
                      >
                        {regenerating === page.path ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
                {/* Expanded Details Row */}
                {expandedPage === page.path && (
                  <tr className="bg-zinc-900/70">
                    <td colSpan={6} className="px-4 py-6">
                      <div className="space-y-4">
                        {/* Score Breakdown */}
                        <div>
                          <h4 className="text-sm font-semibold text-zinc-400 mb-2">Score Breakdown</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div className="bg-zinc-800/50 px-3 py-2 rounded">
                              <div className="text-xs text-zinc-500">Title</div>
                              <div className="text-sm font-medium text-zinc-200">{page.score.titleScore}/20</div>
                            </div>
                            <div className="bg-zinc-800/50 px-3 py-2 rounded">
                              <div className="text-xs text-zinc-500">Description</div>
                              <div className="text-sm font-medium text-zinc-200">{page.score.descriptionScore}/20</div>
                            </div>
                            <div className="bg-zinc-800/50 px-3 py-2 rounded">
                              <div className="text-xs text-zinc-500">Keywords</div>
                              <div className="text-sm font-medium text-zinc-200">{page.score.keywordsScore}/15</div>
                            </div>
                            <div className="bg-zinc-800/50 px-3 py-2 rounded">
                              <div className="text-xs text-zinc-500">OG Image</div>
                              <div className="text-sm font-medium text-zinc-200">{page.score.ogImageScore}/10</div>
                            </div>
                          </div>
                        </div>

                        {/* Issues & Recommendations */}
                        {(page.score.issues.length > 0 || page.score.recommendations.length > 0) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {page.score.issues.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-red-400 mb-2">Issues</h4>
                                <ul className="space-y-1">
                                  {page.score.issues.map((issue, idx) => (
                                    <li key={idx} className="text-xs text-zinc-400 flex items-start gap-2">
                                      <X className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                                      <span>{issue}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {page.score.recommendations.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-yellow-400 mb-2">Recommendations</h4>
                                <ul className="space-y-1">
                                  {page.score.recommendations.map((rec, idx) => (
                                    <li key={idx} className="text-xs text-zinc-400 flex items-start gap-2">
                                      <Check className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                      <span>{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Keywords */}
                        {page.metadata.keywords && page.metadata.keywords.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-zinc-400 mb-2">Current Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                              {page.metadata.keywords.map((kw, idx) => (
                                <span key={idx} className="text-xs px-2 py-1 bg-accent-500/20 text-accent-300 rounded">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Regenerated Metadata (if available) */}
                        {regeneratedData[page.path] && (
                          <div className="border-t border-zinc-700 pt-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-semibold text-accent-400">AI Regenerated Metadata</h4>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => applyRegeneratedMetadata(page.path)}
                                  className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-xs hover:bg-green-500/30 transition-colors"
                                >
                                  Apply
                                </button>
                                <button
                                  onClick={() => setRegeneratedData(prev => {
                                    const updated = { ...prev };
                                    delete updated[page.path];
                                    return updated;
                                  })}
                                  className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs hover:bg-red-500/30 transition-colors"
                                >
                                  Discard
                                </button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <div className="text-xs text-zinc-500">New Title ({regeneratedData[page.path].title.length} chars)</div>
                                <div className="text-sm text-zinc-200">{regeneratedData[page.path].title}</div>
                              </div>
                              <div>
                                <div className="text-xs text-zinc-500">New Description ({regeneratedData[page.path].description.length} chars)</div>
                                <div className="text-sm text-zinc-200">{regeneratedData[page.path].description}</div>
                              </div>
                              <div>
                                <div className="text-xs text-zinc-500">New Keywords ({regeneratedData[page.path].keywords.length} total)</div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {regeneratedData[page.path].keywords.map((kw, idx) => (
                                    <span key={idx} className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded">
                                      {kw}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              {regeneratedData[page.path].reasoning && (
                                <div>
                                  <div className="text-xs text-zinc-500">AI Reasoning</div>
                                  <div className="text-xs text-zinc-400 italic">{regeneratedData[page.path].reasoning}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            </tbody>
          </table>
        </div>

        {filteredPages.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            No pages found matching your filters
          </div>
        )}
      </div>
    </div>
  );
}
