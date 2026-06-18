'use client';

import '@/shared/api/instance';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Modal, toast } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import type { RebateCalculationResponse } from '@/shared/api/generated/types.gen';
import { formatAmount } from '@/features/withdrawal/lib/formatAmount';
import { FormField } from '@/shared/components/FormField';

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
        onError: (error) => {
          toast.danger(getAdminErrorMessage(error) ?? t('admin.rebate.errors.adjustFailed'));
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
        <Modal.Container scroll='outside'>
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

                <FormField
                  control={control}
                  name="new_gross_rebate"
                  label={t('admin.rebate.adjust.newGrossRebate')}
                  error={errors.new_gross_rebate?.message}
                />

                <FormField
                  control={control}
                  name="reason"
                  label={t('admin.rebate.adjust.reason')}
                  placeholder={t('admin.rebate.adjust.reasonPlaceholder')}
                  error={errors.reason?.message}
                />
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
