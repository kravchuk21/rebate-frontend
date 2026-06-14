'use client';

import { useState } from 'react';
import { Button, Tabs } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { SharedElementTransition } from 'react-aria-components';

import { BalanceCard } from './BalanceCard';
import { CreateWithdrawalModal } from './CreateWithdrawalModal';
import { LedgerTable } from './LedgerTable';
import { PayoutMethodsSection } from './PayoutMethodsSection';
import { WithdrawalsTable } from './WithdrawalsTable';

export const WithdrawalPageClient = () => {
  const t = useTranslations('withdrawal');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  return (
    <SharedElementTransition>
      <Tabs>
        <Tabs.ListContainer>
          <Tabs.List>
            <Tabs.Tab id="overview">{t('tabs.overview')}</Tabs.Tab>
            <Tabs.Tab id="history">{t('tabs.history')}</Tabs.Tab>
            <Tabs.Tab id="payoutMethods">{t('tabs.payoutMethods')}</Tabs.Tab>
            <Tabs.Indicator />
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel id="overview">
          <div className="flex flex-col gap-6">
            <BalanceCard />
            <div className="flex items-center justify-end">
              <Button onPress={() => setIsWithdrawModalOpen(true)}>
                {t('request.title')}
              </Button>
            </div>
            <LedgerTable limit={10} />
          </div>
        </Tabs.Panel>

        <Tabs.Panel id="history">
          <WithdrawalsTable />
        </Tabs.Panel>

        <Tabs.Panel id="payoutMethods">
          <PayoutMethodsSection />
        </Tabs.Panel>

        <CreateWithdrawalModal isOpen={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen} />
      </Tabs>
    </SharedElementTransition>
  );
};
