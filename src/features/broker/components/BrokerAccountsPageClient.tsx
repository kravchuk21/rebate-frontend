'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { BrokerAccountsTable } from './BrokerAccountsTable';
import { SubmitAccountModal } from './SubmitAccountModal';

export const BrokerAccountsPageClient = () => {
  const t = useTranslations('accounts');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <Button onPress={() => setIsModalOpen(true)}>{t('addAccount')}</Button>
      </div>
      <BrokerAccountsTable onAddAccount={() => setIsModalOpen(true)} />
      <SubmitAccountModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};
