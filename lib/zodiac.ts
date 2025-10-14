export type ZodiacSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export const zodiacSigns: Record<ZodiacSign, { name: string; emoji: string; dates: string }> = {
  aries: { name: 'Овен', emoji: '♈', dates: '21 март - 19 април' },
  taurus: { name: 'Телец', emoji: '♉', dates: '20 април - 20 май' },
  gemini: { name: 'Близнаци', emoji: '♊', dates: '21 май - 20 юни' },
  cancer: { name: 'Рак', emoji: '♋', dates: '21 юни - 22 юли' },
  leo: { name: 'Лъв', emoji: '♌', dates: '23 юли - 22 август' },
  virgo: { name: 'Дева', emoji: '♍', dates: '23 август - 22 септември' },
  libra: { name: 'Везни', emoji: '♎', dates: '23 септември - 22 октомври' },
  scorpio: { name: 'Скорпион', emoji: '♏', dates: '23 октомври - 21 ноември' },
  sagittarius: { name: 'Стрелец', emoji: '♐', dates: '22 ноември - 21 декември' },
  capricorn: { name: 'Козирог', emoji: '♑', dates: '22 декември - 19 януари' },
  aquarius: { name: 'Водолей', emoji: '♒', dates: '20 януари - 18 февруари' },
  pisces: { name: 'Риби', emoji: '♓', dates: '19 февруари - 20 март' },
};

export function getZodiacSign(birthDate: Date | string): ZodiacSign {
  const date = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces';
}
