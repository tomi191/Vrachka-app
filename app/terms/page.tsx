import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GradientText } from "@/components/ui/gradient-text";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl font-bold">
            <GradientText from="#9333ea" via="#ec4899" to="#9333ea">
              Общи условия
            </GradientText>
          </h1>
          <p className="text-zinc-400">Последна актуализация: {new Date().toLocaleDateString("bg-BG")}</p>
          <div className="pt-2">
            <Link href="/terms-en" className="text-accent-400 hover:text-accent-300 text-sm underline">
              Read in English →
            </Link>
          </div>
        </div>

        <Card className="glass-card">
          <CardContent className="pt-6 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">1. Приемане на условията</h2>
              <p className="text-zinc-300 leading-relaxed">
                Чрез достъп и използване на Vrachka платформата, вие се съгласявате да спазвате тези
                общи условия. Ако не сте съгласни с някоя част от условията, моля не използвайте нашите услуги.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">2. Описание на услугата</h2>
              <p className="text-zinc-300 leading-relaxed">
                Vrachka предоставя онлайн астрологични услуги, включително дневни хороскопи, таро четения,
                AI оракул и други духовни инструменти. Услугите са достъпни чрез уеб платформа и mobile приложение.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">3. Регистрация на акаунт</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                За използване на пълния функционалитет на платформата, трябва да създадете акаунт.
                Вие сте отговорни за:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Предоставяне на точна и пълна информация при регистрация</li>
                <li>Поддържане на сигурността на вашата парола</li>
                <li>Всички дейности, извършени чрез вашия акаунт</li>
                <li>Незабавно уведомяване за неоторизиран достъп</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">4. Абонаменти и плащания</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                Vrachka предлага безплатен и платени абонаменти:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Абонаментите се таксуват месечно или годишно</li>
                <li>Плащанията се обработват автоматично през Stripe (PCI-DSS compliant)</li>
                <li>Можете да отмените абонамента си по всяко време</li>
                <li>Няма възстановяване на средства за частично използвани периоди (вижте нашата{" "}
                  <Link href="/refund-policy" className="text-accent-400 hover:text-accent-300 underline">
                    Политика за възстановяване
                  </Link>)
                </li>
                <li>Цените могат да се променят с 30-дневно предизвестие</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">5. Приемливо използване</h2>
              <p className="text-zinc-300 leading-relaxed mb-3">
                При използване на Vrachka, вие се задължавате да НЕ:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
                <li>Нарушавате закони или права на други</li>
                <li>Споделяте вашия акаунт с други хора</li>
                <li>Злоупотребявате или претоварвате системата</li>
                <li>Извличате данни чрез automated методи</li>
                <li>Копирате или препродавате нашето съдържание</li>
                <li>Създавате фалшиви акаунти или профили</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">6. Интелектуална собственост</h2>
              <p className="text-zinc-300 leading-relaxed">
                Цялото съдържание на Vrachka платформата, включително текст, графики, логота, иконки,
                и софтуер, е собственост на Vrachka или неговите лицензодатели и е защитено от закони
                за авторски права и други закони за интелектуална собственост.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">7. Отказ от отговорност</h2>
              <p className="text-zinc-300 leading-relaxed">
                Vrachka предоставя астрологични и духовни услуги за развлекателни и информационни цели.
                Нашите услуги НЕ заместват професионален медицински, правен, финансов или психологичен съвет.
                Всички решения, базирани на нашите прогнози, са на ваша лична отговорност.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">8. Ограничение на отговорността</h2>
              <p className="text-zinc-300 leading-relaxed">
                Vrachka не носи отговорност за директни, индиректни, случайни или последващи щети,
                произтичащи от използването или невъзможността да се използва нашата услуга, дори ако
                сме били уведомени за възможността от такива щети.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">9. Прекратяване</h2>
              <p className="text-zinc-300 leading-relaxed">
                Запазваме правото да прекратим или спрем вашия достъп до услугите по всяко време,
                без предизвестие, за поведение, което нарушава тези условия или е вредно за други
                потребители, нас или трети страни.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">10. Промени в условията</h2>
              <p className="text-zinc-300 leading-relaxed">
                Можем да актуализираме тези условия периодично. Ще ви уведомим за значителни промени
                чрез имейл или известие в платформата. Продължаващото използване след промените означава
                приемане на новите условия.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">11. Приложимо право</h2>
              <p className="text-zinc-300 leading-relaxed">
                Тези условия се регулират и тълкуват в съответствие със законите на Република България.
                Всякакви спорове ще бъдат разрешавани в компетентните съдилища в България.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-50 mb-3">12. Контакт</h2>
              <p className="text-zinc-300 leading-relaxed">
                За въпроси относно тези условия, моля свържете се с нас на:{" "}
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
