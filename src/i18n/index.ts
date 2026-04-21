import type { Dictionary, Locale, UIStrings } from "./types";
import { LOCALES } from "./types";
import { en } from "./en";
import { pl } from "./pl";
import { de } from "./de";

const DICTIONARIES: Record<Locale, Dictionary> = { en, pl, de };

let currentLocale: Locale = "en";
const listeners = new Set<() => void>();

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

export const setLocale = (locale: Locale): void => {
  if (currentLocale === locale) return;
  currentLocale = locale;
  applyI18nToDOM();
  for (const fn of listeners) fn();
};

export const onLocaleChange = (fn: () => void): (() => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

export const getDictionary = (): Dictionary => DICTIONARIES[currentLocale];

export const t = (key: keyof UIStrings): string =>
  DICTIONARIES[currentLocale].ui[key];

export const applyI18nToDOM = (): void => {
  const ui = DICTIONARIES[currentLocale].ui;
  document.documentElement.lang = currentLocale;

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n as keyof UIStrings;
    const value = ui[key];
    if (typeof value === "string") el.textContent = value;
  });
  document.querySelectorAll<HTMLElement>("[data-i18n-aria]").forEach((el) => {
    const key = el.dataset.i18nAria as keyof UIStrings;
    const value = ui[key];
    if (typeof value === "string") el.setAttribute("aria-label", value);
  });
  document.querySelectorAll<HTMLOptionElement>("[data-i18n-option]").forEach((el) => {
    const key = el.dataset.i18nOption as keyof UIStrings;
    const value = ui[key];
    if (typeof value === "string") el.textContent = value;
  });
};
