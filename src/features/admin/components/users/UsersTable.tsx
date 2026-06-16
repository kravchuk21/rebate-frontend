'use client';

import '@/shared/api/instance';

import type { SortDescriptor } from '@heroui/react';
import type { SortingState } from '@tanstack/react-table';

import { useEffect, useMemo, useState } from 'react';
import { AlertDialog, Alert, Button, Card, Input, Skeleton, Table, toast } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import type { AdminUserResponse } from '@/shared/api/generated/types.gen';

import { TableEmptyState } from '@/shared/components/TableEmptyState';
import { TablePagination } from '@/shared/components/TablePagination';
import { getAdminErrorMessage } from '../../lib/getAdminErrorMessage';
import { useAdminSuspendUser } from '../../hooks/useAdminSuspendUser';
import { useAdminUnsuspendUser } from '../../hooks/useAdminUnsuspendUser';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import { AdjustBalanceModal } from './AdjustBalanceModal';
import { ChangeReferrerModal } from './ChangeReferrerModal';
import { UserStatusChip } from './UserStatusChip';

const LIMIT = 20;

function toSortDescriptor(sorting: SortingState): SortDescriptor | undefined {
  const first = sorting[0];
  if (!first) return undefined;
  return { column: first.id, direction: first.desc ? 'descending' : 'ascending' };
}

function toSortingState(descriptor: SortDescriptor): SortingState {
  return [{ id: descriptor.column as string, desc: descriptor.direction === 'descending' }];
}

export const UsersTable = () => {
  const t = useTranslations('admin.users');
  const locale = useLocale();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [suspendTarget, setSuspendTarget] = useState<string | null>(null);
  const [adjustBalanceTarget, setAdjustBalanceTarget] = useState<string | null>(null);
  const [referrerTarget, setReferrerTarget] = useState<AdminUserResponse | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setOffset(0);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const { data, isLoading, isError } = useAdminUsers({
    search: debouncedSearch || undefined,
    limit: LIMIT,
    offset,
  });

  useEffect(() => {
    if (isError) toast.danger(t('errors.loadFailed'));
  }, [isError, t]);

  const suspendUser = useAdminSuspendUser();
  const unsuspendUser = useAdminUnsuspendUser();

  const responseData = data?.data as ({ items?: AdminUserResponse[]; total_count?: number } | undefined);
  const users = responseData?.items ?? [];
  const totalCount = responseData?.total_count ?? 0;

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }),
    [locale],
  );

  const columnHelper = createColumnHelper<AdminUserResponse>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('email', {
        header: t('columns.email'),
        enableSorting: true,
      }),
      columnHelper.accessor('role', {
        header: t('columns.role'),
        enableSorting: true,
      }),
      columnHelper.accessor('status', {
        header: t('columns.status'),
        cell: (info) => <UserStatusChip status={info.getValue() ?? ''} />,
        enableSorting: false,
      }),
      columnHelper.accessor('two_fa_enabled', {
        header: t('columns.twoFa'),
        cell: (info) => (info.getValue() ? 'Yes' : 'No'),
        enableSorting: false,
      }),
      columnHelper.accessor('created_at', {
        header: t('columns.createdAt'),
        cell: (info) => {
          const v = info.getValue();
          return v ? dateFormatter.format(new Date(v)) : '—';
        },
        enableSorting: true,
      }),
      columnHelper.display({
        id: 'actions',
        header: t('columns.actions'),
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex flex-wrap gap-2">
              {user.status === 'suspended' ? (
                <Button
                  variant="tertiary"
                  size="sm"
                  onPress={() => user.id && unsuspendUser.mutate({ path: { userID: user.id } })}
                >
                  {t('actions.unsuspend')}
                </Button>
              ) : (
                <Button
                  variant="tertiary"
                  size="sm"
                  onPress={() => setSuspendTarget(user.id ?? null)}
                >
                  {t('actions.suspend')}
                </Button>
              )}
              <Button
                variant="tertiary"
                size="sm"
                onPress={() => setAdjustBalanceTarget(user.id ?? null)}
              >
                {t('actions.adjustBalance')}
              </Button>
              <Button
                variant="tertiary"
                size="sm"
                onPress={() => setReferrerTarget(user)}
              >
                {t('actions.changeReferrer')}
              </Button>
            </div>
          );
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, dateFormatter],
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    onSortingChange: setSorting,
    state: { sorting },
  });

  const sortDescriptor = useMemo(() => toSortDescriptor(sorting), [sorting]);

  const handleSuspend = (userID: string) => {
    suspendUser.mutate(
      { path: { userID } },
      {
        onSuccess: () => setSuspendTarget(null),
        onError: (error) => toast.danger(getAdminErrorMessage(error) ?? t('errors.suspendFailed')),
      },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t('search')}
        className="max-w-sm"
      />

      {isLoading && (
        <Card>
          <Card.Content className="flex flex-col gap-3 py-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </Card.Content>
        </Card>
      )}

      {!isLoading && !isError && (
        <Table>
          <Table.ScrollContainer>
            <Table.Content
              aria-label={t('title')}
              sortDescriptor={sortDescriptor}
              onSortChange={(d) => setSorting(toSortingState(d))}
            >
              <Table.Header>
                {table.getHeaderGroups()[0]!.headers.map((header) => (
                  <Table.Column
                    key={header.id}
                    id={header.id}
                    allowsSorting={header.column.getCanSort()}
                    isRowHeader={header.id === 'email'}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Table.Column>
                ))}
              </Table.Header>
              <Table.Body
                renderEmptyState={() => <TableEmptyState label={t('emptyDesc')} />}
              >
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
      )}

      <AlertDialog
        isOpen={suspendTarget !== null}
        onOpenChange={(open) => !open && setSuspendTarget(null)}
      >
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Heading>{t('suspend.confirmTitle')}</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <p>{t('suspend.confirmDesc')}</p>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button variant="tertiary" slot="close">
                  {t('suspend.cancel')}
                </Button>
                <Button
                  variant="primary"
                  onPress={() => suspendTarget && handleSuspend(suspendTarget)}
                  isDisabled={suspendUser.isPending}
                >
                  {t('suspend.confirm')}
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>

      <AdjustBalanceModal
        userID={adjustBalanceTarget}
        onOpenChange={(open) => !open && setAdjustBalanceTarget(null)}
      />
      <ChangeReferrerModal
        user={referrerTarget}
        onOpenChange={(open) => !open && setReferrerTarget(null)}
      />
    </div>
  );
};
