'use client';

import { useMemo, useState } from 'react';
import { Alert, Card, Chip, Skeleton, Table } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import type { ReferralEntryResponse } from '@/shared/api/generated/types.gen';
import { TableEmptyState } from '@/shared/components/TableEmptyState';
import { TablePagination } from '@/shared/components/TablePagination';
import { formatAmount } from '@/features/withdrawal/lib/formatAmount';

import { useMyReferrals } from '../hooks/useMyReferrals';

const LIMIT = 20;

const statusColorMap: Record<string, 'success' | 'danger' | 'default'> = {
  active: 'success',
  suspended: 'danger',
};

const columnHelper = createColumnHelper<ReferralEntryResponse>();

export const ReferralsTable = () => {
  const t = useTranslations('referrals.table');
  const locale = useLocale();
  const [offset, setOffset] = useState(0);
  const { data, isLoading, isError } = useMyReferrals(LIMIT, offset);

  const responseData = data?.data as ({ items?: ReferralEntryResponse[]; total_count?: number } | undefined);
  const items = responseData?.items ?? [];
  const totalCount = responseData?.total_count ?? 0;

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }),
    [locale],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('email', {
        header: t('columns.email'),
        cell: (info) => info.getValue() ?? '—',
      }),
      columnHelper.accessor('joined_at', {
        header: t('columns.joinedAt'),
        cell: (info) => {
          const v = info.getValue();
          return v ? dateFormatter.format(new Date(v)) : '—';
        },
      }),
      columnHelper.accessor('status', {
        header: t('columns.status'),
        cell: (info) => {
          const status = info.getValue();
          return (
            <Chip color={statusColorMap[status ?? ''] ?? 'default'}>
              {status ?? '—'}
            </Chip>
          );
        },
      }),
      columnHelper.accessor('total_earned', {
        header: t('columns.earned'),
        cell: (info) => `${formatAmount(info.getValue())} USDT`,
      }),
    ],
    [t, dateFormatter],
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isError) {
    return (
      <Alert status="danger">
        <Alert.Content>
          <Alert.Description>{t('errors.loadFailed')}</Alert.Description>
        </Alert.Content>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Card variant="secondary">
        <Card.Content className="flex flex-col gap-3 py-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </Card.Content>
      </Card>
    );
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label={t('title')}>
          <Table.Header>
            {table.getHeaderGroups()[0]!.headers.map((header) => (
              <Table.Column
                key={header.id}
                id={header.id}
                isRowHeader={header.id === 'email'}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </Table.Column>
            ))}
          </Table.Header>
          <Table.Body renderEmptyState={() => <TableEmptyState label={t('emptyDesc')} />}>
            {table.getRowModel().rows.map((row) => (
              <Table.Row key={row.id} id={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>

      <TablePagination
        offset={offset}
        limit={LIMIT}
        totalCount={totalCount}
        onOffsetChange={setOffset}
      />
    </Table>
  );
};
