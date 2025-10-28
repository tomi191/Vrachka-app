import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GradientText } from "@/components/ui/gradient-text";
import Link from "next/link";

export const metadata = {
  title: "Политика за възстановяване на средства | Vrachka",
  description: "Разберете повече за нашата политика за възстановяване на средства и как можете да поискате refund за вашия абонамент.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl font-bold">
            <GradientText from="#9333ea" via="#ec4899" to="#9333ea">
              Политика за възстановяване на средства
            </GradientText>
          </h1>
          <p className="text-zinc-400">Последна актуализация: {new Date().toLocaleDateString("bg-BG")}</p>
          <div className="pt-2">
            <Link href="/refund-policy-en" className="text-accent-400 hover:text-accent-300 text-sm underline">
              Read in English →
            </Link>
          </div>
        </div>

        <Card className="glass-card">
          <CardContent className="pt-6 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">1. Обща информация</h2>
              <p className="text-zinc-300 leading-relaxed">
                В Vrachka се стремим да предоставим висококачествени духовни услуги, задвижвани от AI технология.
                Тази политика обяснява условията за възстановяване на средства при различни обстоятелства.
                Моля, прочетете внимателно преди да закупите абонамент.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">2. 14-дневен период за връщане (EU закон)</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                В съответствие с Директивата на ЕС за правата на потребителите, имате право да се откажете от
                покупката в рамките на 14 дни от датата на първоначалното плащане, БЕЗ да посочвате причина.
              </p>
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-accent-500/20">
                <p className="text-zinc-300 mb-2"><strong className="text-zinc-50">Важно:</strong> Правото на връщане не се прилага ако:</p>
                <ul className="list-disc list-inside space-y-1 text-zinc-300 ml-4 text-sm">
                  <li>Сте използвали услугите преди изтичането на 14-дневния период</li>
                  <li>Сте изрично се съгласили да започнете използването на цифровото съдържание</li>
                  <li>Сте потвърдили, че разбирате, че губите правото на връщане след използване</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">3. Политика за възстановяване след 14 дни</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                След 14-дневния период, нашата политика за възстановяване е следната:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li><strong className="text-zinc-50">Месечни абонаменти:</strong> Не предлагаме възстановяване на средства за частично използвани месеци. Можете да отмените по всяко време и достъпът ще продължи до края на платения период.</li>
                <li><strong className="text-zinc-50">Годишни абонаменти:</strong> Възстановяване на средства е възможно само в първите 30 дни, ако сте използвали по-малко от 10% от услугите.</li>
                <li><strong className="text-zinc-50">Технически проблеми:</strong> Ако не можете да използвате услугите поради наша техническа грешка за повече от 7 дни, ще получите пропорционално възстановяване.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">4. Как да поискате възстановяване</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                За да поискате възстановяване на средства:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-zinc-300 ml-4">
                <li>Изпратете имейл на <a href="mailto:refunds@vrachka.eu" className="text-accent-400 hover:text-accent-300 underline">refunds@vrachka.eu</a></li>
                <li>Посочете вашия имейл адрес, използван за регистрация</li>
                <li>Опишете причината за искането за възстановяване</li>
                <li>Предоставете номер на поръчка или дата на плащане (ако е възможно)</li>
              </ol>
              <p className="text-zinc-300 leading-relaxed mt-3">
                Ще разгледаме вашата молба в рамките на <strong className="text-zinc-50">5 работни дни</strong> и ще ви уведомим за решението по имейл.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">5. Процес на възстановяване</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                Ако искането ви за възстановяване бъде одобрено:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Средствата ще бъдат възстановени чрез <strong className="text-zinc-50">същия платежен метод</strong>, използван при покупката</li>
                <li>Обработката може да отнеме <strong className="text-zinc-50">5-10 работни дни</strong> в зависимост от вашата банка</li>
                <li>Ще получите имейл потвърждение, когато възстановяването бъде обработено</li>
                <li>Достъпът до премиум функции ще бъде незабавно прекратен</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">6. Изключения (Няма възстановяване)</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                Няма да предоставим възстановяване на средства в следните случаи:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Промяна на мнение след активно използване на услугите</li>
                <li>Нарушение на нашите <Link href="/terms" className="text-accent-400 hover:text-accent-300 underline">Общи условия</Link></li>
                <li>Прекратяване на акаунт поради неподходящо поведение</li>
                <li>Частично използван месечен или годишен период (освен при технически проблеми)</li>
                <li>Промокоди или специални оферти (освен ако не е посочено друго)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">7. Stripe Payment Processing</h2>
              <p className="text-zinc-300 leading-relaxed">
                Всички плащания се обработват чрез <strong className="text-zinc-50">Stripe</strong>, сигурен и регулиран платежен процесор.
                При възстановяване на средства, Stripe може да удържа междинни такси за обработка. В случай на спорни транзакции
                (chargebacks), моля свържете се с нас преди да инициирате спор с банката си, за да разрешим проблема по-бързо.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">8. Отмяна на абонамент</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                Можете да отмените абонамента си по всяко време чрез:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Настройки на профила → Абонамент → &quot;Отмени абонамент&quot;</li>
                <li>Или чрез Stripe Customer Portal (линк в имейла за потвърждение)</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed mt-3">
                <strong className="text-zinc-50">Важно:</strong> Отмяната спира БЪДЕЩИ плащания, но НЕ възстановява текущия период.
                Ще запазите достъп до премиум функции до края на платения период.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">9. Disclaimer за духовни услуги</h2>
              <p className="text-zinc-300 leading-relaxed">
                Vrachka предоставя астрологични и духовни услуги за <strong className="text-zinc-50">развлекателни и самопознавателни цели</strong>.
                Нашите услуги НЕ заместват професионален медицински, правен, финансов или психологичен съвет. Всички решения, базирани
                на нашите прогнози, са на ваша лична отговорност. Не носим отговорност за резултати или последици от използването на услугите.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">10. Промени в политиката</h2>
              <p className="text-zinc-300 leading-relaxed">
                Запазваме правото да актуализираме тази политика за възстановяване по всяко време. Промените влизат в сила
                незабавно при публикуване на уебсайта. Продължаващото използване на услугите след промените означава
                приемане на актуализираната политика.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">11. Контакт</h2>
              <p className="text-zinc-300 leading-relaxed">
                За въпроси относно тази политика за възстановяване на средства или за да поискате refund, моля свържете се с нас на:{" "}
                <a href="mailto:refunds@vrachka.eu" className="text-accent-400 hover:text-accent-300 underline">
                  refunds@vrachka.eu
                </a>
              </p>
              <p className="text-zinc-300 leading-relaxed mt-2">
                Общ имейл за поддръжка:{" "}
                <a href="mailto:support@vrachka.eu" className="text-accent-400 hover:text-accent-300 underline">
                  support@vrachka.eu
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
