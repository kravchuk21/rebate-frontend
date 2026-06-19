'use client';

import '@/shared/api/instance';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Modal, toast } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { BaseModal } from '@/shared/components/BaseModal';
import { FormField } from '@/shared/components/FormField';
import { useModal } from '@/shared/hooks/useModal';
import { Modals } from '@/shared/lib/routes';

import { getAdminErrorMessage } from '../../lib/getAdminErrorMessage';
import { useAdminAdjustBalance } from '../../hooks/useAdminAdjustBalance';
import {
  createAdjustBalanceSchema,
  type AdjustBalanceFormValues,
} from '../../schemas/adjustBalanceSchema';

export const AdjustBalanceModal = () => {
  const t = useTranslations();
  const { isOpen, close, param } = useModal(Modals.AdjustBalance);
  const userID = param('userID');
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
          close();
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
      close();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onOpenChange={handleOpenChange}>
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
    </BaseModal>
  );
};
