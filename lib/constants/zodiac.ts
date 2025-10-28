/**
 * Zodiac Signs Constants
 * Contains all 12 zodiac signs with their properties
 */

export interface ZodiacSign {
  sign: string
  name: string
  dates: string
}

export interface DetailedZodiacSign extends ZodiacSign {
  element: string
  planet: string
  traits: string
}

// Basic zodiac signs for homepage
export const ZODIAC_SIGNS: readonly ZodiacSign[] = [
  { sign: 'oven', name: 'Овен', dates: '21 март - 19 април' },
  { sign: 'telec', name: 'Телец', dates: '20 април - 20 май' },
  { sign: 'bliznaci', name: 'Близнаци', dates: '21 май - 20 юни' },
  { sign: 'rak', name: 'Рак', dates: '21 юни - 22 юли' },
  { sign: 'lav', name: 'Лъв', dates: '23 юли - 22 август' },
  { sign: 'deva', name: 'Дева', dates: '23 август - 22 септември' },
  { sign: 'vezni', name: 'Везни', dates: '23 септември - 22 октомври' },
  { sign: 'skorpion', name: 'Скорпион', dates: '23 октомври - 21 ноември' },
  { sign: 'strelec', name: 'Стрелец', dates: '22 ноември - 21 декември' },
  { sign: 'kozirog', name: 'Козирог', dates: '22 декември - 19 януари' },
  { sign: 'vodolej', name: 'Водолей', dates: '20 януари - 18 февруари' },
  { sign: 'ribi', name: 'Риби', dates: '19 февруари - 20 март' },
] as const

// Detailed zodiac signs with additional properties for horoscope page
export const DETAILED_ZODIAC_SIGNS: readonly DetailedZodiacSign[] = [
  {
    sign: 'oven',
    name: 'Овен',
    dates: '21 март - 19 април',
    element: 'Огън',
    planet: 'Марс',
    traits: 'Смел, енергичен, лидер',
  },
  {
    sign: 'telec',
    name: 'Телец',
    dates: '20 април - 20 май',
    element: 'Земя',
    planet: 'Венера',
    traits: 'Стабилен, практичен, упорит',
  },
  {
    sign: 'bliznaci',
    name: 'Близнаци',
    dates: '21 май - 20 юни',
    element: 'Въздух',
    planet: 'Меркурий',
    traits: 'Общителен, любознателен, гъвкав',
  },
  {
    sign: 'rak',
    name: 'Рак',
    dates: '21 юни - 22 юли',
    element: 'Вода',
    planet: 'Луна',
    traits: 'Чувствителен, грижовен, интуитивен',
  },
  {
    sign: 'lav',
    name: 'Лъв',
    dates: '23 юли - 22 август',
    element: 'Огън',
    planet: 'Слънце',
    traits: 'Харизматичен, щедър, креативен',
  },
  {
    sign: 'deva',
    name: 'Дева',
    dates: '23 август - 22 септември',
    element: 'Земя',
    planet: 'Меркурий',
    traits: 'Аналитичен, перфекционист, услужлив',
  },
  {
    sign: 'vezni',
    name: 'Везни',
    dates: '23 септември - 22 октомври',
    element: 'Въздух',
    planet: 'Венера',
    traits: 'Балансиран, дипломатичен, артистичен',
  },
  {
    sign: 'skorpion',
    name: 'Скорпион',
    dates: '23 октомври - 21 ноември',
    element: 'Вода',
    planet: 'Плутон',
    traits: 'Интензивен, страстен, проницателен',
  },
  {
    sign: 'strelec',
    name: 'Стрелец',
    dates: '22 ноември - 21 декември',
    element: 'Огън',
    planet: 'Юпитер',
    traits: 'Оптимист, авантюрист, философ',
  },
  {
    sign: 'kozirog',
    name: 'Козирог',
    dates: '22 декември - 19 януари',
    element: 'Земя',
    planet: 'Сатурн',
    traits: 'Амбициозен, дисциплиниран, отговорен',
  },
  {
    sign: 'vodolej',
    name: 'Водолей',
    dates: '20 януари - 18 февруари',
    element: 'Въздух',
    planet: 'Уран',
    traits: 'Иноватор, независим, хуманитарен',
  },
  {
    sign: 'ribi',
    name: 'Риби',
    dates: '19 февруари - 20 март',
    element: 'Вода',
    planet: 'Нептун',
    traits: 'Състрадателен, артистичен, духовен',
  },
] as const
