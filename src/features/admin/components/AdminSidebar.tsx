'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Persons, CreditCard, ArrowUpFromLine, ListCheck, Gear, ListCheckLock } from '@gravity-ui/icons';

import { SidebarShell } from '@/shared/components/dashboard/SidebarShell';

const ADMIN_NAV_KEYS = [
  { href: '/admin/users', labelKey: 'users', icon: Persons },
  { href: '/admin/broker-accounts', labelKey: 'brokerAccounts', icon: CreditCard },
  { href: '/admin/withdrawals', labelKey: 'withdrawals', icon: ArrowUpFromLine },
  { href: '/admin/rebate', labelKey: 'rebate', icon: ListCheck },
  { href: '/admin/config', labelKey: 'config', icon: Gear },
  { href: '/admin/audit-log', labelKey: 'auditLog', icon: ListCheckLock },
] as const;

interface AdminSidebarProps {
  email: string;
  role: string;
}

export const AdminSidebar = ({ email, role }: AdminSidebarProps) => {
  const t = useTranslations('admin.nav');

  const items = useMemo(
    () =>
      ADMIN_NAV_KEYS.map((item) => ({
        href: item.href,
        label: t(item.labelKey),
        icon: item.icon,
      })),
    [t],
  );

  return <SidebarShell email={email} role={role} items={items} ariaLabel={t('ariaLabel')} />;
};
