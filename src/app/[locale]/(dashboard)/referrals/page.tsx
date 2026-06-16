import { Typography } from '@heroui/react';
import { getTranslations } from 'next-intl/server';
import { SidebarToggle } from '@/shared/components/dashboard/SidebarToggle';

import { ReferralLinkCard } from '@/features/referral/components/ReferralLinkCard';
import { ReferralsTable } from '@/features/referral/components/ReferralsTable';
import { ReferralStatsCard } from '@/features/referral/components/ReferralStatsCard';

export default async function ReferralsPage() {
  const t = await getTranslations('referrals');

  return (
    <>
      <div className="flex items-center gap-4">
        <SidebarToggle/>
        <Typography type="h4">{t('title')}</Typography>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReferralStatsCard />
        <ReferralLinkCard />
      </div>
      <ReferralsTable />
    </>
  );
}
