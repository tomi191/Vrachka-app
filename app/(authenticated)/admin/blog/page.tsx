import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { FileText, Sparkles } from 'lucide-react';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { BlogCreatorTab } from '@/components/admin/BlogCreatorTab';
import { BlogManagementTab } from '@/components/admin/BlogManagementTab';

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-zinc-50">Blog Management</h1>
        <p className="text-zinc-400">Създавай, управлявай и публикувай AI-powered blog съдържание</p>
      </div>

      {/* Tabs */}
      <AdminTabs
        defaultTab="posts"
        tabs={[
          {
            id: 'posts',
            label: 'Статии',
            icon: <FileText className="w-4 h-4" />,
            content: <BlogManagementTab blogPosts={blogPosts || []} />,
          },
          {
            id: 'creator',
            label: 'AI Blog Creator',
            icon: <Sparkles className="w-4 h-4" />,
            content: <BlogCreatorTab />,
          },
        ]}
      />
    </div>
  );
}
