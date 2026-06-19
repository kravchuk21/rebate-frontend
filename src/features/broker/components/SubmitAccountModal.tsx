"use client";

import "@/shared/api/instance";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FieldError, Form, Label, ListBox, Modal, Select, toast } from "@heroui/react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

import { getErrorMessage } from "@/features/auth/lib/getErrorMessage";
import type { BrokerResponse } from "@/shared/api/generated/types.gen";
import { BaseModal } from "@/shared/components/BaseModal";
import { FormField } from "@/shared/components/FormField";
import { useModal } from "@/shared/hooks/useModal";
import { Modals } from "@/shared/lib/routes";

import { useBrokers } from "../hooks/useBrokers";
import { useSubmitAccount } from "../hooks/useSubmitAccount";
import {
  createSubmitAccountSchema,
  type SubmitAccountFormValues,
} from "../schemas/submitAccountSchema";

export const SubmitAccountModal = () => {
  const t = useTranslations();
  const { isOpen, close } = useModal(Modals.SubmitAccount);
  const { data: brokersData } = useBrokers();
  const brokers =
    ((brokersData?.data as { data?: BrokerResponse[] } | undefined)?.data as
      | BrokerResponse[]
      | undefined) ?? [];

  const submitAccount = useSubmitAccount();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmitAccountFormValues>({
    resolver: zodResolver(createSubmitAccountSchema(t)),
    defaultValues: { broker_id: "", uid: "" },
  });

  const onSubmit = (data: SubmitAccountFormValues) => {
    submitAccount.mutate(
      { body: data },
      {
        onSuccess: () => {
          reset();
          close();
        },
        onError: (error) => {
          toast.danger(getErrorMessage(error) ?? t("accounts.errors.submitFailed"));
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      submitAccount.reset();
      close();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Header>
        <Modal.Heading>{t("accounts.submit.title")}</Modal.Heading>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body className="flex flex-col gap-4">
          <Controller
            control={control}
            name="broker_id"
            render={({ field }) => (
              <Select
                className="w-full"
                placeholder={t("accounts.submit.brokerPlaceholder")}
                selectedKey={field.value || null}
                onSelectionChange={(key) => field.onChange(key ? String(key) : "")}
                isInvalid={!!errors.broker_id}
              >
                <Label>{t("accounts.submit.broker")}</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {brokers.map((broker) => (
                      <ListBox.Item key={broker.id} id={broker.id} textValue={broker.name}>
                        {broker.name}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
                <FieldError>{errors.broker_id?.message}</FieldError>
              </Select>
            )}
          />

          <FormField
            control={control}
            name="uid"
            label={t("accounts.submit.uid")}
            placeholder={t("accounts.submit.uidPlaceholder")}
            error={errors.uid?.message}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="tertiary" slot="close">
            {t("accounts.submit.cancel")}
          </Button>
          <Button type="submit" variant="primary" isDisabled={submitAccount.isPending}>
            {submitAccount.isPending
              ? t("accounts.submit.submitting")
              : t("accounts.submit.submit")}
          </Button>
        </Modal.Footer>
      </Form>
    </BaseModal>
  );
};
