'use client';

import '@/shared/api/instance';

import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, FieldError, Form, Input, Label, Modal, TextField } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

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
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[420px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{t('admin.users.adjustBalance.title')}</Modal.Heading>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Modal.Body className="flex flex-col gap-4">
                <Controller
                  control={control}
                  name="amount"
                  render={({ field }) => (
                    <TextField
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      isInvalid={!!errors.amount}
                      fullWidth
                    >
                      <Label>{t('admin.users.adjustBalance.amount')}</Label>
                      <Input placeholder={t('admin.users.adjustBalance.amountPlaceholder')} />
                      <FieldError>{errors.amount?.message}</FieldError>
                    </TextField>
                  )}
                />

                <Controller
                  control={control}
                  name="reason"
                  render={({ field }) => (
                    <TextField
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      isInvalid={!!errors.reason}
                      fullWidth
                    >
                      <Label>{t('admin.users.adjustBalance.reason')}</Label>
                      <Input placeholder={t('admin.users.adjustBalance.reasonPlaceholder')} />
                      <FieldError>{errors.reason?.message}</FieldError>
                    </TextField>
                  )}
                />

                {adjustBalance.isError && (
                  <Alert status="danger">
                    <Alert.Content>
                      <Alert.Description>
                        {getAdminErrorMessage(adjustBalance.error) ??
                          t('admin.users.errors.adjustFailed')}
                      </Alert.Description>
                    </Alert.Content>
                  </Alert>
                )}
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
