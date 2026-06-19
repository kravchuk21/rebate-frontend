'use client';

import { Button } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { useModal } from '@/shared/hooks/useModal';
import { Modals } from '@/shared/lib/routes';
import { DashboardLayout, DashboardItem } from '@/shared/components/layout';

import { BrokerAccountsTable } from './BrokerAccountsTable';
import { SubmitAccountModal } from './SubmitAccountModal';

export const BrokerAccountsPageClient = () => {
  const t = useTranslations('accounts');
  const { open } = useModal(Modals.SubmitAccount);

  return (
    <DashboardLayout>
      <DashboardItem className="flex items-center justify-end">
        <Button onPress={() => open()}>{t('addAccount')}</Button>
      </DashboardItem>

      <DashboardItem span={12}>
        <BrokerAccountsTable />
      </DashboardItem>

      <SubmitAccountModal />
    </DashboardLayout>
  );
};
