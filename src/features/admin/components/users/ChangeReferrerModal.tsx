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
import { useAdminChangeReferrer } from "../../hooks/useAdminChangeReferrer";
import {
  changeReferrerSchema,
  type ChangeReferrerFormValues,
} from "../../schemas/changeReferrerSchema";

export const ChangeReferrerModal = () => {
  const t = useTranslations();
  const { isOpen, close, param } = useModal(Modals.ChangeReferrer);
  const userID = param("userID");
  const referrerEmail = param("referrerEmail");
  const changeReferrer = useAdminChangeReferrer();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangeReferrerFormValues>({
    resolver: zodResolver(changeReferrerSchema),
    defaultValues: { referrer_id: "" },
  });

  const submit = (referrerID: string | null) => {
    if (!userID) return;

    changeReferrer.mutate(
      {
        path: { userID },
        body: { referrer_id: referrerID ?? undefined },
      },
      {
        onSuccess: () => {
          reset();
          close();
        },
        onError: (error) => {
          toast.danger(getAdminErrorMessage(error) ?? t("admin.users.errors.referrerFailed"));
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      changeReferrer.reset();
      close();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Header>
        <Modal.Heading>{t("admin.users.changeReferrer.title")}</Modal.Heading>
      </Modal.Header>
      <Form onSubmit={handleSubmit((data) => submit(data.referrer_id || null))}>
        <Modal.Body className="flex flex-col gap-4">
          <p className="text-muted text-sm">
            {t("admin.users.changeReferrer.currentReferrer")}:{" "}
            {referrerEmail || t("admin.users.changeReferrer.none")}
          </p>

          <FormField
            control={control}
            name="referrer_id"
            label={t("admin.users.changeReferrer.newReferrerID")}
            placeholder={t("admin.users.changeReferrer.newReferrerIDPlaceholder")}
            error={errors.referrer_id?.message}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="tertiary" slot="close">
            {t("admin.brokerAccounts.reject.cancel")}
          </Button>
          <Button
            type="button"
            variant="outline"
            isDisabled={changeReferrer.isPending}
            onPress={() => submit(null)}
          >
            {t("admin.users.changeReferrer.remove")}
          </Button>
          <Button type="submit" variant="primary" isDisabled={changeReferrer.isPending}>
            {t("admin.users.changeReferrer.submit")}
          </Button>
        </Modal.Footer>
      </Form>
    </BaseModal>
  );
};
