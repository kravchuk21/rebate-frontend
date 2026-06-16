'use client';

import { useTranslations } from 'next-intl';
import { Tab, TabIndicator, TabList, TabListContainer, TabsRoot } from '@heroui/react';
import { useRouter, usePathname } from '@/i18n/navigation';

const adminNavItems = [
  { href: '/admin', labelKey: 'overview' },
  { href: '/admin/users', labelKey: 'users' },
  { href: '/admin/broker-accounts', labelKey: 'brokerAccounts' },
  { href: '/admin/withdrawals', labelKey: 'withdrawals' },
  { href: '/admin/rebate', labelKey: 'rebate' },
  { href: '/admin/config', labelKey: 'config' },
  { href: '/admin/audit-log', labelKey: 'auditLog' },
] as const;

interface AdminSidebarNavProps {
  onNavigate?: () => void;
}

export const AdminSidebarNav = ({ onNavigate }: AdminSidebarNavProps) => {
  const t = useTranslations('admin.nav');
  const pathname = usePathname();
  const router = useRouter();

  const activeItem =
    adminNavItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ??
    adminNavItems[0];

  return (
    <div className="flex flex-col gap-2">
      <TabsRoot
        orientation="vertical"
        selectedKey={activeItem.href}
        onSelectionChange={(key) => {
          router.push(key as string);
          onNavigate?.();
        }}
      >
        <TabListContainer className="w-full">
          <TabList aria-label="Admin navigation" className="w-full">
            {adminNavItems.map((item) => (
              <Tab key={item.href} id={item.href} className="justify-start">
                {t(item.labelKey)}
                <TabIndicator />
              </Tab>
            ))}
          </TabList>
        </TabListContainer>
      </TabsRoot>
    </div>
  );
};
