import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { BlogGeneratorForm } from './BlogGeneratorForm';

export default async function CreateBlogPostPage() {
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-50 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад към блога
        </Link>
        <h1 className="text-3xl font-bold text-zinc-50 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-accent-400" />
          AI Blog Generator
        </h1>
        <p className="text-zinc-400 mt-1">
          Генерирай висококачествено SEO-оптимизирано съдържание с AI
        </p>
      </div>

      {/* Generator Form */}
      <BlogGeneratorForm />
    </div>
  );
}
