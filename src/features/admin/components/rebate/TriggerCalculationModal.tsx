"use client";

import "@/shared/api/instance";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Modal, toast } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { BaseModal } from "@/shared/components/BaseModal";
import { FormField } from "@/shared/components/FormField";
import { useModal } from "@/shared/hooks/useModal";
import { Modals } from "@/shared/lib/routes";

import { getAdminErrorMessage } from "../../lib/getAdminErrorMessage";
import { useAdminTriggerCalculation } from "../../hooks/useAdminTriggerCalculation";
import {
  triggerCalculationSchema,
  type TriggerCalculationFormValues,
} from "../../schemas/triggerCalculationSchema";

export const TriggerCalculationModal = () => {
  const t = useTranslations();
  const { isOpen, close } = useModal(Modals.TriggerCalculation);
  const triggerCalculation = useAdminTriggerCalculation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TriggerCalculationFormValues>({
    resolver: zodResolver(triggerCalculationSchema),
    defaultValues: { broker_account_id: "", date: "" },
  });

  const onSubmit = (data: TriggerCalculationFormValues) => {
    triggerCalculation.mutate(
      { body: data },
      {
        onSuccess: () => {
          reset();
          close();
        },
        onError: (error) => {
          toast.danger(getAdminErrorMessage(error) ?? t("admin.rebate.errors.triggerFailed"));
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      triggerCalculation.reset();
      close();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Header>
        <Modal.Heading>{t("admin.rebate.trigger.title")}</Modal.Heading>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body className="flex flex-col gap-4">
          <FormField
            control={control}
            name="broker_account_id"
            label={t("admin.rebate.trigger.brokerAccount")}
            error={errors.broker_account_id?.message}
          />

          <FormField
            control={control}
            name="date"
            label={t("admin.rebate.trigger.date")}
            error={errors.date?.message}
            inputProps={{ type: "date" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="tertiary" slot="close">
            {t("admin.brokerAccounts.reject.cancel")}
          </Button>
          <Button type="submit" variant="primary" isDisabled={triggerCalculation.isPending}>
            {t("admin.rebate.trigger.submit")}
          </Button>
        </Modal.Footer>
      </Form>
    </BaseModal>
  );
};
