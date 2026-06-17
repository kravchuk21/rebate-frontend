'use client';

import { useState } from 'react';
import { Button, Tabs } from '@heroui/react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useRouter, usePathname } from '@/i18n/navigation';

import { BalanceCard } from './BalanceCard';
import { CreateWithdrawalModal } from './CreateWithdrawalModal';
import { LedgerTable } from './LedgerTable';
import { PayoutMethodsSection } from './PayoutMethodsSection';
import { WithdrawalsTable } from './WithdrawalsTable';
import { DashboardLayout, DashboardItem } from '@/shared/components/layout';

const TABS = ['overview', 'history', 'payoutMethods'] as const;
type Tab = (typeof TABS)[number];

export const WithdrawalPageClient = () => {
  const t = useTranslations('withdrawal');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get('tab') as Tab | null;
  const activeTab: Tab = tabParam && TABS.includes(tabParam) ? tabParam : 'overview';

  const handleTabChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', key);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <Tabs selectedKey={activeTab} onSelectionChange={(key) => handleTabChange(String(key))}>
        <Tabs.ListContainer>
          <Tabs.List>
            <Tabs.Tab id="overview">{t('tabs.overview')}<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="history">{t('tabs.history')}<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="payoutMethods">{t('tabs.payoutMethods')}<Tabs.Indicator /></Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel id="overview">
          <DashboardLayout>
            <DashboardItem span={12}>
              <BalanceCard />
            </DashboardItem>
            <DashboardItem className="flex items-center justify-end">
              <Button onPress={() => setIsWithdrawModalOpen(true)}>
                {t('request.title')}
              </Button>
            </DashboardItem>
            <DashboardItem span={12}>
              <LedgerTable />
            </DashboardItem>
          </DashboardLayout>
        </Tabs.Panel>

        <Tabs.Panel id="history">
          <WithdrawalsTable />
        </Tabs.Panel>

        <Tabs.Panel id="payoutMethods">
          <PayoutMethodsSection />
        </Tabs.Panel>
      </Tabs>

      <CreateWithdrawalModal isOpen={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen} />
    </>
  );
};
