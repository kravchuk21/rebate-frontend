'use client';

import '@/shared/api/instance';

import { useEffect, useState } from 'react';
import { Button, Card, Input, Skeleton, toast } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { DashboardLayout, DashboardItem } from '@/shared/components/layout';

import { useAdminConfig } from '../../hooks/useAdminConfig';
import { useAdminSetConfig } from '../../hooks/useAdminSetConfig';

const CONFIG_KEYS = [
  'our_fee_rate',
  'referral_rate',
  'min_withdrawal_amount',
  'network_fee_TRC20',
  'network_fee_ERC20',
  'network_fee_BEP20',
  'network_fee_SOL',
] as const;

type ConfigKey = (typeof CONFIG_KEYS)[number];

const ConfigRow = ({ configKey, value }: { configKey: ConfigKey; value: string }) => {
  const t = useTranslations('admin.config');
  const setConfig = useAdminSetConfig();
  const [inputValue, setInputValue] = useState(value);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (!showSaved) return;

    const timeout = setTimeout(() => setShowSaved(false), 2000);
    return () => clearTimeout(timeout);
  }, [showSaved]);

  const handleSave = () => {
    setConfig.mutate(
      { path: { key: configKey }, body: { value: inputValue } },
      {
        onSuccess: () => setShowSaved(true),
      },
    );
  };

  return (
    <Card>
      <Card.Content className="flex flex-col gap-3 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-1 flex-col gap-1">
          <p className="font-medium">{t(`labels.${configKey}`)}</p>
          <Input value={inputValue} onChange={(event) => setInputValue(event.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          {showSaved && <span className="text-sm text-success">{t('saved')}</span>}
          {setConfig.isError && <span className="text-sm text-danger">{t('saveFailed')}</span>}
          <Button variant="primary" onPress={handleSave} isDisabled={setConfig.isPending}>
            {t('save')}
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};

export const ConfigEditor = () => {
  const t = useTranslations('admin.config');
  const { data, isLoading, isError } = useAdminConfig();

  useEffect(() => {
    if (isError) toast.danger(t('errors.loadFailed'));
  }, [isError, t]);

  const values = (data?.data as Record<string, string> | undefined) ?? {};

  if (isLoading) {
    return (
      <DashboardLayout>
        {CONFIG_KEYS.map((key) => (
          <DashboardItem key={key} span={12}>
            <Skeleton className="h-20 w-full" />
          </DashboardItem>
        ))}
      </DashboardLayout>
    );
  }

  if (isError) return null;

  return (
    <DashboardLayout>
      {CONFIG_KEYS.map((key) => (
        <DashboardItem key={key} span={12}>
          <ConfigRow configKey={key} value={values[key] ?? ''} />
        </DashboardItem>
      ))}
    </DashboardLayout>
  );
};
