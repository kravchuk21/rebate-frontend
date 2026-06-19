'use client';

import { Switch } from '@heroui/react';
import { useTranslations } from 'next-intl';

import type { TrendChartType } from '@/shared/components/charts';

interface RebateChartTypeSwitchProps {
  value: TrendChartType;
  onChange: (value: TrendChartType) => void;
}

export const RebateChartTypeSwitch = ({ value, onChange }: RebateChartTypeSwitchProps) => {
  const t = useTranslations('rebate.stats');

  return (
    <Switch
      isSelected={value === 'bar'}
      onChange={(isSelected) => onChange(isSelected ? 'bar' : 'line')}
    >
      <Switch.Content>
        {t(value === 'bar' ? 'chartType.bar' : 'chartType.line')}
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Content>
    </Switch>
  );
};
