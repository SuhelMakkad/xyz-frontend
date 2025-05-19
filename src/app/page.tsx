import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { routes } from '@/utils/routes';

export default function Home() {
  return (
    <main className="flex h-dvh w-dvw items-center justify-center">
      <Button asChild>
        <Link href={routes.dashboard}>Dashboard</Link>
      </Button>
    </main>
  );
}
