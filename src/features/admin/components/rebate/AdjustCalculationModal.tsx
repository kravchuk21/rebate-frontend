"use client";

import "@/shared/api/instance";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Modal, toast } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { formatAmount } from "@/features/withdrawal/lib/formatAmount";
import { BaseModal } from "@/shared/components/BaseModal";
import { FormField } from "@/shared/components/FormField";
import { useModal } from "@/shared/hooks/useModal";
import { Modals } from "@/shared/lib/routes";

import { getAdminErrorMessage } from "../../lib/getAdminErrorMessage";
import { useAdminAdjustCalculation } from "../../hooks/useAdminAdjustCalculation";
import {
  createAdjustCalculationSchema,
  type AdjustCalculationFormValues,
} from "../../schemas/adjustCalculationSchema";

export const AdjustCalculationModal = () => {
  const t = useTranslations();
  const { isOpen, close, param } = useModal(Modals.AdjustCalculation);
  const calculationID = param("calculationID");
  const grossParam = param("gross");
  const adjustCalculation = useAdminAdjustCalculation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdjustCalculationFormValues>({
    resolver: zodResolver(createAdjustCalculationSchema(t)),
    defaultValues: { new_gross_rebate: "", reason: "" },
  });

  const onSubmit = (data: AdjustCalculationFormValues) => {
    if (!calculationID) return;

    adjustCalculation.mutate(
      { path: { calculationID }, body: data },
      {
        onSuccess: () => {
          reset();
          close();
        },
        onError: (error) => {
          toast.danger(getAdminErrorMessage(error) ?? t("admin.rebate.errors.adjustFailed"));
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      adjustCalculation.reset();
      close();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Header>
        <Modal.Heading>{t("admin.rebate.adjust.title")}</Modal.Heading>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body className="flex flex-col gap-4">
          <p className="text-muted text-sm">
            {t("admin.rebate.columns.grossRebate")}:{" "}
            {formatAmount(grossParam ? Number(grossParam) : undefined)}
          </p>

          <FormField
            control={control}
            name="new_gross_rebate"
            label={t("admin.rebate.adjust.newGrossRebate")}
            error={errors.new_gross_rebate?.message}
          />

          <FormField
            control={control}
            name="reason"
            label={t("admin.rebate.adjust.reason")}
            placeholder={t("admin.rebate.adjust.reasonPlaceholder")}
            error={errors.reason?.message}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="tertiary" slot="close">
            {t("admin.brokerAccounts.reject.cancel")}
          </Button>
          <Button type="submit" variant="primary" isDisabled={adjustCalculation.isPending}>
            {t("admin.rebate.adjust.submit")}
          </Button>
        </Modal.Footer>
      </Form>
    </BaseModal>
  );
};
