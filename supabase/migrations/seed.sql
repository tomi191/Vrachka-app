-- =============================================
-- SEED DATA - ALL 78 TAROT CARDS
-- =============================================

-- Clear existing tarot cards first
DELETE FROM tarot_cards;

INSERT INTO tarot_cards (name, name_bg, card_type, image_url, upright_meaning) VALUES
-- =============================================
-- MAJOR ARCANA (22 cards)
-- =============================================
('The Fool', 'Лудият', 'major_arcana', '/Tarot/The Fool.webp', 'Ново начало, спонтанност, вяра в живота. Време е да направиш скока и да се довериш на вселената.'),
('The Magician', 'Магьосникът', 'major_arcana', '/Tarot/The Magician.webp', 'Сила на волята, проявяване, действие. Имаш всички инструменти, за да постигнеш целите си.'),
('The High Priestess', 'Върховната Жрица', 'major_arcana', '/Tarot/The High Priestess.webp', 'Интуиция, тайно знание, вътрешен глас. Слушай сърцето си и довери се на вътрешната мъдрост.'),
('The Empress', 'Императрицата', 'major_arcana', '/Tarot/The Empress.webp', 'Изобилие, плодородие, грижа. Време е за творчество и създаване на красота.'),
('The Emperor', 'Императорът', 'major_arcana', '/Tarot/The Emperor.webp', 'Структура, авторитет, контрол. Нужна ти е дисциплина и ясни граници.'),
('The Hierophant', 'Йерофантът', 'major_arcana', '/Tarot/The Hierophant.webp', 'Традиция, духовно учение, конформизъм. Потърси мъдрост в проверените пътища.'),
('The Lovers', 'Влюбените', 'major_arcana', '/Tarot/The Lovers.webp', 'Любов, хармония, избор. Важен избор предстои - слушай сърцето си.'),
('The Chariot', 'Колесницата', 'major_arcana', '/Tarot/The Chariot.webp', 'Воля, решителност, победа. Напред към целта с увереност и сила!'),
('Strength', 'Силата', 'major_arcana', '/Tarot/Strength.webp', 'Вътрешна сила, смелост, търпение. Истинската сила идва от състрадание и разбиране.'),
('The Hermit', 'Отшелникът', 'major_arcana', '/Tarot/The Hermit.webp', 'Вътрешно търсене, самота, мъдрост. Време е за рефлексия и себепознание.'),
('Wheel of Fortune', 'Колелото на Съдбата', 'major_arcana', '/Tarot/Wheel of Fortune.webp', 'Промяна, цикли, съдба. Животът се върти - приеми промените.'),
('Justice', 'Справедливостта', 'major_arcana', '/Tarot/Justice.webp', 'Баланс, истина, справедливост. Всяко действие има последствия.'),
('The Hanged Man', 'Обесеният', 'major_arcana', '/Tarot/The Hanged Man.webp', 'Нова перспектива, жертва, изчакване. Виж нещата от друг ъгъл.'),
('Death', 'Смъртта', 'major_arcana', '/Tarot/Death.webp', 'Трансформация, край на цикъл, прераждане. Старото умира, за да роди ново.'),
('Temperance', 'Въздържанието', 'major_arcana', '/Tarot/Temperance.webp', 'Баланс, модерация, хармония. Намери средата между крайностите.'),
('The Devil', 'Дяволът', 'major_arcana', '/Tarot/The Devil.webp', 'Изкушение, зависимост, материализъм. Внимавай да не се заробиш на илюзии.'),
('The Tower', 'Кулата', 'major_arcana', '/Tarot/The Tower.webp', 'Внезапна промяна, разрушение, прозрение. Понякога старото трябва да падне.'),
('The Star', 'Звездата', 'major_arcana', '/Tarot/The Star.webp', 'Надежда, вдъхновение, обновление. След бурята идва светлина.'),
('The Moon', 'Луната', 'major_arcana', '/Tarot/The Moon.webp', 'Илюзии, страхове, интуиция. Не всичко е такова, каквото изглежда.'),
('The Sun', 'Слънцето', 'major_arcana', '/Tarot/The Sun.webp', 'Радост, успех, позитивност. Животът свети ярко за теб!'),
('Judgement', 'Съдът', 'major_arcana', '/Tarot/Judgement.webp', 'Прераждане, оценка, призвание. Време е за важен избор и себеоценка.'),
('The World', 'Светът', 'major_arcana', '/Tarot/The World.webp', 'Завършване, цялостност, постижение. Постигна важна цел - празнувай!'),

