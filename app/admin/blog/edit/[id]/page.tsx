import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { BlogEditForm } from '@/components/admin/BlogEditForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogEditPage({ params }: PageProps) {
  const { id } = await params;
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

  // Get blog post
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-brand-950 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <BlogEditForm post={post} />
      </div>
    </div>
  );
}
