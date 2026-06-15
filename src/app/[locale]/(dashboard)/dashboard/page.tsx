import { Typography } from '@heroui/react';
import { getTranslations } from 'next-intl/server';
import { SidebarToggle } from '@/shared/components/dashboard/SidebarToggle';


import { DashboardSummaryCards } from '@/features/broker/components/DashboardSummaryCards';

export default async function DashboardPage() {
  const t = await getTranslations('dashboard');

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex"><SidebarToggle/> <Typography.Heading>{t('title')}</Typography.Heading></div>
      <DashboardSummaryCards />
    </div>
  );
}
