'use client';

import { createI18nClient } from 'next-international/client';

// Do not use createI18nServer as it will not be able to detect the locale changes
// Use translate component instead for server components

export const { useI18n, useScopedI18n, I18nProviderClient, useChangeLocale, useCurrentLocale } =
  createI18nClient({
    en: () => import('@/translations/en'),
    ar: () => import('@/translations/ar'),
  });
