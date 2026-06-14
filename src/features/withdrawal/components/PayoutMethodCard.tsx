'use client';

import '@/shared/api/instance';

import { useState } from 'react';
import { AlertDialog, Alert, Button, Card, Chip } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { getErrorMessage } from '@/features/auth/lib/getErrorMessage';
import type { WithdrawalPayoutMethodResponse } from '@/shared/api/generated/types.gen';

import { useDeletePayoutMethod } from '../hooks/useDeletePayoutMethod';
import { useUpdatePayoutMethod } from '../hooks/useUpdatePayoutMethod';
import { truncateAddress } from '../lib/validateAddress';

interface PayoutMethodCardProps {
  method: WithdrawalPayoutMethodResponse;
}

export const PayoutMethodCard = ({ method }: PayoutMethodCardProps) => {
  const t = useTranslations('withdrawal.payoutMethods');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const updatePayoutMethod = useUpdatePayoutMethod();
  const deletePayoutMethod = useDeletePayoutMethod();

  const handleSetDefault = () => {
    if (!method.id) return;
    updatePayoutMethod.mutate({ path: { methodID: method.id }, body: { is_default: true } });
  };

  const handleDelete = () => {
    if (!method.id) return;
    deletePayoutMethod.mutate(
      { path: { methodID: method.id } },
      {
        onSuccess: () => setIsDeleteOpen(false),
      },
    );
  };

  return (
    <Card>
      <Card.Header className="flex items-start justify-between gap-2">
        <Card.Title>{method.name}</Card.Title>
        {method.is_default && <Chip color="accent">{t('default')}</Chip>}
      </Card.Header>
      <Card.Content className="flex flex-col gap-2">
        <Chip color="default" size="sm" className="w-fit">
          {method.network}
        </Chip>
        <span className="font-mono text-sm text-muted" title={method.address}>
          {method.address ? truncateAddress(method.address) : '—'}
        </span>
      </Card.Content>
      <Card.Footer className="flex justify-end gap-2">
        {!method.is_default && (
          <Button
            variant="tertiary"
            size="sm"
            onPress={handleSetDefault}
            isDisabled={updatePayoutMethod.isPending}
          >
            {t('setDefault')}
          </Button>
        )}
        <AlertDialog isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialog.Trigger>
            <Button variant="tertiary" size="sm" onPress={() => setIsDeleteOpen(true)}>
              {t('delete')}
            </Button>
          </AlertDialog.Trigger>
          <AlertDialog.Backdrop>
            <AlertDialog.Container>
              <AlertDialog.Dialog>
                <AlertDialog.Header>
                  <AlertDialog.Heading>{t('deleteConfirm')}</AlertDialog.Heading>
                </AlertDialog.Header>
                <AlertDialog.Body className="flex flex-col gap-3">
                  <p className="text-muted">{t('deleteConfirmDesc')}</p>
                  {deletePayoutMethod.isError && (
                    <Alert status="danger">
                      <Alert.Content>
                        <Alert.Description>
                          {getErrorMessage(deletePayoutMethod.error) ?? t('errors.deleteFailed')}
                        </Alert.Description>
                      </Alert.Content>
                    </Alert>
                  )}
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
      </Card.Footer>
    </Card>
  );
};
