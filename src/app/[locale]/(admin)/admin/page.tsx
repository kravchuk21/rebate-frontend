import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/components/dashboard/PageHeader';

import { Link } from '@/i18n/navigation';
import { DashboardLayout, DashboardItem } from '@/shared/components/layout';

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
    <>
      <PageHeader title={t('overview.title')} />
      <DashboardLayout>
        {links.map((link) => (
          <DashboardItem key={link.href} span={4}>
            <Link
              href={link.href}
              className="block rounded-lg border border-default p-4 font-medium hover:bg-muted"
            >
              {link.label}
            </Link>
          </DashboardItem>
        ))}
      </DashboardLayout>
    </>
  );
}
