import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Major Arcana tarot cards data
const TAROT_CARDS = [
  { name: 'The Fool', name_bg: 'Лудият', card_type: 'major_arcana', image_url: '/tarot/00-fool.jpg', upright_meaning: 'Ново начало, спонтанност, вяра в живота. Време е да направиш скока и да се довериш на вселената.' },
  { name: 'The Magician', name_bg: 'Магьосникът', card_type: 'major_arcana', image_url: '/tarot/01-magician.jpg', upright_meaning: 'Сила на волята, проявяване, действие. Имаш всички инструменти, за да постигнеш целите си.' },
  { name: 'The High Priestess', name_bg: 'Върховната Жрица', card_type: 'major_arcana', image_url: '/tarot/02-high-priestess.jpg', upright_meaning: 'Интуиция, тайно знание, вътрешен глас. Слушай сърцето си и довери се на вътрешната мъдрост.' },
  { name: 'The Empress', name_bg: 'Императрицата', card_type: 'major_arcana', image_url: '/tarot/03-empress.jpg', upright_meaning: 'Изобилие, плодородие, грижа. Време е за творчество и създаване на красота.' },
  { name: 'The Emperor', name_bg: 'Императорът', card_type: 'major_arcana', image_url: '/tarot/04-emperor.jpg', upright_meaning: 'Структура, авторитет, контрол. Нужна ти е дисциплина и ясни граници.' },
  { name: 'The Hierophant', name_bg: 'Йерофантът', card_type: 'major_arcana', image_url: '/tarot/05-hierophant.jpg', upright_meaning: 'Традиция, духовно учение, конформизъм. Потърси мъдрост в проверените пътища.' },
  { name: 'The Lovers', name_bg: 'Влюбените', card_type: 'major_arcana', image_url: '/tarot/06-lovers.jpg', upright_meaning: 'Любов, хармония, избор. Важен избор предстои - слушай сърцето си.' },
  { name: 'The Chariot', name_bg: 'Колесницата', card_type: 'major_arcana', image_url: '/tarot/07-chariot.jpg', upright_meaning: 'Воля, решителност, победа. Напред към целта с увереност и сила!' },
  { name: 'Strength', name_bg: 'Силата', card_type: 'major_arcana', image_url: '/tarot/08-strength.jpg', upright_meaning: 'Вътрешна сила, смелост, търпение. Истинската сила идва от състрадание и разбиране.' },
  { name: 'The Hermit', name_bg: 'Отшелникът', card_type: 'major_arcana', image_url: '/tarot/09-hermit.jpg', upright_meaning: 'Вътрешно търсене, самота, мъдрост. Време е за рефлексия и себепознание.' },
  { name: 'Wheel of Fortune', name_bg: 'Колелото на Съдбата', card_type: 'major_arcana', image_url: '/tarot/10-wheel.jpg', upright_meaning: 'Промяна, цикли, съдба. Животът се върти - приеми промените.' },
  { name: 'Justice', name_bg: 'Справедливостта', card_type: 'major_arcana', image_url: '/tarot/11-justice.jpg', upright_meaning: 'Баланс, истина, справедливост. Всяко действие има последствия.' },
  { name: 'The Hanged Man', name_bg: 'Обесеният', card_type: 'major_arcana', image_url: '/tarot/12-hanged-man.jpg', upright_meaning: 'Нова перспектива, жертва, изчакване. Виж нещата от друг ъгъл.' },
  { name: 'Death', name_bg: 'Смъртта', card_type: 'major_arcana', image_url: '/tarot/13-death.jpg', upright_meaning: 'Трансформация, край на цикъл, прераждане. Старото умира, за да роди ново.' },
  { name: 'Temperance', name_bg: 'Въздържанието', card_type: 'major_arcana', image_url: '/tarot/14-temperance.jpg', upright_meaning: 'Баланс, модерация, хармония. Намери средата между крайностите.' },
  { name: 'The Devil', name_bg: 'Дяволът', card_type: 'major_arcana', image_url: '/tarot/15-devil.jpg', upright_meaning: 'Изкушение, зависимост, материализъм. Внимавай да не се заробиш на илюзии.' },
  { name: 'The Tower', name_bg: 'Кулата', card_type: 'major_arcana', image_url: '/tarot/16-tower.jpg', upright_meaning: 'Внезапна промяна, разрушение, прозрение. Понякога старото трябва да падне.' },
  { name: 'The Star', name_bg: 'Звездата', card_type: 'major_arcana', image_url: '/tarot/17-star.jpg', upright_meaning: 'Надежда, вдъхновение, обновление. След бурята идва светлина.' },
  { name: 'The Moon', name_bg: 'Луната', card_type: 'major_arcana', image_url: '/tarot/18-moon.jpg', upright_meaning: 'Илюзии, страхове, интуиция. Не всичко е такова, каквото изглежда.' },
  { name: 'The Sun', name_bg: 'Слънцето', card_type: 'major_arcana', image_url: '/tarot/19-sun.jpg', upright_meaning: 'Радост, успех, позитивност. Животът свети ярко за теб!' },
  { name: 'Judgement', name_bg: 'Съдът', card_type: 'major_arcana', image_url: '/tarot/20-judgement.jpg', upright_meaning: 'Прераждане, оценка, призвание. Време е за важен избор и себеоценка.' },
  { name: 'The World', name_bg: 'Светът', card_type: 'major_arcana', image_url: '/tarot/21-world.jpg', upright_meaning: 'Завършване, цялостност, постижение. Постигна важна цел - празнувай!' },
];

export async function POST() {
  try {
    const supabase = await createClient();

    // Check if cards already exist
    const { data: existingCards, error: checkError } = await supabase
      .from('tarot_cards')
      .select('id')
      .limit(1);

    if (checkError) {
      throw checkError;
    }

    if (existingCards && existingCards.length > 0) {
      return NextResponse.json({
        message: 'Tarot cards already seeded',
        count: existingCards.length,
      });
    }

    // Insert tarot cards
    const { data, error } = await supabase
      .from('tarot_cards')
      .insert(TAROT_CARDS)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Tarot cards seeded successfully',
      count: data?.length || 0,
    });
  } catch (error) {
    console.error("Seed tarot cards error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to seed tarot cards" },
      { status: 500 }
    );
  }
}

// GET endpoint to check status
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('tarot_cards')
      .select('id, name, name_bg');

    if (error) {
      throw error;
    }

    return NextResponse.json({
      seeded: (data?.length || 0) > 0,
      count: data?.length || 0,
      cards: data || [],
    });
  } catch (error) {
    console.error("Check tarot cards error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to check tarot cards" },
      { status: 500 }
    );
  }
}