-- =============================================
-- MINOR ARCANA - WANDS (14 cards)
-- =============================================
('Ace of Wands', 'Асо на Тояги', 'minor_arcana', '/Tarot/Ace of Wands.webp', 'Нов проект, вдъхновение, творческа енергия. Семе на нова възможност.'),
('Two of Wands', 'Двойка на Тояги', 'minor_arcana', '/Tarot/Two of Wands.webp', 'Планиране, визия за бъдещето, решения. Светът е пред теб.'),
('Three of Wands', 'Тройка на Тояги', 'minor_arcana', '/Tarot/Three of Wands.webp', 'Разширяване, предвиждане, търговия. Плановете ти се разгръщат.'),
('Four of Wands', 'Четворка на Тояги', 'minor_arcana', '/Tarot/Four of Wands.webp', 'Празнуване, хармония, дом. Време за радост и стабилност.'),
('Five of Wands', 'Петица на Тояги', 'minor_arcana', '/Tarot/Five of Wands.webp', 'Конфликт, конкуренция, напрежение. Много гледни точки се сблъскват.'),
('Six of Wands', 'Шестица на Тояги', 'minor_arcana', '/Tarot/Six of Wands.webp', 'Победа, признание, успех. Усилията ти се отплащат!'),
('Seven of Wands', 'Седмица на Тояги', 'minor_arcana', '/Tarot/Seven of Wands.webp', 'Защита, устояване, предизвикателство. Пази позицията си!'),
('Eight of Wands', 'Осмица на Тояги', 'minor_arcana', '/Tarot/Eight of Wands.webp', 'Бързо движение, прогрес, действие. Нещата ускоряват.'),
('Nine of Wands', 'Деветица на Тояги', 'minor_arcana', '/Tarot/Nine of Wands.webp', 'Устойчивост, издръжливост, последен натиск. Близо си до целта.'),
('Ten of Wands', 'Десетица на Тояги', 'minor_arcana', '/Tarot/Ten of Wands.webp', 'Бреме, отговорност, претоварване. Не носи всичко сам.'),
('Page of Wands', 'Паж на Тояги', 'minor_arcana', '/Tarot/Page of Wands.webp', 'Вестител, ентусиазъм, изследване. Нови вълнуващи новини идват.'),
('Knight of Wands', 'Рицар на Тояги', 'minor_arcana', '/Tarot/Knight of Wands.webp', 'Енергия, импулсивност, приключение. Действай смело!'),
('Queen of Wands', 'Кралица на Тояги', 'minor_arcana', '/Tarot/Queen of Wands.webp', 'Увереност, харизма, независимост. Бъди смела и страстна.'),
('King of Wands', 'Крал на Тояги', 'minor_arcana', '/Tarot/King of Wands.webp', 'Лидерство, визия, предприемачество. Води с увереност.'),

