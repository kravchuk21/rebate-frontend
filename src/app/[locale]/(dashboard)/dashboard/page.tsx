import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/components/dashboard/PageHeader';

import { DashboardSummaryCards } from '@/features/broker/components/DashboardSummaryCards';
import { ReferralLinkCard } from '@/features/referral/components/ReferralLinkCard';

export default async function DashboardPage() {
  const t = await getTranslations('dashboard');

  return (
    <>
      <PageHeader title={t('title')} />
      <DashboardSummaryCards />
      <ReferralLinkCard />
    </>
  );
}
