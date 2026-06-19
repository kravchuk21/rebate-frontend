'use client';

import { Skeleton, Typography } from '@heroui/react';
import { useTranslations } from 'next-intl';

import type { RebateStatsResponse } from '@/shared/api/generated/types.gen';
import { formatAmount } from '@/features/withdrawal/lib/formatAmount';

type SummaryField = 'all_time' | 'last_7_days' | 'today' | 'current_month' | 'last_month';

const SUMMARY_ROWS: { labelKey: string; field: SummaryField }[] = [
  { labelKey: 'allTime', field: 'all_time' },
  { labelKey: 'last7Days', field: 'last_7_days' },
  { labelKey: 'today', field: 'today' },
  { labelKey: 'currentMonth', field: 'current_month' },
  { labelKey: 'lastMonth', field: 'last_month' },
];

interface RebateStatsSummaryProps {
  stats: RebateStatsResponse | undefined;
  isLoading: boolean;
}

export const RebateStatsSummary = ({ stats, isLoading }: RebateStatsSummaryProps) => {
  const t = useTranslations('rebate.stats');

  return (
    <>
      {SUMMARY_ROWS.map(({ labelKey, field }) => (
        <div key={field} className="flex justify-between">
          <Typography.Paragraph className="flex-1" size="sm" color="muted">
            {t(`summary.${labelKey}`)}
          </Typography.Paragraph>
          <Typography.Paragraph className="flex-1 text-right" size="sm">
            {isLoading ? <Skeleton className="h-7 w-full" /> : `${formatAmount(stats?.[field])} USDT`}
          </Typography.Paragraph>
        </div>
      ))}
    </>
  );
};
