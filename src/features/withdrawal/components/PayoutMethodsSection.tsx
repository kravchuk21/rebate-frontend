'use client';

import '@/shared/api/instance';

import { useState } from 'react';
import { Alert, Button, Card, Skeleton, Typography } from '@heroui/react';
import { useTranslations } from 'next-intl';

import type { WithdrawalPayoutMethodResponse } from '@/shared/api/generated/types.gen';

import { usePayoutMethods } from '../hooks/usePayoutMethods';
import { AddPayoutMethodModal } from './AddPayoutMethodModal';
import { PayoutMethodCard } from './PayoutMethodCard';

export const PayoutMethodsSection = () => {
  const t = useTranslations('withdrawal.payoutMethods');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, isError } = usePayoutMethods();

  const methods = (data?.data as WithdrawalPayoutMethodResponse[] | undefined) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Typography.Heading className="text-lg">{t('title')}</Typography.Heading>
        <Button onPress={() => setIsModalOpen(true)}>{t('add')}</Button>
      </div>

      {isError && (
        <Alert status="danger">
          <Alert.Content>
            <Alert.Description>{t('errors.loadFailed')}</Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {!isLoading && !isError && methods.length === 0 && (
        <Card>
          <Card.Content className="flex flex-col items-center gap-4 py-12 text-center">
            <Typography.Heading className="text-lg">{t('empty')}</Typography.Heading>
            <p className="text-muted">{t('emptyDesc')}</p>
            <Button onPress={() => setIsModalOpen(true)}>{t('add')}</Button>
          </Card.Content>
        </Card>
      )}

      {!isLoading && !isError && methods.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {methods.map((method) => (
            <PayoutMethodCard key={method.id} method={method} />
          ))}
        </div>
      )}

      <AddPayoutMethodModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};
