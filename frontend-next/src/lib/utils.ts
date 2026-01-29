import { LocalizedString } from '@/types';

export function getLocalizedName(name: string | LocalizedString, lang: 'ar' | 'en'): string {
  if (typeof name === 'string') return name;
  return lang === 'ar' ? name.ar : name.en;
}
