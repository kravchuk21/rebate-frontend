"use client";

import "@/shared/api/instance";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Modal, toast } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { BaseModal } from "@/shared/components/BaseModal";
import { FormField } from "@/shared/components/FormField";

import { createReasonSchema, type ReasonFormValues } from "../../schemas/reasonSchema";

interface RejectReasonModalProps {
  type: "reject" | "revoke";
  isOpen: boolean;
  isPending: boolean;
  error?: unknown;
  errorMessage?: string;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (reason: string) => void;
}

export const RejectReasonModal = ({
  type,
  isOpen,
  isPending,
  error,
  errorMessage,
  onOpenChange,
  onSubmit,
}: RejectReasonModalProps) => {
  const t = useTranslations("admin.brokerAccounts");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReasonFormValues>({
    resolver: zodResolver(createReasonSchema(t(`${type}.validation.reason`))),
    defaultValues: { reason: "" },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  useEffect(() => {
    if (error) {
      toast.danger(errorMessage);
    }
  }, [error, errorMessage]);

  return (
    <BaseModal isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Header>
        <Modal.Heading>{t(`${type}.title`)}</Modal.Heading>
      </Modal.Header>
      <Form
        onSubmit={handleSubmit((data) => {
          onSubmit(data.reason);
          reset();
        })}
      >
        <Modal.Body className="flex flex-col gap-4">
          <FormField
            control={control}
            name="reason"
            label={t(`${type}.reason`)}
            placeholder={t(`${type}.reasonPlaceholder`)}
            error={errors.reason?.message}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="tertiary" slot="close">
            {t("reject.cancel")}
          </Button>
          <Button type="submit" variant="primary" isDisabled={isPending}>
            {t(`${type}.submit`)}
          </Button>
        </Modal.Footer>
      </Form>
    </BaseModal>
  );
};
