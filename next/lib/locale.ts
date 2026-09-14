import { i18n, type Locale } from '@/i18n.config';

export function isSupportedLocale(value: string): value is Locale {
  return (i18n.locales as readonly string[]).includes(value);
}

export function currencySymbol(locale: string): string {
  return locale === 'en' ? '$' : '€';
}