-- =============================================
-- MINOR ARCANA - CUPS (14 cards)
-- =============================================
('Ace of Cups', 'Асо на Чаши', 'minor_arcana', '/Tarot/Ace of Cups.webp', 'Нова любов, емоции, духовност. Сърцето ти е отворено.'),
('Two of Cups', 'Двойка на Чаши', 'minor_arcana', '/Tarot/Two of Cups.webp', 'Връзка, партньорство, единение. Хармония между двама души.'),
('Three of Cups', 'Тройка на Чаши', 'minor_arcana', '/Tarot/Three of Cups.webp', 'Празнуване, приятелство, общност. Споделена радост.'),
('Four of Cups', 'Четворка на Чаши', 'minor_arcana', '/Tarot/Four of Cups.webp', 'Апатия, съзерцание, преоценка. Виж новите възможности.'),
('Five of Cups', 'Петица на Чаши', 'minor_arcana', '/Tarot/Five of Cups.webp', 'Загуба, съжаление, разочарование. Фокусирай се на останалото.'),
('Six of Cups', 'Шестица на Чаши', 'minor_arcana', '/Tarot/Six of Cups.webp', 'Носталгия, спомени, детство. Връщане към миналото.'),
('Seven of Cups', 'Седмица на Чаши', 'minor_arcana', '/Tarot/Seven of Cups.webp', 'Избор, фантазия, илюзия. Много възможности - избери мъдро.'),
('Eight of Cups', 'Осмица на Чаши', 'minor_arcana', '/Tarot/Eight of Cups.webp', 'Отказ, търсене, движение напред. Време е да тръгнеш.'),
('Nine of Cups', 'Деветица на Чаши', 'minor_arcana', '/Tarot/Nine of Cups.webp', 'Желание, удовлетворение, щастие. Желанията ти се сбъдват!'),
('Ten of Cups', 'Десетица на Чаши', 'minor_arcana', '/Tarot/Ten of Cups.webp', 'Семейно щастие, хармония, любов. Емоционално изпълнение.'),
('Page of Cups', 'Паж на Чаши', 'minor_arcana', '/Tarot/Page of Cups.webp', 'Интуитивен вестител, чувствителност. Слушай сърцето си.'),
('Knight of Cups', 'Рицар на Чаши', 'minor_arcana', '/Tarot/Knight of Cups.webp', 'Романтика, чувства, предложение. Следвай мечтите си.'),
('Queen of Cups', 'Кралица на Чаши', 'minor_arcana', '/Tarot/Queen of Cups.webp', 'Съчувствие, интуиция, емоционална дълбочина. Изцели с любов.'),
('King of Cups', 'Крал на Чаши', 'minor_arcana', '/Tarot/King of Cups.webp', 'Емоционална зрялост, контрол, мъдрост. Баланс на чувствата.'),

-- =============================================
-- MINOR ARCANA - SWORDS (14 cards)
-- =============================================
('Ace of Swords', 'Асо на Мечове', 'minor_arcana', '/Tarot/Ace of Swords.webp', 'Нова идея, яснота, истина. Умът ти е остър и ясен.'),
('Two of Swords', 'Двойка на Мечове', 'minor_arcana', '/Tarot/Two of Swords.webp', 'Трудно решение, блокада, избягване. Трябва да избереш.'),
('Three of Swords', 'Тройка на Мечове', 'minor_arcana', '/Tarot/Three of Swords.webp', 'Сърдечна болка, скръб, болка. Време е да изцелиш раната.'),
('Four of Swords', 'Четворка на Мечове', 'minor_arcana', '/Tarot/Four of Swords.webp', 'Почивка, възстановяване, медитация. Вземи си време.'),
('Five of Swords', 'Петица на Мечове', 'minor_arcana', '/Tarot/Five of Swords.webp', 'Конфликт, загуба, поражение. Не всяка битка си заслужава.'),
('Six of Swords', 'Шестица на Мечове', 'minor_arcana', '/Tarot/Six of Swords.webp', 'Преход, движение, промяна. Преминаваш към по-спокойни води.'),
('Seven of Swords', 'Седмица на Мечове', 'minor_arcana', '/Tarot/Seven of Swords.webp', 'Хитрост, стратегия, тайна. Бъди внимателен с доверието.'),
('Eight of Swords', 'Осмица на Мечове', 'minor_arcana', '/Tarot/Eight of Swords.webp', 'Ограничение, страх, безпомощност. Веригите са в ума ти.'),
('Nine of Swords', 'Деветица на Мечове', 'minor_arcana', '/Tarot/Nine of Swords.webp', 'Безпокойство, кошмари, тревога. Страховете не са реални.'),
('Ten of Swords', 'Десетица на Мечове', 'minor_arcana', '/Tarot/Ten of Swords.webp', 'Край, предателство, дъно. След това идва ново начало.'),
('Page of Swords', 'Паж на Мечове', 'minor_arcana', '/Tarot/Page of Swords.webp', 'Любопитство, бдителност, новини. Оставай буден.'),
('Knight of Swords', 'Рицар на Мечове', 'minor_arcana', '/Tarot/Knight of Swords.webp', 'Амбиция, действие, импулсивност. Напред с пълна скорост!'),
('Queen of Swords', 'Кралица на Мечове', 'minor_arcana', '/Tarot/Queen of Swords.webp', 'Независимост, директност, яснота. Говори истината си.'),
('King of Swords', 'Крал на Мечове', 'minor_arcana', '/Tarot/King of Swords.webp', 'Интелект, логика, авторитет. Използвай ума си мъдро.'),

