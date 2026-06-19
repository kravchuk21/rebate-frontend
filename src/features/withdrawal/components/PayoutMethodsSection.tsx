'use client';

import '@/shared/api/instance';
import { Car, TrashBin } from '@gravity-ui/icons';

import { useEffect, useMemo, useState } from 'react';
import { AlertDialog, Button, Card, toast, Typography } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { getErrorMessage } from '@/features/auth/lib/getErrorMessage';
import type { WithdrawalPayoutMethodResponse } from '@/shared/api/generated/types.gen';
import { CopyButton } from '@/shared/components/CopyButton';
import { DataTable } from '@/shared/components/DataTable';
import { useModal } from '@/shared/hooks/useModal';
import { Modals } from '@/shared/lib/routes';

import { useDeletePayoutMethod } from '../hooks/useDeletePayoutMethod';
import { usePayoutMethods } from '../hooks/usePayoutMethods';
import { truncateAddress } from '../lib/validateAddress';
import { DashboardLayout, DashboardItem } from '@/shared/components/layout';

interface RowActionsProps {
  method: WithdrawalPayoutMethodResponse;
}

const RowActions = ({ method }: RowActionsProps) => {
  const t = useTranslations('withdrawal.payoutMethods');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const deletePayoutMethod = useDeletePayoutMethod();

  const handleDelete = () => {
    if (!method.id) return;
    deletePayoutMethod.mutate(
      { path: { methodID: method.id } },
      {
        onSuccess: () => setIsDeleteOpen(false),
        onError: (error) => {
          setIsDeleteOpen(false);
          toast.danger(getErrorMessage(error) ?? t('errors.deleteFailed'));
        },
      },
    );
  };

  return (
    <>
      <AlertDialog isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Heading>{t('deleteConfirm')}</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <Typography.Paragraph size='sm' color='muted'>{t('deleteConfirmDesc')}</Typography.Paragraph>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button variant="tertiary" slot="close">
                  {t('cancel')}
                </Button>
                <Button
                  variant="primary"
                  onPress={handleDelete}
                  isDisabled={deletePayoutMethod.isPending}
                >
                  {t('confirm')}
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
      <Button isIconOnly size="sm" variant="danger-soft" onPress={() => setIsDeleteOpen(true)} isDisabled={deletePayoutMethod.isPending}>
        <TrashBin />
      </Button>
    </>
  );
};

const LIMIT = 20;

const columnHelper = createColumnHelper<WithdrawalPayoutMethodResponse>();

export const PayoutMethodsSection = () => {
  const t = useTranslations('withdrawal.payoutMethods');
  const { open } = useModal(Modals.AddPayoutMethod);
  const [offset, setOffset] = useState(0);
  const { data, isError } = usePayoutMethods();

  const allMethods = data?.data as WithdrawalPayoutMethodResponse[] | undefined;
  // Memoize the page slice so `data` passed to react-table keeps a stable
  // reference between renders. An unstable array makes react-table produce new
  // row objects each render, which forces React Aria's collection (used by
  // DataTable) to rebuild on every commit and freezes the page.
  const methods = useMemo(() => allMethods?.slice(offset, offset + LIMIT) ?? [], [allMethods, offset]);
  const totalCount = allMethods?.length ?? 0;

  useEffect(() => {
    if (isError) toast.danger(t('errors.loadFailed'));
  }, [isError, t]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: t('columns.name'),
        cell: (info) => <span className="truncate">{info.getValue()}</span>,
      }),
      columnHelper.accessor('network', {
        header: t('columns.network'),
      }),
      columnHelper.accessor('address', {
        header: t('columns.address'),
        cell: (info) => {
          const address = info.getValue();
          return (
            <div className="flex items-center gap-2">
              {address ? truncateAddress(address) : '—'}
              {address && <CopyButton value={address} />}
            </div>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: t('columns.actions'),
        cell: ({ row }) => (
          <RowActions method={row.original} />
        ),
      }),
    ],
    [t],
  );

  const table = useReactTable({
    data: methods,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row, index) => row.id ?? String(index),
  });

  return (
    <DashboardLayout>
      <DashboardItem span={12}>
          <Card variant='transparent' className='p-0'>
            <Card.Header>
              <div className='flex items-center justify-between'>
                <Card.Title>{t('title')}</Card.Title>
                <Button onPress={() => open()}>{t('add')}</Button>
              </div>
            </Card.Header>
          </Card>
      </DashboardItem>

      {!isError && (
        <DashboardItem span={12}>
          <DataTable
            table={table}
            ariaLabel={t('title')}
            emptyLabel={t('emptyDesc')}
            rowHeaderColumnId="name"
            pagination={{ offset, limit: LIMIT, totalCount, onOffsetChange: setOffset }}
          />
        </DashboardItem>
      )}
    </DashboardLayout>
  );
};
