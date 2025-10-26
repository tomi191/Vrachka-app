import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PersonalHoroscopeView } from './PersonalHoroscopeView';

export default async function PersonalHoroscopeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Get personal horoscope
  const { data: horoscope, error } = await supabase
    .from('personal_horoscopes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !horoscope) {
    redirect('/personal-horoscope');
  }

  return <PersonalHoroscopeView horoscope={horoscope} />;
}
