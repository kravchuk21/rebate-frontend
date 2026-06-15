'use client';

import { Card, Skeleton } from '@heroui/react';
import { useTranslations } from 'next-intl';

import type { ReferralStatsResponse } from '@/shared/api/generated/types.gen';
import { formatAmount } from '@/features/withdrawal/lib/formatAmount';

import { useReferralStats } from '../hooks/useReferralStats';

export const ReferralStatsCard = () => {
  const t = useTranslations('referrals.stats');
  const { data, isLoading, isError } = useReferralStats();

  const stats = data?.data as ReferralStatsResponse | undefined;

  return (
    <Card>
      <Card.Header>
        <Card.Title>{t('title')}</Card.Title>
      </Card.Header>
      <Card.Content>
        {isError ? (
          <p className="text-sm text-danger">—</p>
        ) : isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted">{t('totalReferrals')}</span>
              <span className="text-2xl font-semibold">{stats?.total_referrals ?? 0}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted">{t('activeReferrals')}</span>
              <span className="text-2xl font-semibold">{stats?.active_referrals ?? 0}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted">{t('totalEarned')}</span>
              <span className="text-2xl font-semibold">
                {formatAmount(stats?.total_earned)} USDT
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted">{t('pendingEarned')}</span>
              <span className="text-2xl font-semibold">
                {formatAmount(stats?.pending_earned)} USDT
              </span>
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};
