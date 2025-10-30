import Link from "next/link";
import { Mail, MessageSquare, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { TopHeader } from "@/components/layout/top-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Footer } from "@/components/Footer";
import { GradientText } from "@/components/ui/gradient-text";
import { createClient } from "@/lib/supabase/server";
import { MysticBackground } from "@/components/background/MysticBackground";

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-dark relative">
      <MysticBackground />

      {/* Desktop: Navigation with Profile dropdown */}
      <div className="hidden lg:block">
        <Navigation user={user} />
      </div>

      {/* Mobile: TopHeader with hamburger (if logged in) or Navigation */}
      <div className="lg:hidden">
        {user ? <TopHeader /> : <Navigation />}
      </div>
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl font-bold">
            <GradientText from="#9333ea" via="#ec4899" to="#9333ea">
              Свържете се с нас
            </GradientText>
          </h1>
          <p className="text-zinc-400">
            Имате въпрос или нужда от помощ? Ние сме тук, за да ви помогнем!
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-xl bg-accent-500/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-accent-400" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-50 mb-2">Имейл</h3>
                <a
                  href="mailto:support@vrachka.com"
                  className="text-sm text-accent-400 hover:text-accent-300 underline"
                >
                  support@vrachka.com
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-xl bg-accent-500/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-accent-400" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-50 mb-2">Live Chat</h3>
                <p className="text-sm text-zinc-400">
                  Понеделник - Петък
                  <br />
                  9:00 - 18:00 ч.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-xl bg-accent-500/10 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-accent-400" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-50 mb-2">FAQ</h3>
                <Link
                  href="#faq"
                  className="text-sm text-accent-400 hover:text-accent-300 underline"
                >
                  Вижте често задавани въпроси
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50">Изпратете ни съобщение</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Име
              </label>
              <input
                type="text"
                placeholder="Вашето име"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Имейл
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Тема
              </label>
              <select className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-accent-500">
                <option>Общ въпрос</option>
                <option>Техническа поддръжка</option>
                <option>Абонамент и плащания</option>
                <option>Обратна връзка</option>
                <option>Друго</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Съобщение
              </label>
              <textarea
                rows={6}
                placeholder="Опишете вашия въпрос или проблем..."
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
              />
            </div>

            <Button className="w-full bg-accent-600 hover:bg-accent-700">
              Изпрати съобщение
            </Button>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="glass-card" id="faq">
          <CardHeader>
            <CardTitle className="text-zinc-50">Често задавани въпроси</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-zinc-50 mb-2">
                Как мога да отменя абонамента си?
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed">
                Можете да отмените абонамента си по всяко време от вашия профил → Абонамент →
                Manage Subscription. Ще запазите достъп до края на текущия период.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-zinc-50 mb-2">
                Получавам ли възстановяване на средства?
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed">
                Не предлагаме възстановяване на средства за частично използвани периоди. Можете
                обаче да отмените абонамента си, за да не бъдете таксувани за следващия период.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-zinc-50 mb-2">
                Как да променя личната си информация?
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed">
                Отидете на Профил → Редактирай профил, където можете да актуализирате вашето име,
                рождена дата и други настройки.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-zinc-50 mb-2">
                Защитени ли са моите данни?
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed">
                Да, използваме най-модерните технологии за криптиране и сигурност. Вашите данни
                са съхранени на защитени сървъри и никога не се споделят с трети страни без ваше съгласие.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-zinc-50 mb-2">
                Мога ли да използвам Vrachka на различни устройства?
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed">
                Да, вашият акаунт работи на всички устройства - компютър, таблет и телефон.
                Просто влезте със същия имейл и парола.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />

      {/* Bottom Navigation - mobile only for logged-in users */}
      {user && <BottomNav />}
    </div>
  );
}
