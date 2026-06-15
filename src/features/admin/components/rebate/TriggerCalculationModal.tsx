'use client';

import '@/shared/api/instance';

import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, FieldError, Form, Input, Label, Modal, TextField } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

import { getAdminErrorMessage } from '../../lib/getAdminErrorMessage';
import { useAdminTriggerCalculation } from '../../hooks/useAdminTriggerCalculation';
import {
  triggerCalculationSchema,
  type TriggerCalculationFormValues,
} from '../../schemas/triggerCalculationSchema';

interface TriggerCalculationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const TriggerCalculationModal = ({ isOpen, onOpenChange }: TriggerCalculationModalProps) => {
  const t = useTranslations();
  const triggerCalculation = useAdminTriggerCalculation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TriggerCalculationFormValues>({
    resolver: zodResolver(triggerCalculationSchema),
    defaultValues: { broker_account_id: '', date: '' },
  });

  const onSubmit = (data: TriggerCalculationFormValues) => {
    triggerCalculation.mutate(
      { body: data },
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
      triggerCalculation.reset();
    }
    onOpenChange(open);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[420px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{t('admin.rebate.trigger.title')}</Modal.Heading>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Modal.Body className="flex flex-col gap-4">
                <Controller
                  control={control}
                  name="broker_account_id"
                  render={({ field }) => (
                    <TextField
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      isInvalid={!!errors.broker_account_id}
                      fullWidth
                    >
                      <Label>{t('admin.rebate.trigger.brokerAccount')}</Label>
                      <Input />
                      <FieldError>{errors.broker_account_id?.message}</FieldError>
                    </TextField>
                  )}
                />

                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <TextField
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      isInvalid={!!errors.date}
                      fullWidth
                    >
                      <Label>{t('admin.rebate.trigger.date')}</Label>
                      <Input type="date" />
                      <FieldError>{errors.date?.message}</FieldError>
                    </TextField>
                  )}
                />

                {triggerCalculation.isError && (
                  <Alert status="danger">
                    <Alert.Content>
                      <Alert.Description>
                        {getAdminErrorMessage(triggerCalculation.error) ??
                          t('admin.rebate.errors.triggerFailed')}
                      </Alert.Description>
                    </Alert.Content>
                  </Alert>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="tertiary" slot="close">
                  {t('admin.brokerAccounts.reject.cancel')}
                </Button>
                <Button type="submit" variant="primary" isDisabled={triggerCalculation.isPending}>
                  {t('admin.rebate.trigger.submit')}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
