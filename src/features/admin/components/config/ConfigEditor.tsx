"use client";

import "@/shared/api/instance";

import { useEffect } from "react";
import { Button, Form, toast } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { DashboardLayout, DashboardItem } from "@/shared/components/layout";
import { FormField } from "@/shared/components/FormField";

import { useAdminConfig } from "../../hooks/useAdminConfig";
import { useAdminSetConfig } from "../../hooks/useAdminSetConfig";
import { WidgetCard } from "@/shared/components/WidgetCard";

const CONFIG_KEYS = [
  "our_fee_rate",
  "referral_rate",
  "min_withdrawal_amount",
  "network_fee_TRC20",
  "network_fee_ERC20",
  "network_fee_BEP20",
  "network_fee_SOL",
] as const;

type ConfigKey = (typeof CONFIG_KEYS)[number];

type ConfigFormValues = Record<ConfigKey, string>;

const ConfigForm = ({ values }: { values: Partial<ConfigFormValues> }) => {
  const t = useTranslations("admin.config");
  const setConfig = useAdminSetConfig();

  const {
    control,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm<ConfigFormValues>({
    values: CONFIG_KEYS.reduce(
      (acc, key) => ({ ...acc, [key]: values[key] ?? "" }),
      {} as ConfigFormValues,
    ),
  });

  const onSubmit = async (data: ConfigFormValues) => {
    const changedKeys = Object.keys(dirtyFields) as ConfigKey[];
    if (changedKeys.length === 0) return;

    try {
      await Promise.all(
        changedKeys.map((key) =>
          setConfig.mutateAsync({ path: { key }, body: { value: data[key] } }),
        ),
      );
      toast.success(t("saved"));
    } catch {
      toast.danger(t("saveFailed"));
    }
  };

  return (
    <WidgetCard>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <DashboardLayout>
          {CONFIG_KEYS.map((key) => (
            <DashboardItem key={key} span={6}>
              <FormField control={control} name={key} label={t(`labels.${key}`)} />
            </DashboardItem>
          ))}
          <DashboardItem span={12}>
            <div className="flex justify-end">
              <Button type="submit" variant="primary" isDisabled={setConfig.isPending}>
                {t("save")}
              </Button>
            </div>
          </DashboardItem>
        </DashboardLayout>
      </Form>
    </WidgetCard>
  );
};

export const ConfigEditor = () => {
  const t = useTranslations("admin.config");
  const { data, isLoading, isError } = useAdminConfig();

  useEffect(() => {
    if (isError) toast.danger(t("errors.loadFailed"));
  }, [isError, t]);

  const items =
    (data?.data as { items?: { key: string; value: string }[] } | undefined)?.items ?? [];
  const values = items.reduce(
    (acc, item) => ({ ...acc, [item.key]: item.value }),
    {} as Record<string, string>,
  );

  // if (isLoading) {
  //   return (
  //     <DashboardLayout>
  //       {CONFIG_KEYS.map((key) => (
  //         <DashboardItem key={key} span={12}>
  //           <Skeleton className="h-20 w-full" />
  //         </DashboardItem>
  //       ))}
  //     </DashboardLayout>
  //   );
  // }

  if (isError) return null;

  return <ConfigForm values={values} />;
};
