'use client';

import '@/shared/api/instance';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Modal, toast } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { FormField } from '@/shared/components/FormField';

import { getAdminErrorMessage } from '../../lib/getAdminErrorMessage';
import { useAdminAdjustBalance } from '../../hooks/useAdminAdjustBalance';
import {
  createAdjustBalanceSchema,
  type AdjustBalanceFormValues,
} from '../../schemas/adjustBalanceSchema';

interface AdjustBalanceModalProps {
  userID: string | null;
  onOpenChange: (isOpen: boolean) => void;
}

export const AdjustBalanceModal = ({ userID, onOpenChange }: AdjustBalanceModalProps) => {
  const t = useTranslations();
  const adjustBalance = useAdminAdjustBalance();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdjustBalanceFormValues>({
    resolver: zodResolver(createAdjustBalanceSchema(t)),
    defaultValues: { amount: '', reason: '' },
  });

  const onSubmit = (data: AdjustBalanceFormValues) => {
    if (!userID) return;

    adjustBalance.mutate(
      {
        path: { userID },
        body: { amount: parseFloat(data.amount), reason: data.reason },
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.danger(getAdminErrorMessage(error) ?? t('admin.users.errors.adjustFailed'));
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      adjustBalance.reset();
    }
    onOpenChange(open);
  };

  return (
    <Modal isOpen={userID !== null} onOpenChange={handleOpenChange}>
      <Modal.Backdrop>
        <Modal.Container scroll='outside'>
          <Modal.Dialog className="sm:max-w-[420px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{t('admin.users.adjustBalance.title')}</Modal.Heading>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Modal.Body className="flex flex-col gap-4">
                <FormField
                  control={control}
                  name="amount"
                  label={t('admin.users.adjustBalance.amount')}
                  placeholder={t('admin.users.adjustBalance.amountPlaceholder')}
                  error={errors.amount?.message}
                />

                <FormField
                  control={control}
                  name="reason"
                  label={t('admin.users.adjustBalance.reason')}
                  placeholder={t('admin.users.adjustBalance.reasonPlaceholder')}
                  error={errors.reason?.message}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="tertiary" slot="close">
                  {t('admin.brokerAccounts.reject.cancel')}
                </Button>
                <Button type="submit" variant="primary" isDisabled={adjustBalance.isPending}>
                  {t('admin.users.adjustBalance.submit')}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
