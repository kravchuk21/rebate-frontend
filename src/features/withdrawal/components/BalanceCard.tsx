'use client';

import '@/shared/api/instance';

import { Alert, Card, Skeleton, Tooltip } from '@heroui/react';
import { useTranslations } from 'next-intl';

import type { WithdrawalBalanceResponse } from '@/shared/api/generated/types.gen';

import { useBalance } from '../hooks/useBalance';
import { formatAmount } from '../lib/formatAmount';

export const BalanceCard = () => {
  const t = useTranslations('withdrawal.balance');
  const { data, isLoading, isError } = useBalance();

  if (isError) {
    return (
      <Alert status="danger">
        <Alert.Content>
          <Alert.Description>{t('errors.loadFailed')}</Alert.Description>
        </Alert.Content>
      </Alert>
    );
  }

  const balance = data?.data as WithdrawalBalanceResponse | undefined;

  return (
    <Card>
      <Card.Header>
        <Card.Title>{t('title')}</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted">{t('total')}</span>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <span className="text-2xl font-semibold">
                {formatAmount(balance?.total)} USDT
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Tooltip>
              <Tooltip.Trigger className="w-fit">
                <span className="text-sm text-muted underline decoration-dotted">
                  {t('frozen')}
                </span>
              </Tooltip.Trigger>
              <Tooltip.Content>{t('frozenHint')}</Tooltip.Content>
            </Tooltip>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <span className="text-2xl font-semibold">
                {formatAmount(balance?.frozen)} USDT
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted">{t('available')}</span>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <span className="text-2xl font-semibold text-accent">
                {formatAmount(balance?.available)} USDT
              </span>
            )}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