-- =============================================
-- MINOR ARCANA - PENTACLES (14 cards)
-- =============================================
('Ace of Pentacles', 'Асо на Пентакли', 'minor_arcana', '/Tarot/Ace of Pentacles.webp', 'Нова възможност, просперитет, начало. Семе на изобилие.'),
('Two of Pentacles', 'Двойка на Пентакли', 'minor_arcana', '/Tarot/Two of Pentacles.webp', 'Баланс, адаптивност, приоритети. Жонглирай с умения.'),
('Three of Pentacles', 'Тройка на Пентакли', 'minor_arcana', '/Tarot/Three of Pentacles.webp', 'Работа в екип, майсторство, сътрудничество. Споделена цел.'),
('Four of Pentacles', 'Четворка на Пентакли', 'minor_arcana', '/Tarot/Four of Pentacles.webp', 'Контрол, сигурност, пестене. Не се държи твърде здраво.'),
('Five of Pentacles', 'Петица на Пентакли', 'minor_arcana', '/Tarot/Five of Pentacles.webp', 'Финансови грижи, изолация, нужда. Помощта е наблизо.'),
('Six of Pentacles', 'Шестица на Пентакли', 'minor_arcana', '/Tarot/Six of Pentacles.webp', 'Щедрост, благотворителност, споделяне. Давай и получавай.'),
('Seven of Pentacles', 'Седмица на Пентакли', 'minor_arcana', '/Tarot/Seven of Pentacles.webp', 'Търпение, оценка, жътва. Резултатите идват.'),
('Eight of Pentacles', 'Осмица на Пентакли', 'minor_arcana', '/Tarot/Eight of Pentacles.webp', 'Усърдие, майсторство, умения. Практикувай занаята си.'),
('Nine of Pentacles', 'Деветица на Пентакли', 'minor_arcana', '/Tarot/Nine of Pentacles.webp', 'Изобилие, лукс, самодостатъчност. Насладись на успеха.'),
('Ten of Pentacles', 'Десетица на Пентакли', 'minor_arcana', '/Tarot/Ten of Pentacles.webp', 'Богатство, наследство, семейство. Дългосрочен успех.'),
('Page of Pentacles', 'Паж на Пентакли', 'minor_arcana', '/Tarot/Page of Pentacles.webp', 'Нови умения, амбиция, учене. Инвестирай в бъдещето.'),
('Knight of Pentacles', 'Рицар на Пентакли', 'minor_arcana', '/Tarot/Knight of Pentacles.webp', 'Отговорност, трудолюбие, рутина. Методичен напредък.'),
('Queen of Pentacles', 'Кралица на Пентакли', 'minor_arcana', '/Tarot/Queen of Pentacles.webp', 'Грижа, практичност, изобилие. Храни мечтите си.'),
('King of Pentacles', 'Крал на Пентакли', 'minor_arcana', '/Tarot/King of Pentacles.webp', 'Богатство, бизнес, лидерство. Материален успех.');

-- Update statistics
ANALYZE tarot_cards;
