'use client';

import { useI18n } from '@/locales/client';
import en from '@/translations/en';

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object ? `${K & string}.${NestedKeyOf<T[K]> & string}` : K;
    }[keyof T]
  : never;

type TranslationKey = NestedKeyOf<typeof en>;

export const Translate = ({ tKey }: { tKey: TranslationKey }) => {
  const t = useI18n();

  return <>{t(tKey)}</>;
};
