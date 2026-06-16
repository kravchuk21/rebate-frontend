'use client';

import { Tabs } from '@heroui/react';
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
    items
      .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
      .sort((a, b) => b.href.length - a.href.length)[0] ?? items[0];

  return (
    <Tabs
      orientation="vertical"
      selectedKey={activeItem?.href}
      onSelectionChange={(key) => {
        router.push(key as string);
        onNavigate?.();
      }}
    >
      <Tabs.ListContainer className="w-full">
        <Tabs.List aria-label={ariaLabel} className="w-full">
          {items.map((item) => (
            <Tabs.Tab key={item.href} id={item.href} className="justify-start">
              {item.label}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
};
