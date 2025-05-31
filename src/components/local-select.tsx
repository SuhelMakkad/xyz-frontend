'use client';

import { Globe } from 'lucide-react';
import { useLocalStorage } from 'usehooks-ts';

import React from 'react';

import { useI18n } from '@/locales/client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export const LocalSelect = () => {
  const [locale, setLocale] = useLocalStorage('locale', 'en');
  const t = useI18n();

  return (
    <Select onValueChange={setLocale} value={locale}>
      <SelectTrigger size="sm">
        <SelectValue placeholder={t('navigation.language')} />
        <Globe />
      </SelectTrigger>

      <SelectContent align="end">
        <SelectItem value="en">{t('navigation.languages.en')}</SelectItem>
        <SelectItem value="ar">{t('navigation.languages.ar')}</SelectItem>
      </SelectContent>
    </Select>
  );
};
