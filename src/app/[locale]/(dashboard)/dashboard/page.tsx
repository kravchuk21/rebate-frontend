import { Typography } from '@heroui/react';
import { getTranslations } from 'next-intl/server';
import { SidebarToggle } from '@/shared/components/dashboard/SidebarToggle';


import { DashboardSummaryCards } from '@/features/broker/components/DashboardSummaryCards';
import { ReferralLinkCard } from '@/features/referral/components/ReferralLinkCard';

export default async function DashboardPage() {
  const t = await getTranslations('dashboard');

  return (
    <>
      <div className="flex items-center gap-4">
        <SidebarToggle/>
        <Typography type="h4">{t('title')}</Typography>
      </div>
      <DashboardSummaryCards />
      <ReferralLinkCard />
    </>
  );
}
