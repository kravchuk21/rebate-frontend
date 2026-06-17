'use client';

import '@/shared/api/instance';

import { Alert, Card, Skeleton, Typography } from '@heroui/react';
import { useTranslations } from 'next-intl';

import type { WithdrawalBalanceResponse } from '@/shared/api/generated/types.gen';

import { useBalance } from '../hooks/useBalance';
import { formatAmount } from '../lib/formatAmount';
import { DashboardLayout, DashboardItem } from '@/shared/components/layout';
import { InfoTooltip } from './InfoTooltip';

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
    <Card variant='transparent' className='p-0'>
      <Card.Header>
        <Card.Title>{t('title')}</Card.Title>
      </Card.Header>
      <Card.Content>
        <DashboardLayout>
          <DashboardItem span={4}>
            <Card variant='secondary'>
              <Card.Header>
                <div className='flex justify-between items-center'>
                  <Card.Title>{t('total')}</Card.Title>
                  <InfoTooltip title={t('totalHint.title')} description={t('totalHint.description')} />
                </div>
              </Card.Header>
              <Card.Content>
                {isLoading ? (
                  <Skeleton className="h-7 w-full" />
                ) : (
                  <Typography.Paragraph>
                    {formatAmount(balance?.total)} USDT
                  </Typography.Paragraph>
                )}
              </Card.Content>
            </Card>
          </DashboardItem>
          <DashboardItem span={4}>
            <Card variant='secondary'>
              <Card.Header>
                <div className='flex justify-between items-center'>
                  <Card.Title>{t('frozen')}</Card.Title>
                  <InfoTooltip title={t('frozenHint.title')} description={t('frozenHint.description')} />
                </div>
              </Card.Header>
              <Card.Content>
                {isLoading ? (
                  <Skeleton className="h-7 w-full" />
                ) : (
                  <Typography.Paragraph>
                    {formatAmount(balance?.frozen)} USDT
                  </Typography.Paragraph>
                )}
              </Card.Content>
            </Card>
          </DashboardItem>
          <DashboardItem span={4}>
            <Card variant='secondary'>
              <Card.Header>
                <div className='flex justify-between items-center'>
                  <Card.Title>{t('available')}</Card.Title>
                  <InfoTooltip title={t('availableHint.title')} description={t('availableHint.description')} />
                </div>
              </Card.Header>
              <Card.Content>
                {isLoading ? (
                  <Skeleton className="h-7 w-full" />
                ) : (
                  <Typography.Paragraph>
                    {formatAmount(balance?.available)} USDT
                  </Typography.Paragraph>
                )}
              </Card.Content>
            </Card>
          </DashboardItem>
        </DashboardLayout>
      </Card.Content>
    </Card>
  );
};
