'use client';

import Link from 'next/link';

import { LocalSelect } from '@/components/local-select';
import { useI18n } from '@/locales/client';
import { routes } from '@/utils/routes';

export const Navbar = () => {
  const t = useI18n();

  return (
    <nav className="border-b">
      <div className="container py-2 flex items-center justify-between">
        <Link href={routes.home}>{t('navigation.title')}</Link>

        <LocalSelect />
      </div>
    </nav>
  );
};
