'use client';

import '@/shared/api/instance';

import type { SortDescriptor } from '@heroui/react';
import type { SortingState } from '@tanstack/react-table';

import { useEffect, useMemo, useState } from 'react';
import { AlertDialog, Button, SearchField, toast, ButtonGroup } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { CirclePause } from '@gravity-ui/icons';
import { CirclePlay } from '@gravity-ui/icons';
import { Pencil } from '@gravity-ui/icons';
import { Persons } from '@gravity-ui/icons';

import type { AdminUserResponse } from '@/shared/api/generated/types.gen';

import { DataTable } from '@/shared/components/DataTable';
import { getAdminErrorMessage } from '../../lib/getAdminErrorMessage';
import { useAdminSuspendUser } from '../../hooks/useAdminSuspendUser';
import { useAdminUnsuspendUser } from '../../hooks/useAdminUnsuspendUser';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import { AdjustBalanceModal } from './AdjustBalanceModal';
import { ChangeReferrerModal } from './ChangeReferrerModal';
import { UserStatusChip } from './UserStatusChip';
import { DashboardLayout, DashboardItem } from '@/shared/components/layout';

const LIMIT = 10;

function toSortDescriptor(sorting: SortingState): SortDescriptor | undefined {
  const first = sorting[0];
  if (!first) return undefined;
  return { column: first.id, direction: first.desc ? 'descending' : 'ascending' };
}

function toSortingState(descriptor: SortDescriptor): SortingState {
  return [{ id: descriptor.column as string, desc: descriptor.direction === 'descending' }];
}

const columnHelper = createColumnHelper<AdminUserResponse>();

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
  // Stable reference: React Aria's controlled-sort Table re-commits its collection
  // whenever `items` identity changes. A fresh `?? []` every render makes the
  // collection never settle (matches the other admin tables).
  const users = useMemo(() => responseData?.items ?? [], [responseData]);
  const totalCount = responseData?.total_count ?? 0;

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }),
    [locale],
  );

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
            <ButtonGroup size='sm' variant='tertiary'>
              {user.status === 'suspended' ? (
                <Button onPress={() => user.id && unsuspendUser.mutate({ path: { userID: user.id } })}>
                  <CirclePause />
                </Button>
              ) : (
                <Button onPress={() => setSuspendTarget(user.id ?? null)}>
                  <CirclePlay />
                </Button>
              )}
              <Button onPress={() => setAdjustBalanceTarget(user.id ?? null)}>
                <ButtonGroup.Separator />
                <Pencil />
              </Button>
              <Button onPress={() => setReferrerTarget(user)}>
                <ButtonGroup.Separator />
                <Persons />
              </Button>
            </ButtonGroup>

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
    getRowId: (row, index) => row.id ?? String(index),
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
    <DashboardLayout>
      <DashboardItem>
        <SearchField variant='secondary' value={search} onChange={setSearch} aria-label={t('search')}>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder={t('search')} />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
      </DashboardItem>

      <DashboardItem>
        <DataTable
          table={table}
          ariaLabel={t('title')}
          emptyLabel={t('emptyDesc')}
          rowHeaderColumnId="email"
          sortDescriptor={sortDescriptor}
          onSortChange={(d) => setSorting(toSortingState(d))}
          pagination={{ offset, limit: LIMIT, totalCount, onOffsetChange: setOffset }}
        />
      </DashboardItem>

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
    </DashboardLayout>
  );
};
