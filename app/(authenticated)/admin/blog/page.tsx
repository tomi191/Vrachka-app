import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FileText, Plus, Eye, Pencil, Trash2, TrendingUp, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddImagesButton } from '@/components/admin/AddImagesButton';

export default async function AdminBlogPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/dashboard');
  }

  // Get all blog posts
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  const stats = {
    total: blogPosts?.length || 0,
    published: blogPosts?.filter((p) => p.status === 'published').length || 0,
    draft: blogPosts?.filter((p) => p.status === 'draft').length || 0,
    totalViews: blogPosts?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0,
  };

  const contentTypeLabels = {
    tofu: 'TOFU (Awareness)',
    mofu: 'MOFU (Engagement)',
    bofu: 'BOFU (Conversion)',
    advertorial: 'Advertorial',
  };

  const categoryLabels = {
    astrology: 'Астрология',
    tarot: 'Таро',
    numerology: 'Нумерология',
    spirituality: 'Духовност',
    general: 'Общо',
  };

  const statusLabels = {
    draft: 'Чернова',
    published: 'Публикувана',
    archived: 'Архивирана',
  };

  const statusColors = {
    draft: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    published: 'bg-green-500/10 text-green-400 border-green-500/20',
    archived: 'bg-zinc-600/10 text-zinc-400 border-zinc-600/20',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-50 flex items-center gap-3">
            <FileText className="w-8 h-8 text-accent-400" />
            AI Блог Система
          </h1>
          <p className="text-zinc-400 mt-1">
            Генерирай и управлявай AI-powered blog съдържание
          </p>
        </div>
        <Link href="/admin/blog/create">
          <Button className="bg-accent-600 hover:bg-accent-700">
            <Plus className="w-4 h-4 mr-2" />
            Създай нова статия
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-zinc-50">{stats.total}</div>
              <div className="text-sm text-zinc-400">Всички статии</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-green-400" />
            <div>
              <div className="text-2xl font-bold text-zinc-50">{stats.published}</div>
              <div className="text-sm text-zinc-400">Публикувани</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold text-zinc-50">{stats.draft}</div>
              <div className="text-sm text-zinc-400">Чернови</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <div>
              <div className="text-2xl font-bold text-zinc-50">
                {stats.totalViews.toLocaleString('bg-BG')}
              </div>
              <div className="text-sm text-zinc-400">Прегледи</div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="glass-card p-6">
        <div className="overflow-x-auto">
          {!blogPosts || blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-zinc-300 mb-2">
                Няма създадени статии
              </h3>
              <p className="text-zinc-500 mb-6">
                Започни да създаваш AI-генерирано съдържание
              </p>
              <Link href="/admin/blog/create">
                <Button className="bg-accent-600 hover:bg-accent-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Създай първата статия
                </Button>
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">
                    Заглавие
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">
                    Категория
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">
                    Тип
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">
                    Статус
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">
                    Прегледи
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">
                    Конверсии
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">
                    Създадена
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {blogPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="max-w-md">
                        <div className="font-semibold text-zinc-100 mb-1 line-clamp-1">
                          {post.title}
                        </div>
                        {post.excerpt && (
                          <div className="text-sm text-zinc-500 line-clamp-1">
                            {post.excerpt}
                          </div>
                        )}
                        {post.ai_generated && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              AI Generated
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-zinc-300">
                        {post.category ? categoryLabels[post.category as keyof typeof categoryLabels] : '-'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {post.content_type ? contentTypeLabels[post.content_type as keyof typeof contentTypeLabels] : '-'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${
                          post.status ? statusColors[post.status as keyof typeof statusColors] : statusColors.draft
                        }`}
                      >
                        {post.status ? statusLabels[post.status as keyof typeof statusLabels] : 'Чернова'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Eye className="w-3 h-3 text-zinc-500" />
                        <span className="text-sm text-zinc-300">
                          {(post.view_count || 0).toLocaleString('bg-BG')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="text-sm text-zinc-300">
                        {post.conversion_count || 0}
                        {post.conversion_rate && post.conversion_rate > 0 && (
                          <span className="text-xs text-zinc-500 ml-1">
                            ({post.conversion_rate.toFixed(1)}%)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-zinc-400">
                        {new Date(post.created_at).toLocaleDateString('bg-BG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <AddImagesButton
                          slug={post.slug}
                          hasFeaturedImage={!!post.featured_image_url}
                        />
                        {post.status === 'published' && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
                            title="Преглед"
                          >
                            <Eye className="w-4 h-4 text-zinc-400" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/blog/edit/${post.id}`}
                          className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
                          title="Редактирай"
                        >
                          <Pencil className="w-4 h-4 text-zinc-400" />
                        </Link>
                        <button
                          className="p-2 hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Изтрий"
                          onClick={() => {
                            if (confirm(`Сигурен ли си че искаш да изтриеш "${post.title}"?`)) {
                              // TODO: Implement delete
                              alert('Delete функционалността ще бъде добавена скоро');
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
