'use client';

import { Chip } from '@heroui/react';

const colorMap: Record<string, 'success' | 'danger' | 'default'> = {
  active: 'success',
  suspended: 'danger',
};

interface UserStatusChipProps {
  status: string;
}

export const UserStatusChip = ({ status }: UserStatusChipProps) => (
  <Chip color={colorMap[status] ?? 'default'}>{status}</Chip>
);
