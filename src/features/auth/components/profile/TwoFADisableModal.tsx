"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Modal, toast, Typography } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getErrorMessage } from "@/features/auth/lib/getErrorMessage";
import { useTwoFADisable } from "@/features/auth/hooks/useTwoFADisable";
import { BaseModal } from "@/shared/components/BaseModal";
import { FormField } from "@/shared/components/FormField";
import { useModal } from "@/shared/hooks/useModal";
import { Modals } from "@/shared/lib/routes";

interface TwoFADisableModalProps {
  onDisabled: () => void;
}

const createDisableSchema = (t: (key: string) => string) =>
  z.object({
    password: z.string().min(1, t("profile.password.validation.current")),
    code: z.string().min(6, t("twoFA.errors.codeRequired")),
  });

type DisableFormValues = z.infer<ReturnType<typeof createDisableSchema>>;

export const TwoFADisableModal = ({ onDisabled }: TwoFADisableModalProps) => {
  const t = useTranslations();
  const { isOpen, close } = useModal(Modals.TwoFADisable);
  const disable = useTwoFADisable();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DisableFormValues>({
    resolver: zodResolver(createDisableSchema(t)),
    defaultValues: { password: "", code: "" },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      disable.reset();
      close();
    }
  };

  const onSubmit = (data: DisableFormValues) => {
    disable.mutate(data, {
      onSuccess: () => {
        reset();
        close();
        onDisabled();
      },
      onError: (error) => {
        toast.danger(getErrorMessage(error) ?? t("auth.errors.generic"));
      },
    });
  };

  return (
    <BaseModal isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Header>
        <Modal.Heading>{t("profile.twoFA.disable.title")}</Modal.Heading>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body className="flex flex-col gap-4">
          <Typography.Paragraph size="sm">{t("profile.twoFA.disable.desc")}</Typography.Paragraph>

          <FormField
            control={control}
            name="password"
            type="password"
            label={t("profile.twoFA.disable.password")}
            error={errors.password?.message}
          />

          <FormField
            control={control}
            name="code"
            label={t("profile.twoFA.disable.code")}
            error={errors.code?.message}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="tertiary" slot="close">
            {t("profile.cancel")}
          </Button>
          <Button type="submit" variant="danger" isDisabled={disable.isPending}>
            {disable.isPending
              ? t("profile.twoFA.disable.submitting")
              : t("profile.twoFA.disable.submit")}
          </Button>
        </Modal.Footer>
      </Form>
    </BaseModal>
  );
};
