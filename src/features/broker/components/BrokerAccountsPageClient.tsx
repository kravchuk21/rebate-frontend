'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { DashboardLayout, DashboardItem } from '@/shared/components/layout';

import { BrokerAccountsTable } from './BrokerAccountsTable';
import { SubmitAccountModal } from './SubmitAccountModal';

export const BrokerAccountsPageClient = () => {
  const t = useTranslations('accounts');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <DashboardItem className="flex items-center justify-end">
        <Button onPress={() => setIsModalOpen(true)}>{t('addAccount')}</Button>
      </DashboardItem>

      <DashboardItem span={12}>
        <BrokerAccountsTable onAddAccount={() => setIsModalOpen(true)} />
      </DashboardItem>

      <SubmitAccountModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </DashboardLayout>
  );
};
