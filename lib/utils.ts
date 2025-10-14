import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('bg-BG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Добро утро';
  if (hour < 18) return 'Добър ден';
  return 'Добър вечер';
}

export function getDayOfWeek(): string {
  return new Intl.DateTimeFormat('bg-BG', { weekday: 'long' }).format(new Date());
}
