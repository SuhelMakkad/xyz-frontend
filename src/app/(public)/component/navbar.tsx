'use client';

import { useLocalStorage } from 'usehooks-ts';

import Link from 'next/link';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useI18n } from '@/locales/client';
import { routes } from '@/utils/routes';

export const Navbar = () => {
  const t = useI18n();
  const [locale, setLocale] = useLocalStorage('locale', 'en');

  return (
    <nav className="border-b">
      <div className="container py-2 flex items-center justify-between">
        <Link href={routes.home}>{t('navigation.title')}</Link>

        <Select onValueChange={setLocale} value={locale}>
          <SelectTrigger size="sm">
            <SelectValue placeholder={t('navigation.language')} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="en">{t('navigation.languages.en')}</SelectItem>
            <SelectItem value="ar">{t('navigation.languages.ar')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </nav>
  );
};
