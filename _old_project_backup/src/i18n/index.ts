import { en } from './locales/en';
import { zh } from './locales/zh';

export type Language = 'en' | 'zh';
export type Translation = typeof en;

export const translations: Record<Language, Translation> = {
  en,
  zh,
};

export const defaultLanguage: Language = 'en';
export const supportedLanguages: Language[] = ['en', 'zh'];

export function getTranslation(lang: Language): Translation {
  return translations[lang] || translations[defaultLanguage];
}

export function getLanguageFromPath(pathname: string): Language {
  // Check if path starts with /zh or /en
  if (pathname.startsWith('/zh')) return 'zh';
  if (pathname.startsWith('/en')) return 'en';
  // Default to browser language or default
  if (typeof window !== 'undefined') {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'zh') return 'zh';
  }
  return defaultLanguage;
}

