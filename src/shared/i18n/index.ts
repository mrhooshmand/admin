import { en } from "./translations/en";
import { fa } from "./translations/fa";
import type { Locale, TranslationKey, Translations } from "./types";

export type { Locale, TranslationKey, Translations };

const dictionaries: Record<Locale, Translations> = {
  en,
  fa,
};

export const LOCALE_STORAGE_KEY = "app-locale";
export const DEFAULT_LOCALE: Locale = "fa";

export function isLocale(value: unknown): value is Locale {
  return value === "fa" || value === "en";
}

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return locale === "fa" ? "rtl" : "ltr";
}

export function getIntlLocale(locale: Locale): string {
  return locale === "fa" ? "fa-IR" : "en-US";
}

export function translate(locale: Locale, key: TranslationKey): string {
  return dictionaries[locale][key] ?? dictionaries.en[key] ?? key;
}

export function applyDocumentLocale(locale: Locale) {
  const dir = getDirection(locale);
  const root = document.documentElement;

  root.lang = locale;
  root.dir = dir;
  root.dataset.locale = locale;
}
