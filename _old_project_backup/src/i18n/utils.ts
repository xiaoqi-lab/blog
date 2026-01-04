import type { Language } from './index';

const LANGUAGE_KEY = 'preferred-language';

export function getStoredLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(LANGUAGE_KEY);
  if (stored === 'en' || stored === 'zh') {
    return stored;
  }
  return null;
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LANGUAGE_KEY, lang);
}

export function getBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'zh' ? 'zh' : 'en';
}

export function getInitialLanguage(): Language {
  return getStoredLanguage() || getBrowserLanguage();
}

