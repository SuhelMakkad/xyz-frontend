'use client';

import { useSortable } from '@dnd-kit/sortable';
import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLoader,
  IconTrendingUp,
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { toast } from 'sonner';
import { z } from 'zod';

import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { useI18n } from '@/locales/client';

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
});

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  });
  const t = useI18n();

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">{t('dataTable.dragToReorder')}</span>
    </Button>
  );
}

// Custom hook for table translations
function useTableTranslations() {
  const t = useI18n();
  return {
    selectAll: t('dataTable.selectAll'),
    selectRow: t('dataTable.selectRow'),
    header: t('dataTable.header'),
    sectionType: t('dataTable.sectionType'),
    status: t('dataTable.status'),
    target: t('dataTable.target'),
    limit: t('dataTable.limit'),
    reviewer: t('dataTable.reviewer'),
    assignReviewer: t('dataTable.assignReviewer'),
    openMenu: t('dataTable.openMenu'),
    actions: {
      edit: t('dataTable.actions.edit'),
      makeCopy: t('dataTable.actions.makeCopy'),
      favorite: t('dataTable.actions.favorite'),
      delete: t('dataTable.actions.delete'),
    },
    drawer: {
      showingVisitors: t('dataTable.drawer.showingVisitors'),
      trendingUp: t('dataTable.drawer.trendingUp'),
      visitorDescription: t('dataTable.drawer.visitorDescription'),
      type: {
        label: t('dataTable.drawer.type.label'),
        placeholder: t('dataTable.drawer.type.placeholder'),
        options: {
          tableOfContents: t('dataTable.drawer.type.options.tableOfContents'),
          executiveSummary: t('dataTable.drawer.type.options.executiveSummary'),
          technicalApproach: t('dataTable.drawer.type.options.technicalApproach'),
          design: t('dataTable.drawer.type.options.design'),
          capabilities: t('dataTable.drawer.type.options.capabilities'),
          focusDocuments: t('dataTable.drawer.type.options.focusDocuments'),
          narrative: t('dataTable.drawer.type.options.narrative'),
          coverPage: t('dataTable.drawer.type.options.coverPage'),
        },
      },
      status: {
        label: t('dataTable.drawer.status.label'),
        placeholder: t('dataTable.drawer.status.placeholder'),
        options: {
          done: t('dataTable.drawer.status.options.done'),
          inProgress: t('dataTable.drawer.status.options.inProgress'),
          notStarted: t('dataTable.drawer.status.options.notStarted'),
        },
      },
      target: {
        label: t('dataTable.drawer.target.label'),
      },
      limit: {
        label: t('dataTable.drawer.limit.label'),
      },
      reviewer: {
        label: t('dataTable.drawer.reviewer.label'),
        placeholder: t('dataTable.drawer.reviewer.placeholder'),
        options: {
          eddieLake: t('dataTable.drawer.reviewer.options.eddieLake'),
          jamikTashpulatov: t('dataTable.drawer.reviewer.options.jamikTashpulatov'),
          emilyWhalen: t('dataTable.drawer.reviewer.options.emilyWhalen'),
        },
      },
      buttons: {
        submit: t('dataTable.drawer.buttons.submit'),
        done: t('dataTable.drawer.buttons.done'),
      },
    },
  };
}

// Table component that uses translations
function TableWithTranslations({ data }: { data: z.infer<typeof schema>[] }) {
  const t = useTableTranslations();

  const columns: ColumnDef<z.infer<typeof schema>>[] = [
    {
      id: 'drag',
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label={t.selectAll}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={t.selectRow}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'header',
      header: t.header,
      cell: ({ row }) => {
        return <TableCellViewer item={row.original} />;
      },
      enableHiding: false,
    },
    {
      accessorKey: 'type',
      header: t.sectionType,
      cell: ({ row }) => (
        <div className="w-32">
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {row.original.type}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: t.status,
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.status === t.drawer.status.options.done ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconLoader />
          )}
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'target',
      header: () => <div className="w-full text-right">{t.target}</div>,
      cell: ({ row }) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
              loading: `Saving ${row.original.header}`,
              success: 'Done',
              error: 'Error',
            });
          }}
        >
          <Label htmlFor={`${row.original.id}-target`} className="sr-only">
            {t.target}
          </Label>
          <Input
            className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
            defaultValue={row.original.target}
            id={`${row.original.id}-target`}
          />
        </form>
      ),
    },
    {
      accessorKey: 'limit',
      header: () => <div className="w-full text-right">{t.limit}</div>,
      cell: ({ row }) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
              loading: `Saving ${row.original.header}`,
              success: 'Done',
              error: 'Error',
            });
          }}
        >
          <Label htmlFor={`${row.original.id}-limit`} className="sr-only">
            {t.limit}
          </Label>
          <Input
            className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
            defaultValue={row.original.limit}
            id={`${row.original.id}-limit`}
          />
        </form>
      ),
    },
    {
      accessorKey: 'reviewer',
      header: t.reviewer,
      cell: ({ row }) => {
        if (row.original.reviewer) {
          return row.original.reviewer;
        }

        return (
          <>
            <Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">
              {t.reviewer}
            </Label>
            <Select>
              <SelectTrigger
                className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                size="sm"
                id={`${row.original.id}-reviewer`}
              >
                <SelectValue placeholder={t.assignReviewer} />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value={t.drawer.reviewer.options.eddieLake}>
                  {t.drawer.reviewer.options.eddieLake}
                </SelectItem>
                <SelectItem value={t.drawer.reviewer.options.jamikTashpulatov}>
                  {t.drawer.reviewer.options.jamikTashpulatov}
                </SelectItem>
              </SelectContent>
            </Select>
          </>
        );
      },
    },
    {
      id: 'actions',
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">{t.openMenu}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>{t.actions.edit}</DropdownMenuItem>
            <DropdownMenuItem>{t.actions.makeCopy}</DropdownMenuItem>
            <DropdownMenuItem>{t.actions.favorite}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">{t.actions.delete}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return <DataTable data={data} columns={columns} />;
}

