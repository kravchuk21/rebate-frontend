'use client';

import '@/shared/api/instance';

import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, FieldError, Form, Input, Label, Modal, TextField } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

import type { RebateCalculationResponse } from '@/shared/api/generated/types.gen';
import { formatAmount } from '@/features/withdrawal/lib/formatAmount';

import { getAdminErrorMessage } from '../../lib/getAdminErrorMessage';
import { useAdminAdjustCalculation } from '../../hooks/useAdminAdjustCalculation';
import {
  createAdjustCalculationSchema,
  type AdjustCalculationFormValues,
} from '../../schemas/adjustCalculationSchema';

interface AdjustCalculationModalProps {
  calculation: RebateCalculationResponse | null;
  onOpenChange: (isOpen: boolean) => void;
}

export const AdjustCalculationModal = ({ calculation, onOpenChange }: AdjustCalculationModalProps) => {
  const t = useTranslations();
  const adjustCalculation = useAdminAdjustCalculation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdjustCalculationFormValues>({
    resolver: zodResolver(createAdjustCalculationSchema(t)),
    defaultValues: { new_gross_rebate: '', reason: '' },
  });

  const onSubmit = (data: AdjustCalculationFormValues) => {
    if (!calculation?.id) return;

    adjustCalculation.mutate(
      { path: { calculationID: calculation.id }, body: data },
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
      adjustCalculation.reset();
    }
    onOpenChange(open);
  };

  return (
    <Modal isOpen={calculation !== null} onOpenChange={handleOpenChange}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[420px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{t('admin.rebate.adjust.title')}</Modal.Heading>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Modal.Body className="flex flex-col gap-4">
                <p className="text-sm text-muted">
                  {t('admin.rebate.columns.grossRebate')}: {formatAmount(calculation?.gross_rebate)}
                </p>

                <Controller
                  control={control}
                  name="new_gross_rebate"
                  render={({ field }) => (
                    <TextField
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      isInvalid={!!errors.new_gross_rebate}
                      fullWidth
                    >
                      <Label>{t('admin.rebate.adjust.newGrossRebate')}</Label>
                      <Input />
                      <FieldError>{errors.new_gross_rebate?.message}</FieldError>
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
                      <Label>{t('admin.rebate.adjust.reason')}</Label>
                      <Input placeholder={t('admin.rebate.adjust.reasonPlaceholder')} />
                      <FieldError>{errors.reason?.message}</FieldError>
                    </TextField>
                  )}
                />

                {adjustCalculation.isError && (
                  <Alert status="danger">
                    <Alert.Content>
                      <Alert.Description>
                        {getAdminErrorMessage(adjustCalculation.error) ??
                          t('admin.rebate.errors.adjustFailed')}
                      </Alert.Description>
                    </Alert.Content>
                  </Alert>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="tertiary" slot="close">
                  {t('admin.brokerAccounts.reject.cancel')}
                </Button>
                <Button type="submit" variant="primary" isDisabled={adjustCalculation.isPending}>
                  {t('admin.rebate.adjust.submit')}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
