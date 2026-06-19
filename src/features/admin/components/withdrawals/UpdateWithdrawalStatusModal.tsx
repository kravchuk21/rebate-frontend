"use client";

import "@/shared/api/instance";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FieldError, Form, Label, ListBox, Modal, Select, toast } from "@heroui/react";
import { useTranslations } from "next-intl";
import { Controller, useForm, useWatch } from "react-hook-form";

import { BaseModal } from "@/shared/components/BaseModal";
import { FormField } from "@/shared/components/FormField";
import { useModal } from "@/shared/hooks/useModal";
import { Modals } from "@/shared/lib/routes";

import { getAdminErrorMessage } from "../../lib/getAdminErrorMessage";
import { useAdminUpdateWithdrawalStatus } from "../../hooks/useAdminUpdateWithdrawalStatus";
import {
  createUpdateWithdrawalStatusSchema,
  type UpdateWithdrawalStatusFormValues,
} from "../../schemas/updateWithdrawalStatusSchema";

const statuses = ["processing", "completed", "rejected"] as const;

export const UpdateWithdrawalStatusModal = () => {
  const t = useTranslations();
  const { isOpen, close, param } = useModal(Modals.UpdateWithdrawalStatus);
  const withdrawalID = param("withdrawalID");
  const updateStatus = useAdminUpdateWithdrawalStatus();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateWithdrawalStatusFormValues>({
    resolver: zodResolver(createUpdateWithdrawalStatusSchema(t)),
    defaultValues: { status: "", tx_hash: "", reason: "", admin_note: "" },
  });

  const selectedStatus = useWatch({ control, name: "status" });

  const onSubmit = (data: UpdateWithdrawalStatusFormValues) => {
    if (!withdrawalID) return;

    updateStatus.mutate(
      {
        path: { withdrawalID },
        body: {
          status: data.status,
          tx_hash: data.tx_hash || undefined,
          reason: data.reason || undefined,
          admin_note: data.admin_note || undefined,
        },
      },
      {
        onSuccess: () => {
          reset();
          close();
        },
        onError: (error) => {
          toast.danger(getAdminErrorMessage(error) ?? t("admin.withdrawals.errors.updateFailed"));
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      updateStatus.reset();
      close();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Header>
        <Modal.Heading>{t("admin.withdrawals.updateStatus.title")}</Modal.Heading>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body className="flex flex-col gap-4">
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                className="w-full"
                value={field.value || null}
                onChange={(key) => field.onChange(key ? String(key) : "")}
                isInvalid={!!errors.status}
              >
                <Label>{t("admin.withdrawals.updateStatus.status")}</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {statuses.map((status) => (
                      <ListBox.Item
                        key={status}
                        id={status}
                        textValue={t(`admin.withdrawals.updateStatus.statuses.${status}`)}
                      >
                        {t(`admin.withdrawals.updateStatus.statuses.${status}`)}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
                <FieldError>{errors.status?.message}</FieldError>
              </Select>
            )}
          />

          {selectedStatus === "completed" && (
            <FormField
              control={control}
              name="tx_hash"
              label={t("admin.withdrawals.updateStatus.txHash")}
              placeholder={t("admin.withdrawals.updateStatus.txHashPlaceholder")}
              error={errors.tx_hash?.message}
            />
          )}

          {selectedStatus === "rejected" && (
            <FormField
              control={control}
              name="reason"
              label={t("admin.withdrawals.updateStatus.reason")}
              placeholder={t("admin.withdrawals.updateStatus.reasonPlaceholder")}
              error={errors.reason?.message}
            />
          )}

          <FormField
            control={control}
            name="admin_note"
            label={t("admin.withdrawals.updateStatus.adminNote")}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="tertiary" slot="close">
            {t("admin.brokerAccounts.reject.cancel")}
          </Button>
          <Button type="submit" variant="primary" isDisabled={updateStatus.isPending}>
            {t("admin.withdrawals.updateStatus.submit")}
          </Button>
        </Modal.Footer>
      </Form>
    </BaseModal>
  );
};
