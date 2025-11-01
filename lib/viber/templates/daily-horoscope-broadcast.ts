/**
 * Daily Horoscope Broadcast Template for Viber
 *
 * Creates a rich media carousel/grid with all 12 zodiac signs
 * for daily horoscope distribution to Viber channel.
 */

import type { ViberRichMedia, ViberButton, ViberPostRequest } from '../types';

// Zodiac sign data
interface ZodiacSign {
  sign: string;
  emoji: string;
  nameBg: string;
  color: string;
}

const ZODIAC_SIGNS: ZodiacSign[] = [
  { sign: 'oven', emoji: '♈', nameBg: 'Овен', color: '#E74C3C' },
  { sign: 'telec', emoji: '♉', nameBg: 'Телец', color: '#27AE60' },
  { sign: 'bliznaci', emoji: '♊', nameBg: 'Близнаци', color: '#F39C12' },
  { sign: 'rak', emoji: '♋', nameBg: 'Рак', color: '#95A5A6' },
  { sign: 'lav', emoji: '♌', nameBg: 'Лъв', color: '#E67E22' },
  { sign: 'deva', emoji: '♍', nameBg: 'Дева', color: '#16A085' },
  { sign: 'vezni', emoji: '♎', nameBg: 'Везни', color: '#2980B9' },
  { sign: 'skorpion', emoji: '♏', nameBg: 'Скорпион', color: '#8E44AD' },
  { sign: 'strelec', emoji: '♐', nameBg: 'Стрелец', color: '#C0392B' },
  { sign: 'kozirog', emoji: '♑', nameBg: 'Козирог', color: '#34495E' },
  { sign: 'vodolej', emoji: '♒', nameBg: 'Водолей', color: '#3498DB' },
  { sign: 'ribi', emoji: '♓', nameBg: 'Риби', color: '#9B59B6' },
];

/**
 * Format date in Bulgarian
 */
function formatDateBulgarian(date: Date): string {
  const months = [
    'януари',
    'февруари',
    'март',
    'април',
    'май',
    'юни',
    'юли',
    'август',
    'септември',
    'октомври',
    'ноември',
    'декември',
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Create daily horoscope broadcast message with grid of all 12 zodiac signs
 */
export function createDailyHoroscopeBroadcast(date: Date = new Date()): ViberPostRequest {
  const dateFormatted = formatDateBulgarian(date);

  return {
    type: 'rich_media',
    rich_media: createHoroscopeGrid(dateFormatted),
    alt_text: `🌟 Дневен хороскоп за ${dateFormatted}\n\nИзбери своята зодия и виж какво те очаква днес!\n\nhttps://vrachka.eu/horoscope`,
  };
}

/**
 * Create rich media grid with all zodiac signs
 * Layout: 3 columns x 5 rows
 * - Row 1: Header (full width)
 * - Rows 2-5: 12 zodiac buttons (3x4 grid)
 */
function createHoroscopeGrid(dateFormatted: string): ViberRichMedia {
  const buttons: ViberButton[] = [];

  // Row 1: Header with date (full width)
  buttons.push({
    Columns: 6,
    Rows: 1,
    ActionType: 'none',
    BgColor: '#9333ea',
    Text: `<font color="#FFFFFF"><b>🌟 Дневен Хороскоп</b></font>`,
    TextSize: 'large',
    TextVAlign: 'middle',
    TextHAlign: 'center',
  });

  buttons.push({
    Columns: 6,
    Rows: 1,
    ActionType: 'none',
    BgColor: '#7C3AED',
    Text: `<font color="#FFFFFF">📅 ${dateFormatted}</font>`,
    TextSize: 'regular',
    TextVAlign: 'middle',
    TextHAlign: 'center',
  });

  // Rows 2-5: 12 zodiac buttons in 3x4 grid
  // Each button is 2 columns wide, 1 row tall
  for (let i = 0; i < ZODIAC_SIGNS.length; i++) {
    const zodiac = ZODIAC_SIGNS[i];
    const horoscopeUrl = `https://vrachka.eu/horoscope/${zodiac.sign}`;

    buttons.push({
      Columns: 2, // Each button takes 2 out of 6 columns
      Rows: 1,
      ActionType: 'open-url',
      ActionBody: horoscopeUrl,
      BgColor: zodiac.color,
      Text: `<font color="#FFFFFF"><b>${zodiac.emoji} ${zodiac.nameBg}</b></font>`,
      TextSize: 'regular',
      TextVAlign: 'middle',
      TextHAlign: 'center',
    });
  }

  return {
    Type: 'rich_media',
    ButtonsGroupColumns: 6,
    ButtonsGroupRows: 6, // 1 header + 1 date + 4 rows of zodiac buttons
    BgColor: '#1a1a1a',
    Buttons: buttons,
  };
}

/**
 * Create fallback text message if rich media fails
 */
export function createSimpleHoroscopeText(date: Date = new Date()): ViberPostRequest {
  const dateFormatted = formatDateBulgarian(date);

  let text = `🌟 **Дневен Хороскоп**\n📅 ${dateFormatted}\n\n`;
  text += `Избери своята зодия:\n\n`;

  for (const zodiac of ZODIAC_SIGNS) {
    text += `${zodiac.emoji} ${zodiac.nameBg}: https://vrachka.eu/horoscope/${zodiac.sign}\n`;
  }

  return {
    type: 'text',
    text,
  };
}
