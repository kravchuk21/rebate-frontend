"use client";

import "@/shared/api/instance";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Modal, toast } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { BaseModal } from "@/shared/components/BaseModal";
import { FormField } from "@/shared/components/FormField";
import { useModal } from "@/shared/hooks/useModal";
import { Modals } from "@/shared/lib/routes";

import { getAdminErrorMessage } from "../../lib/getAdminErrorMessage";
import { useAdminCreateBroker } from "../../hooks/useAdminCreateBroker";
import { useAdminUpdateBroker } from "../../hooks/useAdminUpdateBroker";
import { createBrokerSchema, type BrokerFormValues } from "../../schemas/brokerSchema";

export const BrokerFormModal = () => {
  const t = useTranslations();
  const { isOpen, close, param } = useModal(Modals.BrokerForm);
  const brokerID = param("brokerID");
  const isEdit = !!brokerID;

  const createBroker = useAdminCreateBroker();
  const updateBroker = useAdminUpdateBroker();
  const mutation = isEdit ? updateBroker : createBroker;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BrokerFormValues>({
    resolver: zodResolver(createBrokerSchema(t)),
    defaultValues: { name: "", slug: "", rebate_rate: "", uid_format_regex: "" },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: param("name") ?? "",
        slug: param("slug") ?? "",
        rebate_rate: param("rebateRate") ?? "",
        uid_format_regex: param("uidFormatRegex") ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const onSubmit = (data: BrokerFormValues) => {
    const body = {
      name: data.name,
      slug: data.slug,
      rebate_rate: data.rebate_rate,
      // On edit always send the regex so an existing value can be cleared; on
      // create omit it when empty so the backend applies its default.
      ...(isEdit || data.uid_format_regex ? { uid_format_regex: data.uid_format_regex } : {}),
    };

    const onSuccess = () => {
      reset();
      close();
    };
    const onError = (error: unknown) => {
      toast.danger(
        getAdminErrorMessage(error) ??
          t(isEdit ? "admin.brokers.errors.updateFailed" : "admin.brokers.errors.createFailed"),
      );
    };

    if (isEdit && brokerID) {
      updateBroker.mutate({ path: { brokerID }, body }, { onSuccess, onError });
    } else {
      createBroker.mutate({ body }, { onSuccess, onError });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      createBroker.reset();
      updateBroker.reset();
      close();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Header>
        <Modal.Heading>
          {t(isEdit ? "admin.brokers.form.editTitle" : "admin.brokers.form.createTitle")}
        </Modal.Heading>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body className="flex flex-col gap-4">
          <FormField
            control={control}
            name="name"
            label={t("admin.brokers.form.name")}
            error={errors.name?.message}
          />

          <FormField
            control={control}
            name="slug"
            label={t("admin.brokers.form.slug")}
            error={errors.slug?.message}
          />

          <FormField
            control={control}
            name="rebate_rate"
            label={t("admin.brokers.form.rebateRate")}
            error={errors.rebate_rate?.message}
          />

          <FormField
            control={control}
            name="uid_format_regex"
            label={t("admin.brokers.form.uidFormatRegex")}
            placeholder={t("admin.brokers.form.uidFormatRegexPlaceholder")}
            error={errors.uid_format_regex?.message}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="tertiary" slot="close">
            {t("admin.brokers.form.cancel")}
          </Button>
          <Button type="submit" variant="primary" isDisabled={mutation.isPending}>
            {t("admin.brokers.form.submit")}
          </Button>
        </Modal.Footer>
      </Form>
    </BaseModal>
  );
};
