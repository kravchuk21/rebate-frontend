'use client';

import { Tab, TabIndicator, TabList, TabListContainer, TabsRoot } from '@heroui/react';
import { useRouter, usePathname } from '@/i18n/navigation';

export interface SidebarNavItem {
  href: string;
  label: string;
}

interface SidebarNavProps {
  items: readonly SidebarNavItem[];
  ariaLabel?: string;
  onNavigate?: () => void;
}

export const SidebarNav = ({ items, ariaLabel = 'Navigation', onNavigate }: SidebarNavProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const activeItem =
    items.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ??
    items[0];

  return (
    <TabsRoot
      orientation="vertical"
      selectedKey={activeItem?.href}
      onSelectionChange={(key) => {
        router.push(key as string);
        onNavigate?.();
      }}
    >
      <TabListContainer className="w-full">
        <TabList aria-label={ariaLabel} className="w-full">
          {items.map((item) => (
            <Tab key={item.href} id={item.href} className="justify-start">
              {item.label}
              <TabIndicator />
            </Tab>
          ))}
        </TabList>
      </TabListContainer>
    </TabsRoot>
  );
};
