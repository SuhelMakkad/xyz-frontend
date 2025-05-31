'use client';

import { useLocalStorage } from 'usehooks-ts';

import { PropsWithChildren, useEffect } from 'react';

import { I18nProviderClient } from '@/locales/client';

export const I18nProvider = ({ children }: PropsWithChildren) => {
  const [locale] = useLocalStorage('locale', 'en');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    document.documentElement.lang = locale;
  }, [locale]);

  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>;
};
