import Link from 'next/link';

import { Translate } from '@/components/translate';
import { Button } from '@/components/ui/button';
import { locales } from '@/locales/types';
import { routes } from '@/utils/routes';

export const generateStaticParams = async () => {
  return locales.map((locale) => ({ locale }));
};

export default async function Home() {
  return (
    <main className="flex my-20 items-center justify-center">
      <Button asChild>
        <Link href={routes.dashboard}>
          <Translate tKey="homePage.dashboard" />
        </Link>
      </Button>
    </main>
  );
}
