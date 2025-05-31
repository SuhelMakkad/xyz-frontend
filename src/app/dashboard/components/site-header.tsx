import { LocalSelect } from '@/components/local-select';
import { ThemeToggle } from '@/components/theme-toggle';
import { Translate } from '@/components/translate';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/utils/cn';

export function SiteHeader(props: { className?: string }) {
  return (
    <header
      className={cn(
        'flex shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear',
        props.className
      )}
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">
          <Translate tKey="pageTitles.documents" />
        </h1>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <LocalSelect />
        </div>
      </div>
    </header>
  );
}
