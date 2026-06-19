'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowDownToLine, CreditCard, House, Persons, PersonGear, ArrowUpFromLine } from '@gravity-ui/icons';

import { SidebarShell } from './SidebarShell';

const NAV_KEYS = [
  { href: '/dashboard', labelKey: 'dashboard', icon: House },
  { href: '/accounts', labelKey: 'accounts', icon: CreditCard },
  { href: '/rebate', labelKey: 'rebate', icon: ArrowDownToLine },
  { href: '/withdrawal', labelKey: 'withdrawal', icon: ArrowUpFromLine },
  { href: '/referrals', labelKey: 'referrals', icon: Persons, tag: 'new' },
  { href: '/profile', labelKey: 'profile', icon: PersonGear },
] as const;

interface SidebarProps {
  email: string;
  role: string;
}

export const Sidebar = ({ email, role }: SidebarProps) => {
  const t = useTranslations('nav');

  const items = useMemo(
    () =>
      NAV_KEYS.map((item) => ({
        href: item.href,
        label: t(item.labelKey),
        icon: item.icon,
        tag: 'tag' in item ? item.tag : undefined,
      })),
    [t],
  );

  return <SidebarShell email={email} role={role} items={items} ariaLabel={t('ariaLabel')} />;
};
