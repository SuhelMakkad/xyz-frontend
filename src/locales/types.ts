import en from '@/translations/en';

export const locales = ['en', 'ar'] as const;

export type Locale = (typeof locales)[number];

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object ? `${K & string}.${NestedKeyOf<T[K]> & string}` : K;
    }[keyof T]
  : never;

export type TranslationKey = NestedKeyOf<typeof en>;
