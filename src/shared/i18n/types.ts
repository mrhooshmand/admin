export type Locale = "fa" | "en";

export type TranslationKey = keyof typeof import("./translations/en").en;

export type Translations = Record<TranslationKey, string>;
