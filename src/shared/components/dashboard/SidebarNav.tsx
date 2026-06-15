'use client';

import { useTranslations } from 'next-intl';
import { Tab, TabIndicator, TabList, TabListContainer, TabsRoot } from '@heroui/react';
import { useRouter, usePathname } from '@/i18n/navigation';

const navItems = [
  { href: '/dashboard', labelKey: 'dashboard' },
  { href: '/accounts', labelKey: 'accounts' },
  { href: '/rebate', labelKey: 'rebate' },
  { href: '/withdrawal', labelKey: 'withdrawal' },
  { href: '/referrals', labelKey: 'referrals' },
  { href: '/profile', labelKey: 'profile' },
] as const;

interface SidebarNavProps {
  onNavigate?: () => void;
}

export const SidebarNav = ({ onNavigate }: SidebarNavProps) => {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();

  const activeItem =
    navItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ??
    navItems[0];

  return (
    <TabsRoot
      orientation="vertical"
      selectedKey={activeItem.href}
      onSelectionChange={(key) => {
        router.push(key as string);
        onNavigate?.();
      }}
    >
      <TabListContainer className="w-full">
        <TabList aria-label="Dashboard navigation" className="w-full">
          {navItems.map((item) => (
            <Tab key={item.href} id={item.href} className="justify-start">
              {t(item.labelKey)}
              <TabIndicator />
            </Tab>
          ))}
        </TabList>
      </TabListContainer>
    </TabsRoot>
  );
};
