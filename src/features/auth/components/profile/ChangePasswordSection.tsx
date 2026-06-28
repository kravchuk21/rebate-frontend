"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Form, toast } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";

import { FormField } from "@/shared/components/FormField";
import { WidgetCard } from "@/shared/components/WidgetCard";

const createPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      current: z.string().min(1, t("profile.password.validation.current")),
      newPassword: z.string().min(8, t("profile.password.validation.new")),
      confirm: z.string(),
    })
    .refine((data) => data.newPassword === data.confirm, {
      message: t("profile.password.validation.confirm"),
      path: ["confirm"],
    });

type PasswordFormValues = z.infer<ReturnType<typeof createPasswordSchema>>;

export const ChangePasswordSection = () => {
  const t = useTranslations();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(createPasswordSchema(t)),
    defaultValues: { current: "", newPassword: "", confirm: "" },
  });

  const onSubmit = () => {
    toast(t("profile.password.notAvailable"));
  };

  return (
    <WidgetCard>
      <Card.Header>
        <Card.Title>{t("profile.password.title")}</Card.Title>
        <Card.Description>{t("profile.password.description")}</Card.Description>
      </Card.Header>
      <Card.Content>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <DashboardLayout>
            <DashboardItem>
              <FormField
                control={control}
                name="current"
                type="password"
                label={t("profile.password.current")}
                placeholder={t("profile.password.placeholders.current")}
                error={errors.current?.message}
              />
            </DashboardItem>

            <DashboardItem>
              <FormField
                control={control}
                name="newPassword"
                type="password"
                label={t("profile.password.new")}
                placeholder={t("profile.password.placeholders.new")}
                error={errors.newPassword?.message}
              />
            </DashboardItem>

            <DashboardItem>
              <FormField
                control={control}
                name="confirm"
                type="password"
                label={t("profile.password.confirm")}
                placeholder={t("profile.password.placeholders.confirm")}
                error={errors.confirm?.message}
              />
            </DashboardItem>

            <DashboardItem>
              <Button type="submit" variant="primary">
                {t("profile.password.submit")}
              </Button>
            </DashboardItem>
          </DashboardLayout>
        </Form>
      </Card.Content>
    </WidgetCard>
  );
};
