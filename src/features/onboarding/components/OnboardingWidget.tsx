"use client";

import "@/shared/api/instance";

import { Button, Card, Typography, CloseButton, Checkbox } from "@heroui/react";
import { useLocalStorage } from "@siberiacancode/reactuse";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Routes } from "@/shared/lib/routes";
import { cn } from "@/shared/lib/cn";
import { WidgetCard } from "@/shared/components/WidgetCard";
import { useAuth } from "@/features/auth/components/AuthProvider";
import { useMyAccounts } from "@/features/broker/hooks/useMyAccounts";
import { usePayoutMethods } from "@/features/withdrawal/hooks/usePayoutMethods";
import type {
  BrokerAccountDetailResponse,
  WithdrawalPayoutMethodResponse,
} from "@/shared/api/generated/types.gen";
import { DashboardItem, DashboardLayout } from "@/shared/components/layout";

const DISMISSED_KEY = "onboarding-dismissed";

export const OnboardingWidget = () => {
  const t = useTranslations("dashboard.onboarding");
  const router = useRouter();

  const { data: accountsData, isLoading: isAccountsLoading } = useMyAccounts();
  const { data: methodsData, isLoading: isMethodsLoading } = usePayoutMethods();
  const { twoFaEnabled } = useAuth();

  const { value: dismissed, set: setDismissed } = useLocalStorage(DISMISSED_KEY, false);

  const accounts =
    (accountsData?.data as { items?: BrokerAccountDetailResponse[] } | undefined)?.items ?? [];
  const methods = (methodsData?.data as WithdrawalPayoutMethodResponse[] | undefined) ?? [];

  const steps = [
    {
      key: "broker",
      done: accounts.length > 0,
      href: Routes.Accounts,
    },
    {
      key: "payout",
      done: methods.length > 0,
      href: Routes.Withdrawal,
    },
    {
      key: "twofa",
      done: twoFaEnabled,
      href: Routes.Profile,
    },
  ] as const;

  const doneCount = steps.filter((step) => step.done).length;
  const isLoading = isAccountsLoading || isMethodsLoading;
  const allDone = doneCount === steps.length;

  // Render nothing while data is loading, once every step is complete, or after
  // a manual dismissal.
  if (isLoading || dismissed || allDone) {
    return null;
  }

  return (
    <DashboardItem>
      <WidgetCard variant="secondary">
        <Card.Header>
          <Card.Title>{t("title")}</Card.Title>
          <Card.Description>
            {t("subtitle")} · {t("progress", { done: doneCount, total: steps.length })}
          </Card.Description>
        </Card.Header>
        <CloseButton className="absolute top-4 right-4" onClick={() => setDismissed(true)} />
        <Card.Content>
          <DashboardLayout>
            {steps.map((step) => (
              <DashboardItem key={step.key} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Checkbox isSelected={step.done}>
                    <Checkbox.Content>
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                    </Checkbox.Content>
                  </Checkbox>
                  <div className="flex flex-col">
                    <Typography.Paragraph className={cn(step.done && "line-through text-muted")}>
                      {t(`steps.${step.key}.title`)}
                    </Typography.Paragraph>
                    <Typography.Paragraph color="muted" size="sm">
                      {t(`steps.${step.key}.description`)}
                    </Typography.Paragraph>
                  </div>
                </div>
                {!step.done && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onPress={() => router.push(step.href)}
                  >
                    {t(`steps.${step.key}.cta`)}
                  </Button>
                )}
              </DashboardItem>
            ))}
          </DashboardLayout>
        </Card.Content>
      </WidgetCard>
    </DashboardItem>
  );
};
