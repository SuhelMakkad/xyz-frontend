'use client';

import { useI18n } from '@/locales/client';
import { TranslationKey } from '@/locales/types';

export const Translate = ({ tKey }: { tKey: TranslationKey }) => {
  const t = useI18n();

  return <>{t(tKey)}</>;
};
