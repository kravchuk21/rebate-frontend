'use client';

import '@/shared/api/instance';
import {Copy, TrashBin} from '@gravity-ui/icons';

import { useEffect, useState } from 'react';
import { AlertDialog, Button, Card, Skeleton, Table, toast, Typography } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { getErrorMessage } from '@/features/auth/lib/getErrorMessage';
import type { WithdrawalPayoutMethodResponse } from '@/shared/api/generated/types.gen';
import { TableEmptyState } from '@/shared/components/TableEmptyState';

import { useDeletePayoutMethod } from '../hooks/useDeletePayoutMethod';
import { usePayoutMethods } from '../hooks/usePayoutMethods';
import { truncateAddress } from '../lib/validateAddress';
import { AddPayoutMethodModal } from './AddPayoutMethodModal';

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

export const PayoutMethodsSection = () => {
  const t = useTranslations('withdrawal.payoutMethods');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, isError } = usePayoutMethods();

  const methods = (data?.data as WithdrawalPayoutMethodResponse[] | undefined) ?? [];

  useEffect(() => {
    if (isError) toast.danger(t('errors.loadFailed'));
  }, [isError, t]);

  const handleCopy = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success(t('copied'));
    } catch {
      toast.danger(t('errors.copyFailed'));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Typography.Heading className="text-lg">{t('title')}</Typography.Heading>
        <Button onPress={() => setIsModalOpen(true)}>{t('add')}</Button>
      </div>

      {isLoading && (
        <Card>
          <Card.Content className="flex flex-col gap-3 py-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </Card.Content>
        </Card>
      )}

      {!isLoading && !isError && (
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label={t('title')}>
              <Table.Header>
                <Table.Column isRowHeader>{t('columns.name')}</Table.Column>
                <Table.Column>{t('columns.network')}</Table.Column>
                <Table.Column>{t('columns.address')}</Table.Column>
                <Table.Column className='text-right'>{t('columns.actions')}</Table.Column>
              </Table.Header>
              <Table.Body
                renderEmptyState={() => <TableEmptyState label={t('emptyDesc')} />}
              >
                {methods.map((method) => (
                  <Table.Row key={method.id}>
                    <Table.Cell className='truncate'>{method.name}</Table.Cell>
                    <Table.Cell>{method.network}</Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        {method.address ? truncateAddress(method.address) : '—'}
                        {method.address && (
                          <Button isIconOnly size="sm" variant="ghost" onClick={() => handleCopy(method.address!)}>
                            <Copy />
                          </Button>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell className='text-right'>
                      <RowActions method={method} />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      )}

      <AddPayoutMethodModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};
