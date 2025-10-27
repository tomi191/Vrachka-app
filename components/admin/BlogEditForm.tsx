'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Eye, Loader2 } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string[] | null;
  tags: string[] | null;
  category: string;
  content_type: string;
  status: string;
  reading_time: number | null;
  word_count: number | null;
}

interface BlogEditFormProps {
  post: BlogPost;
}

export function BlogEditForm({ post }: BlogEditFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt || '',
    featuredImageUrl: post.featured_image_url || '',
    metaTitle: post.meta_title || post.title,
    metaDescription: post.meta_description || '',
    keywords: post.keywords?.join(', ') || '',
    tags: post.tags?.join(', ') || '',
    category: post.category,
    contentType: post.content_type,
    status: post.status,
  });

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch(`/api/blog/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: post.id,
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          excerpt: formData.excerpt,
          featuredImageUrl: formData.featuredImageUrl,
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          keywords: formData.keywords.split(',').map((k) => k.trim()).filter(Boolean),
          tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
          category: formData.category,
          contentType: formData.contentType,
          status: formData.status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update blog post');
      }

      router.push('/admin/blog');
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Грешка при запазване');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-50">Редактирай статия</h1>
            <p className="text-sm text-zinc-400">ID: {post.id}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href={`/blog/${post.slug}`} target="_blank">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Преглед
            </Button>
          </Link>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-accent-600 hover:bg-accent-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Запазване...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Запази промените
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="glass-card p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Заглавие *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-accent-500"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Slug (URL)
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-accent-500"
          />
          <p className="text-xs text-zinc-500 mt-1">
            URL: /blog/{formData.slug}
          </p>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Кратко описание (Excerpt)
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-accent-500"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Съдържание (HTML)
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={15}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 font-mono text-sm focus:outline-none focus:border-accent-500"
          />
        </div>

        {/* Featured Image URL */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Featured Image URL
          </label>
          <input
            type="url"
            value={formData.featuredImageUrl}
            onChange={(e) => setFormData({ ...formData, featuredImageUrl: e.target.value })}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-accent-500"
          />
          {formData.featuredImageUrl && (
            <img
              src={formData.featuredImageUrl}
              alt="Featured"
              className="mt-3 w-full h-48 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Grid: Category, Type, Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Категория
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-accent-500"
            >
              <option value="astrology">Астрология</option>
              <option value="tarot">Таро</option>
              <option value="numerology">Нумерология</option>
              <option value="spirituality">Духовност</option>
              <option value="general">Общо</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Content Type
            </label>
            <select
              value={formData.contentType}
              onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-accent-500"
            >
              <option value="tofu">TOFU (Awareness)</option>
              <option value="mofu">MOFU (Engagement)</option>
              <option value="bofu">BOFU (Conversion)</option>
              <option value="advertorial">Advertorial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Статус
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-accent-500"
            >
              <option value="draft">Чернова</option>
              <option value="published">Публикувана</option>
              <option value="archived">Архивирана</option>
            </select>
          </div>
        </div>

        {/* SEO Fields */}
        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-50">SEO</h3>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Meta Title
            </label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-accent-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Meta Description
            </label>
            <textarea
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-accent-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-accent-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-accent-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
