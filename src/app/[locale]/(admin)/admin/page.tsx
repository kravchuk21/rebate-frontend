import { Typography } from '@heroui/react';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

export default async function AdminOverviewPage() {
  const t = await getTranslations('admin');

  const links = [
    { href: '/admin/users', label: t('nav.users') },
    { href: '/admin/broker-accounts', label: t('nav.brokerAccounts') },
    { href: '/admin/withdrawals', label: t('nav.withdrawals') },
    { href: '/admin/rebate', label: t('nav.rebate') },
    { href: '/admin/config', label: t('nav.config') },
    { href: '/admin/audit-log', label: t('nav.auditLog') },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <Typography.Heading>{t('overview.title')}</Typography.Heading>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg border border-default p-4 font-medium hover:bg-muted"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
