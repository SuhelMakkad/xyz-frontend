'use client';

import {
  Icon,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';

import * as React from 'react';

import { NavDocuments } from '@/app/dashboard/components/nav-documents';
import { NavMain } from '@/app/dashboard/components/nav-main';
import { NavSecondary } from '@/app/dashboard/components/nav-secondary';
import { NavUser } from '@/app/dashboard/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useI18n } from '@/locales/client';
import { TranslationKey } from '@/locales/types';

type NavMainItem = {
  title: TranslationKey;
  url: string;
  icon?: Icon;
};

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'sidebar.main.dashboard',
      url: '#',
      icon: IconDashboard,
    },
    {
      title: 'sidebar.main.lifecycle',
      url: '#',
      icon: IconListDetails,
    },
    {
      title: 'sidebar.main.analytics',
      url: '#',
      icon: IconChartBar,
    },
    {
      title: 'sidebar.main.projects',
      url: '#',
      icon: IconFolder,
    },
    {
      title: 'sidebar.main.team',
      url: '#',
      icon: IconUsers,
    },
  ] satisfies NavMainItem[],
  navSecondary: [
    {
      title: 'sidebar.secondary.settings',
      url: '#',
      icon: IconSettings,
    },
    {
      title: 'sidebar.secondary.getHelp',
      url: '#',
      icon: IconHelp,
    },
    {
      title: 'sidebar.secondary.search',
      url: '#',
      icon: IconSearch,
    },
  ] satisfies NavMainItem[],
  documents: [
    {
      title: 'sidebar.documents.dataLibrary',
      url: '#',
      icon: IconDatabase,
    },
    {
      title: 'sidebar.documents.reports',
      url: '#',
      icon: IconReport,
    },
    {
      title: 'sidebar.documents.wordAssistant',
      url: '#',
      icon: IconFileWord,
    },
  ] satisfies NavMainItem[],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useI18n();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">{t('sidebar.company')}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
