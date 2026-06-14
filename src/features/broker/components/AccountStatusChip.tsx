'use client';

import { Chip } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { getStatusColor } from '../lib/getStatusColor';

interface AccountStatusChipProps {
  status: string;
}

export const AccountStatusChip = ({ status }: AccountStatusChipProps) => {
  const t = useTranslations('accounts.status');

  const label = ['pending', 'approved', 'rejected', 'revoked'].includes(status)
    ? t(status as 'pending' | 'approved' | 'rejected' | 'revoked')
    : status;

  return <Chip color={getStatusColor(status)}>{label}</Chip>;
};
