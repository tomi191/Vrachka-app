import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GradientText } from "@/components/ui/gradient-text";
import Link from "next/link";

export const metadata = {
  title: "Политика за бисквитки | Vrachka",
  description: "Разберете как Vrachka използва бисквитки (cookies) за подобряване на потребителския опит и какви права имате.",
};

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl font-bold">
            <GradientText from="#9333ea" via="#ec4899" to="#9333ea">
              Политика за бисквитки
            </GradientText>
          </h1>
          <p className="text-zinc-400">Последна актуализация: {new Date().toLocaleDateString("bg-BG")}</p>
          <div className="pt-2">
            <Link href="/cookies-policy-en" className="text-accent-400 hover:text-accent-300 text-sm underline">
              Read in English →
            </Link>
          </div>
        </div>

        <Card className="glass-card">
          <CardContent className="pt-6 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">1. Какво са бисквитките (Cookies)?</h2>
              <p className="text-zinc-300 leading-relaxed">
                Бисквитките са малки текстови файлове, които се съхраняват на вашето устройство (компютър, телефон, таблет),
                когато посещавате уебсайт. Те позволяват на сайта да запомня ваши действия и предпочитания (като вход в акаунт,
                език, размер на шрифт и други настройки) за определен период от време.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">2. Как използваме бисквитките</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                Vrachka използва бисквитки за следните цели:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li><strong className="text-zinc-50">Автентикация:</strong> За да запомним, че сте влезли в акаунта си</li>
                <li><strong className="text-zinc-50">Предпочитания:</strong> За да запазим вашите настройки (тема, език)</li>
                <li><strong className="text-zinc-50">Сигурност:</strong> За защита срещу фалшиви заявки и злонамерени атаки</li>
                <li><strong className="text-zinc-50">Анализ:</strong> За разбиране как използвате нашата платформа</li>
                <li><strong className="text-zinc-50">Функционалност:</strong> За подобряване на потребителския опит</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">3. Типове бисквитки, които използваме</h2>

              <div className="space-y-4">
                <div className="bg-zinc-900/50 p-4 rounded-lg border border-accent-500/20">
                  <h3 className="text-lg font-semibold text-zinc-50 mb-2">А) Строго необходими бисквитки</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-2">
                    Тези бисквитки са задължителни за работата на уебсайта и не могат да бъдат деактивирани в нашите системи.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300 ml-4 text-sm">
                    <li><strong>auth-token:</strong> Удостоверява вашата сесия (Supabase Authentication)</li>
                    <li><strong>csrf-token:</strong> Защита срещу Cross-Site Request Forgery атаки</li>
                    <li><strong>session-id:</strong> Управление на сесията на потребителя</li>
                  </ul>
                  <p className="text-zinc-400 text-xs mt-2">Срок на валидност: Сесия или до 30 дни</p>
                </div>

                <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/20">
                  <h3 className="text-lg font-semibold text-zinc-50 mb-2">Б) Функционални бисквитки</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-2">
                    Позволяват на уебсайта да предоставя подобрена функционалност и персонализация.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300 ml-4 text-sm">
                    <li><strong>user-preferences:</strong> Съхраняване на вашите предпочитания (тема, език)</li>
                    <li><strong>zodiac-sign:</strong> Запазване на вашия зодиакален знак за бърз достъп</li>
                    <li><strong>onboarding-completed:</strong> Проследяване дали сте завършили онбординга</li>
                  </ul>
                  <p className="text-zinc-400 text-xs mt-2">Срок на валидност: До 1 година | Можете да откажете</p>
                </div>

                <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/20">
                  <h3 className="text-lg font-semibold text-zinc-50 mb-2">В) Аналитични бисквитки</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-2">
                    Помагат ни да разберем как посетителите взаимодействат с платформата.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300 ml-4 text-sm">
                    <li><strong>Vercel Analytics:</strong> Анонимна статистика за посещенията и ефективността</li>
                    <li><strong>_ga, _gid:</strong> Google Analytics (ако се използва) - съгласие се изисква</li>
                  </ul>
                  <p className="text-zinc-400 text-xs mt-2">Срок на валидност: 13 месеца (GA) или 24 часа (Vercel) | Можете да откажете</p>
                </div>

                <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/20">
                  <h3 className="text-lg font-semibold text-zinc-50 mb-2">Г) Маркетингови бисквитки</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-2">
                    В момента НЕ използваме маркетингови или рекламни бисквитки. Ако това се промени в бъдеще, ще поискаме вашето изрично съгласие.
                  </p>
                  <p className="text-zinc-400 text-xs mt-2">Статус: Неактивно</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">4. Бисквитки на трети страни</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                Някои бисквитки могат да бъдат зададени от трети страни, които предоставят услуги за нас:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li><strong className="text-zinc-50">Stripe:</strong> Обработка на плащания (session и security cookies)</li>
                <li><strong className="text-zinc-50">Supabase:</strong> Автентикация и база данни (auth cookies)</li>
                <li><strong className="text-zinc-50">Vercel:</strong> Hosting и analytics (performance cookies)</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed mt-3">
                Тези трети страни имат свои собствени политики за поверителност и бисквитки, които можете да прегледате на техните уебсайтове.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">5. Управление на бисквитките</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                Имате няколко начина да управлявате или изтриете бисквитките:
              </p>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-50 mb-1">А) Чрез вашия браузър</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-2">
                    Можете да настроите браузъра си да блокира или изтрива бисквитки:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300 ml-4 text-sm">
                    <li><strong>Chrome:</strong> Настройки → Поверителност и сигурност → Бисквитки</li>
                    <li><strong>Firefox:</strong> Настройки → Поверителност и сигурност → Бисквитки и данни</li>
                    <li><strong>Safari:</strong> Предпочитания → Поверителност → Управление на бисквитки</li>
                    <li><strong>Edge:</strong> Настройки → Бисквитки и разрешения за сайтове</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-zinc-50 mb-1">Б) Чрез настройките на Vrachka</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    Можете да управлявате аналитичните и функционалните бисквитки чрез вашия профил:
                    Настройки → Поверителност → Управление на бисквитки
                  </p>
                </div>
              </div>

              <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-500/30 mt-4">
                <p className="text-amber-200 text-sm">
                  <strong>⚠️ Важно:</strong> Ако блокирате или изтриете бисквитките, някои функции на Vrachka може да не работят правилно
                  (напр. няма да можете да влезете в акаунта си или да запазите предпочитанията си).
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">6. "Do Not Track" (DNT) сигнали</h2>
              <p className="text-zinc-300 leading-relaxed">
                В момента нашият уебсайт не отговаря на "Do Not Track" (DNT) сигнали от браузъри, тъй като няма индустриален
                стандарт за това как да се интерпретират тези сигнали. Ако в бъдеще се установи стандарт, ще актуализираме политиката си.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">7. Вашите права (GDPR)</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                Съгласно GDPR, вие имате право да:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Откажете съгласието си за използване на неосновни бисквитки по всяко време</li>
                <li>Изтриете бисквитките на вашето устройство</li>
                <li>Поискате информация какви данни събираме чрез бисквитки</li>
                <li>Поискате изтриване на вашите данни (право "да бъдеш забравен")</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed mt-3">
                За повече информация, вижте нашата{" "}
                <Link href="/privacy" className="text-accent-400 hover:text-accent-300 underline">
                  Политика за поверителност
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">8. Промени в тази политика</h2>
              <p className="text-zinc-300 leading-relaxed">
                Можем да актуализираме тази политика за бисквитки периодично, за да отразим промени в технологиите,
                законодателството или нашите практики. Ще публикуваме актуализираната версия на тази страница с нова
                дата "Последна актуализация". Препоръчваме периодично да преглеждате тази политика.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">9. Контакт</h2>
              <p className="text-zinc-300 leading-relaxed">
                За въпроси относно тази политика за бисквитки или за да упражните вашите права, моля свържете се с нас на:{" "}
                <a href="mailto:privacy@vrachka.eu" className="text-accent-400 hover:text-accent-300 underline">
                  privacy@vrachka.eu
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
