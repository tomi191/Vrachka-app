/**
 * Numerology - Life Path Number Calculation
 *
 * Life Path Number is calculated by summing all digits from birth date
 * and reducing to a single digit (1-9), while preserving master numbers (11, 22, 33).
 */

import { LIFE_PATH_DATA } from './numerology-data';

export interface LifePathData {
  number: number;
  emoji: string;
  color: string;
  title: string;
  description: string;
  strengths: string[];
  challenges: string[];
  compatibility: Array<{ number: number; score: number; description: string }>;
  career: string;
  keywords: string[];
}

/**
 * Calculate Life Path Number from birth date
 *
 * Algorithm:
 * 1. Sum all digits from day, month, and year separately
 * 2. Check if any intermediate sum is a master number (11, 22, 33)
 * 3. If not a master number, reduce each component to single digit
 * 4. Sum all components and reduce to final single digit
 * 5. Keep master numbers (11, 22, 33) without reduction
 *
 * Example: 15/03/1990
 * Day: 1+5 = 6
 * Month: 0+3 = 3
 * Year: 1+9+9+0 = 19 → 1+9 = 10 → 1+0 = 1
 * Total: 6+3+1 = 10 → 1+0 = 1
 * Life Path Number: 1
 *
 * Example with master number: 29/11/1983
 * Day: 2+9 = 11 (master number - keep it)
 * Month: 1+1 = 2
 * Year: 1+9+8+3 = 21 → 2+1 = 3
 * Total: 11+2+3 = 16 → 1+6 = 7
 * Life Path Number: 7 (note: 11 was preserved in calculation but final result reduced)
 *
 * Example with master result: 11/02/1983
 * Day: 1+1 = 2
 * Month: 0+2 = 2
 * Year: 1+9+8+3 = 21 → 2+1 = 3
 * Total: 2+2+3 = 7
 * OR using full date: 1+1+0+2+1+9+8+3 = 25 → 2+5 = 7
 * But if we get 11, 22, or 33 in the final sum, we keep it.
 */
export function calculateLifePathNumber(birthDate: Date): number {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1; // getMonth() is 0-indexed
  const year = birthDate.getFullYear();

  // Helper function to sum digits of a number
  const sumDigits = (num: number): number => {
    return num
      .toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  };

  // Helper function to reduce to single digit, preserving master numbers
  const reduceToSingleDigit = (num: number): number => {
    while (num > 9) {
      // Check for master numbers before reduction
      if (num === 11 || num === 22 || num === 33) {
        return num;
      }
      num = sumDigits(num);
    }
    return num;
  };

  // Reduce each component
  const dayReduced = reduceToSingleDigit(day);
  const monthReduced = reduceToSingleDigit(month);
  const yearReduced = reduceToSingleDigit(year);

  // Sum all reduced components
  let lifePathNumber = dayReduced + monthReduced + yearReduced;

  // Reduce the final sum, preserving master numbers
  lifePathNumber = reduceToSingleDigit(lifePathNumber);

  return lifePathNumber;
}

/**
 * Get Life Path Number meaning and details
 */
export function getLifePathMeaning(number: number): LifePathData | null {
  return LIFE_PATH_DATA[number] || null;
}

/**
 * Format Life Path Number with emoji
 */
export function formatLifePathNumber(number: number): string {
  const data = getLifePathMeaning(number);
  if (!data) return `${number}`;
  return `${data.emoji} ${number}`;
}

/**
 * Get compatibility score between two Life Path Numbers
 * Returns score from 0-10 and description
 */
export function getCompatibility(
  number1: number,
  number2: number
): { score: number; description: string } | null {
  const data = getLifePathMeaning(number1);
  if (!data) return null;

  const compatibility = data.compatibility.find((c) => c.number === number2);
  return compatibility || { score: 5, description: 'Неутрална съвместимост' };
}

/**
 * Get all Life Path Numbers (for grid display)
 */
export function getAllLifePathNumbers(): number[] {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];
}

/**
 * Validate Life Path Number
 */
export function isValidLifePathNumber(number: number): boolean {
  return getAllLifePathNumbers().includes(number);
}
