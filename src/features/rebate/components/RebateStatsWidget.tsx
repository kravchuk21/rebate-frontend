'use client';

import { useEffect, useState } from 'react';
import { Card, Label, ListBox, Select, Skeleton, toast, Typography, Switch } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';

import type { RebateStatsResponse } from '@/shared/api/generated/types.gen';
import { formatAmount } from '@/features/withdrawal/lib/formatAmount';
import { TrendChart, type TrendChartType } from '@/shared/components/charts';
import { DashboardLayout, DashboardItem } from '@/shared/components/layout';

import { useRebateStats } from '../hooks/useRebateStats';

type RangeMode = 'last_7_days' | 'last_30_days';

const RANGE_MODES: RangeMode[] = ['last_7_days', 'last_30_days'];

type SummaryField = 'all_time' | 'last_7_days' | 'today' | 'current_month' | 'last_month';

const SUMMARY_ROWS: { labelKey: string; field: SummaryField }[] = [
  { labelKey: 'allTime', field: 'all_time' },
  { labelKey: 'last7Days', field: 'last_7_days' },
  { labelKey: 'today', field: 'today' },
  { labelKey: 'currentMonth', field: 'current_month' },
  { labelKey: 'lastMonth', field: 'last_month' },
];

export const RebateStatsWidget = () => {
  const t = useTranslations('rebate.stats');
  const locale = useLocale();
  const [range, setRange] = useState<RangeMode>('last_7_days');
  const [chartType, setChartType] = useState<TrendChartType>('line');
  const { data, isLoading, isError } = useRebateStats();

  useEffect(() => {
    if (isError) toast.danger(t('errors.loadFailed'));
  }, [isError, t]);

  const stats = data?.data as RebateStatsResponse | undefined;
  const breakdown =
    (range === 'last_7_days' ? stats?.last_7_days_breakdown : stats?.last_30_days_breakdown) ?? [];

  const chartLabels = breakdown.map((day) =>
    day.date
      ? new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit' }).format(new Date(day.date))
      : '—',
  );
  const chartData = breakdown.map((day) => Number(day.amount ?? 0));
  const chartMax = Math.max(10, Math.ceil((Math.max(0, ...chartData) * 1.2) / 10) * 10);

  if (isError) return null;

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between gap-4">
          <Card.Title>{t('title')}</Card.Title>
          <Select
            variant="secondary"
            value={range}
            onChange={(key) => setRange(key as RangeMode)}
          >
            <Label className="sr-only">{t('rangeLabel')}</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {RANGE_MODES.map((mode) => (
                  <ListBox.Item key={mode} id={mode} textValue={t(`ranges.${mode}`)}>
                    {t(`ranges.${mode}`)}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </Card.Header>
      <Card.Content>
        <DashboardLayout>
          <DashboardItem>
            {SUMMARY_ROWS.map(({ labelKey, field }) => (
              <div key={field} className='flex justify-between'>
                <Typography.Paragraph className='flex-1' size="sm" color="muted">{t(`summary.${labelKey}`)}</Typography.Paragraph>
                <Typography.Paragraph className='flex-1 text-right' size='sm'>
                  {isLoading ? <Skeleton className="h-7 w-full" /> : `${formatAmount(stats?.[field])} USDT`}
                </Typography.Paragraph>
              </div>
            ))}
          </DashboardItem>
          <DashboardItem>
            <Switch
              isSelected={chartType === 'bar'}
              onChange={(isSelected) => setChartType(isSelected ? 'bar' : 'line')}
              className='items-end'
            >
              <Switch.Content>
                {t(chartType === 'bar' ? 'chartType.bar' : 'chartType.line')}
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
              </Switch.Content>
            </Switch>
          </DashboardItem>
          <DashboardItem>
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <TrendChart
                data={chartData}
                labels={chartLabels}
                max={chartMax}
                type={chartType}
                className="h-48 w-full"
              />
            )}
          </DashboardItem>
        </DashboardLayout>
      </Card.Content>
    </Card>
  );
};
