'use client';

import { Card, Skeleton, Typography } from '@heroui/react';
import { useTranslations } from 'next-intl';

import type { ReferralStatsResponse } from '@/shared/api/generated/types.gen';
import { formatAmount } from '@/features/withdrawal/lib/formatAmount';

import { useReferralStats } from '../hooks/useReferralStats';
import { WidgetCard } from '@/shared/components/WidgetCard';

export const ReferralStatsCard = () => {
  const t = useTranslations('referrals.stats');
  const { data, isLoading, isError } = useReferralStats();

  const stats = data?.data as ReferralStatsResponse | undefined;

  return (
    <WidgetCard>
      <Card.Header>
        <Card.Title>{t('title')}</Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-col">
        {isError ? (
          <Typography.Paragraph size="sm" className="text-danger">—</Typography.Paragraph>
        ) : isLoading ? (
          <>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <Typography.Paragraph size="sm" color="muted">{t('totalReferrals')}</Typography.Paragraph>
              <Typography type="body-sm">{stats?.total_referrals ?? 0}</Typography>
            </div>
            <div className="flex items-center justify-between">
              <Typography.Paragraph size="sm" color="muted">{t('activeReferrals')}</Typography.Paragraph>
              <Typography type="body-sm">{stats?.active_referrals ?? 0}</Typography>
            </div>
            <div className="flex items-center justify-between">
              <Typography.Paragraph size="sm" color="muted">{t('totalEarned')}</Typography.Paragraph>
              <Typography type="body-sm">{formatAmount(stats?.total_earned)} USDT</Typography>
            </div>
            <div className="flex items-center justify-between">
              <Typography.Paragraph size="sm" color="muted">{t('pendingEarned')}</Typography.Paragraph>
              <Typography type="body-sm">{formatAmount(stats?.pending_earned)} USDT</Typography>
            </div>
          </>
        )}
      </Card.Content>
    </WidgetCard>
  );
};
