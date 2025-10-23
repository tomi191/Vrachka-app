import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GradientText } from "@/components/ui/gradient-text";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl font-bold">
            <GradientText from="#9333ea" via="#ec4899" to="#9333ea">
              Политика за поверителност
            </GradientText>
          </h1>
          <p className="text-zinc-400">Последна актуализация: {new Date().toLocaleDateString("bg-BG")}</p>
        </div>

        <Card className="glass-card">
          <CardContent className="pt-6 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">1. Обща информация</h2>
              <p className="text-zinc-300 leading-relaxed">
                Vrachka (&quot;ние&quot;, &quot;нас&quot;, &quot;нашия&quot;) се ангажира да защитава поверителността на вашата лична информация.
                Тази политика за поверителност обяснява как събираме, използваме и защитаваме вашите данни.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">2. Събирана информация</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                Ние събираме следната информация когато използвате нашата платформа:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Име и имейл адрес (при регистрация)</li>
                <li>Рождена дата и място (за астрологични изчисления)</li>
                <li>История на четения и взаимодействия с платформата</li>
                <li>Информация за абонамента и плащания</li>
                <li>Технически данни (IP адрес, тип браузър, устройство)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">3. Използване на информацията</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                Вашата информация се използва за:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Предоставяне на персонализирани астрологични прогнози</li>
                <li>Обработка на плащания и управление на абонаменти</li>
                <li>Подобряване на нашите услуги и потребителски опит</li>
                <li>Комуникация относно вашия акаунт и услугите ни</li>
                <li>Изпълнение на правни задължения</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">4. Защита на данните</h2>
              <p className="text-zinc-300 leading-relaxed">
                Ние използваме индустриални стандарти за сигурност за защита на вашите данни, включително
                криптиране, сигурно съхранение и ограничен достъп. Вашата информация се съхранява на
                сигурни сървъри с високо ниво на защита.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">5. Споделяне на информация</h2>
              <p className="text-zinc-300 leading-relaxed">
                Ние не продаваме, не наемаме и не споделяме вашата лична информация с трети страни,
                освен когато е необходимо за предоставяне на нашите услуги (напр. платежни процесори)
                или когато се изисква от закона.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">6. Вашите права</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                Вие имате право да:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Достъп до вашите лични данни</li>
                <li>Коригиране на неточни данни</li>
                <li>Изтриване на вашия акаунт и данни</li>
                <li>Ограничаване на обработката на данни</li>
                <li>Възражение срещу обработка на данни</li>
                <li>Пренасяне на данни</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">7. Бисквитки (Cookies)</h2>
              <p className="text-zinc-300 leading-relaxed">
                Използваме бисквитки и подобни технологии за подобряване на потребителския опит,
                анализ на трафика и персонализация на съдържанието. Можете да контролирате
                използването на бисквитки чрез настройките на вашия браузър.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">8. Промени в политиката</h2>
              <p className="text-zinc-300 leading-relaxed">
                Запазваме правото да актуализираме тази политика за поверителност по всяко време.
                Ще ви уведомим за значителни промени чрез имейл или известие в платформата.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">9. Контакт</h2>
              <p className="text-zinc-300 leading-relaxed">
                За въпроси относно тази политика за поверителност, моля свържете се с нас на:{" "}
                <a href="mailto:privacy@vrachka.com" className="text-accent-400 hover:text-accent-300 underline">
                  privacy@vrachka.com
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