export const SalesTable = (props: { data: z.infer<typeof schema>[] }) => (
  <TableWithTranslations data={props.data} />
);

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '--chart-2',
  },
  mobile: {
    label: 'Mobile',
    color: '--chart-1',
  },
} satisfies ChartConfig;

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile();
  const t = useTableTranslations();

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.header}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.header}</DrawerTitle>
          <DrawerDescription>{t.drawer.showingVisitors}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill={chartConfig.mobile.color}
                    fillOpacity={0.6}
                    stroke={chartConfig.mobile.color}
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill={chartConfig.desktop.color}
                    fillOpacity={0.4}
                    stroke={chartConfig.desktop.color}
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  {t.drawer.trendingUp} <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">{t.drawer.visitorDescription}</div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">{t.header}</Label>
              <Input id="header" defaultValue={item.header} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type">{t.drawer.type.label}</Label>
                <Select defaultValue={item.type}>
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder={t.drawer.type.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={t.drawer.type.options.tableOfContents}>
                      {t.drawer.type.options.tableOfContents}
                    </SelectItem>
                    <SelectItem value={t.drawer.type.options.executiveSummary}>
                      {t.drawer.type.options.executiveSummary}
                    </SelectItem>
                    <SelectItem value={t.drawer.type.options.technicalApproach}>
                      {t.drawer.type.options.technicalApproach}
                    </SelectItem>
                    <SelectItem value={t.drawer.type.options.design}>
                      {t.drawer.type.options.design}
                    </SelectItem>
                    <SelectItem value={t.drawer.type.options.capabilities}>
                      {t.drawer.type.options.capabilities}
                    </SelectItem>
                    <SelectItem value={t.drawer.type.options.focusDocuments}>
                      {t.drawer.type.options.focusDocuments}
                    </SelectItem>
                    <SelectItem value={t.drawer.type.options.narrative}>
                      {t.drawer.type.options.narrative}
                    </SelectItem>
                    <SelectItem value={t.drawer.type.options.coverPage}>
                      {t.drawer.type.options.coverPage}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">{t.drawer.status.label}</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder={t.drawer.status.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={t.drawer.status.options.done}>
                      {t.drawer.status.options.done}
                    </SelectItem>
                    <SelectItem value={t.drawer.status.options.inProgress}>
                      {t.drawer.status.options.inProgress}
                    </SelectItem>
                    <SelectItem value={t.drawer.status.options.notStarted}>
                      {t.drawer.status.options.notStarted}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="target">{t.drawer.target.label}</Label>
                <Input id="target" defaultValue={item.target} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="limit">{t.drawer.limit.label}</Label>
                <Input id="limit" defaultValue={item.limit} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">{t.drawer.reviewer.label}</Label>
              <Select defaultValue={item.reviewer}>
                <SelectTrigger id="reviewer" className="w-full">
                  <SelectValue placeholder={t.drawer.reviewer.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={t.drawer.reviewer.options.eddieLake}>
                    {t.drawer.reviewer.options.eddieLake}
                  </SelectItem>
                  <SelectItem value={t.drawer.reviewer.options.jamikTashpulatov}>
                    {t.drawer.reviewer.options.jamikTashpulatov}
                  </SelectItem>
                  <SelectItem value={t.drawer.reviewer.options.emilyWhalen}>
                    {t.drawer.reviewer.options.emilyWhalen}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>{t.drawer.buttons.submit}</Button>
          <DrawerClose asChild>
            <Button variant="outline">{t.drawer.buttons.done}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
