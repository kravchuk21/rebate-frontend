'use client';

import { memo, useMemo } from 'react';
import { Button } from '@heroui/react';
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

export const SidebarNav = memo(function SidebarNav({ items, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const cleanPathname = pathname.split('?')[0];

  const activeHref = useMemo(
    () =>
      (
        items
          .filter(
            (item) =>
              cleanPathname === item.href || cleanPathname.startsWith(`${item.href}/`),
          )
          .sort((a, b) => b.href.length - a.href.length)[0] ?? items[0]
      )?.href,
    [items, cleanPathname],
  );

  return (
    <div className="w-full flex flex-col gap-1">
      {items.map((item) => (
        <Button
          key={item.href}
          variant={item.href === activeHref ? 'tertiary' : 'ghost'}
          fullWidth
          className="justify-start"
          onPress={() => {
            if (pathname !== item.href) {
              router.push(item.href);
            }

            onNavigate?.();
          }}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
});
