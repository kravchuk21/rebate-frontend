"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Avatar, Button, Form, Link, toast, Typography } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { FormField } from "@/shared/components/FormField";
import { AuthDivider } from "./AuthDivider";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { getErrorMessage } from "../lib/getErrorMessage";
import { useAuthModal } from "../hooks/useAuthModal";
import { useRegister } from "../hooks/useRegister";
import { createRegisterSchema, type RegisterFormValues } from "../schemas/registerSchema";

interface RegisterFormProps {
  defaultReferralCode?: string;
}

export const RegisterForm = ({ defaultReferralCode }: RegisterFormProps) => {
  const t = useTranslations();
  const { switchTo } = useAuthModal();
  const register = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(createRegisterSchema(t)),
    defaultValues: { email: "", password: "", referral_code: defaultReferralCode ?? "" },
  });
  const onSubmit = (data: RegisterFormValues) => {
    register.mutate(data, {
      onError: (error) => {
        toast.danger(getErrorMessage(error) ?? t("auth.errors.generic"));
      },
    });
  };

  if (register.isSuccess) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Alert status="success">
          <Alert.Content>
            <Alert.Description>{t("auth.register.successMessage")}</Alert.Description>
          </Alert.Content>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-1">
        <Avatar>
          <Avatar.Image
            alt="Avatar"
            src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
          />
          <Avatar.Fallback>AV</Avatar.Fallback>
        </Avatar>
        <Typography type="h4">{t("auth.register.title")}</Typography>
        <Typography type="body-sm">{t("auth.register.subtitle")}</Typography>
      </div>

      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <FormField
          control={control}
          name="email"
          label={t("auth.register.email")}
          placeholder="you@example.com"
          type="email"
          error={errors.email?.message}
          isRequired
        />
        <FormField
          control={control}
          name="password"
          label={t("auth.register.password")}
          placeholder="••••••••"
          type="password"
          error={errors.password?.message}
          isRequired
        />
        <FormField
          control={control}
          name="referral_code"
          label={t("auth.register.referralCode")}
          placeholder="ABCD1234"
          error={errors.referral_code?.message}
        />
        <Button type="submit" variant="primary" fullWidth isDisabled={register.isPending}>
          {register.isPending ? t("auth.register.loading") : t("auth.register.submit")}
        </Button>
      </Form>

      <AuthDivider translationKey="auth.register.or" />

      <GoogleAuthButton />

      <Typography.Paragraph size="sm" align="center">
        {t("auth.register.switchToLogin")}{" "}
        <Link onPress={() => switchTo("login")}>{t("auth.register.signIn")}</Link>
      </Typography.Paragraph>
    </div>
  );
};
