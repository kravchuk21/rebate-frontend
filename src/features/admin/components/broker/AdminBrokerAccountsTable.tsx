'use client';

import '@/shared/api/instance';

import { useEffect, useMemo, useState } from 'react';
import { Button, Tabs, toast } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import type { BrokerAccountDetailResponse } from '@/shared/api/generated/types.gen';
import { AccountStatusChip } from '@/features/broker/components/AccountStatusChip';
import { DataTable } from '@/shared/components/DataTable';

import { getAdminErrorMessage } from '../../lib/getAdminErrorMessage';
import { useAdminApproveBrokerAccount } from '../../hooks/useAdminApproveBrokerAccount';
import { useAdminBrokerAccounts } from '../../hooks/useAdminBrokerAccounts';
import { useAdminRejectBrokerAccount } from '../../hooks/useAdminRejectBrokerAccount';
import { useAdminRevokeBrokerAccount } from '../../hooks/useAdminRevokeBrokerAccount';
import { RejectReasonModal } from './RejectReasonModal';

const LIMIT = 20;

const columnHelper = createColumnHelper<BrokerAccountDetailResponse>();

export const AdminBrokerAccountsTable = () => {
  const t = useTranslations('admin.brokerAccounts');
  const locale = useLocale();
  const [status, setStatus] = useState<'pending' | 'all'>('pending');
  const [offset, setOffset] = useState(0);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);

  const { data, isError } = useAdminBrokerAccounts({
    status: status === 'pending' ? 'pending' : undefined,
    limit: LIMIT,
    offset,
  });

  useEffect(() => {
    if (isError) toast.danger(t('errors.loadFailed'));
  }, [isError, t]);

  const approveAccount = useAdminApproveBrokerAccount();
  const rejectAccount = useAdminRejectBrokerAccount();
  const revokeAccount = useAdminRevokeBrokerAccount();

  const responseData = data?.data as
    | { items?: BrokerAccountDetailResponse[]; total_count?: number }
    | undefined;
  const accounts = responseData?.items ?? [];
  const totalCount = responseData?.total_count ?? 0;

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }),
    [locale],
  );

  const handleTabChange = (key: string) => {
    setStatus(key === 'all' ? 'all' : 'pending');
    setOffset(0);
  };

  const handleApprove = (accountID: string) => {
    approveAccount.mutate({ path: { accountID } });
  };

  const handleReject = (reason: string) => {
    if (!rejectTarget) return;
    rejectAccount.mutate(
      { path: { accountID: rejectTarget }, body: { reason } },
      { onSuccess: () => setRejectTarget(null) },
    );
  };

  const handleRevoke = (reason: string) => {
    if (!revokeTarget) return;
    revokeAccount.mutate(
      { path: { accountID: revokeTarget }, body: { reason } },
      { onSuccess: () => setRevokeTarget(null) },
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'broker',
        header: t('columns.broker'),
        cell: ({ row }) => row.original.broker?.name ?? '—',
      }),
      columnHelper.accessor('uid', {
        header: t('columns.uid'),
        cell: (info) => info.getValue() ?? '—',
      }),
      columnHelper.accessor('status', {
        header: t('columns.status'),
        cell: (info) => <AccountStatusChip status={info.getValue() ?? ''} />,
      }),
      columnHelper.accessor('created_at', {
        header: t('columns.submittedAt'),
        cell: (info) => {
          const v = info.getValue();
          return v ? dateFormatter.format(new Date(v)) : '—';
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: t('columns.actions'),
        cell: ({ row }) => {
          const account = row.original;
          return (
            <div className="flex flex-wrap gap-2">
              {account.status === 'pending' && (
                <>
                  <Button
                    variant="tertiary"
                    size="sm"
                    onPress={() => account.id && handleApprove(account.id)}
                  >
                    {t('actions.approve')}
                  </Button>
                  <Button
                    variant="tertiary"
                    size="sm"
                    onPress={() => setRejectTarget(account.id ?? null)}
                  >
                    {t('actions.reject')}
                  </Button>
                </>
              )}
              {account.status === 'approved' && (
                <Button
                  variant="tertiary"
                  size="sm"
                  onPress={() => setRevokeTarget(account.id ?? null)}
                >
                  {t('actions.revoke')}
                </Button>
              )}
            </div>
          );
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, dateFormatter],
  );

  const table = useReactTable({
    data: accounts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row, index) => row.id ?? String(index),
  });

  return (
    <div className="flex flex-col gap-4">
      <Tabs selectedKey='all' onSelectionChange={(key) => handleTabChange(String(key))}>
        <Tabs.ListContainer>
          <Tabs.List>
            <Tabs.Tab id="pending">
              {t('tabs.pending')}
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="all">
              {t('tabs.all')}
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>

      {!isError && (
        <DataTable
          table={table}
          ariaLabel={t('title')}
          emptyLabel={t('emptyDesc')}
          rowHeaderColumnId="broker"
          pagination={{ offset, limit: LIMIT, totalCount, onOffsetChange: setOffset }}
        />
      )}

      <RejectReasonModal
        type="reject"
        isOpen={rejectTarget !== null}
        isPending={rejectAccount.isPending}
        error={rejectAccount.error}
        errorMessage={getAdminErrorMessage(rejectAccount.error) ?? t('errors.rejectFailed')}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        onSubmit={handleReject}
      />

      <RejectReasonModal
        type="revoke"
        isOpen={revokeTarget !== null}
        isPending={revokeAccount.isPending}
        error={revokeAccount.error}
        errorMessage={getAdminErrorMessage(revokeAccount.error) ?? t('errors.revokeFailed')}
        onOpenChange={(open) => !open && setRevokeTarget(null)}
        onSubmit={handleRevoke}
      />
    </div>
  );
};
