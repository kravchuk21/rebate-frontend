"use client";

import "@/shared/api/instance";

import { useEffect } from "react";
import { Card, Skeleton, Typography, toast } from "@heroui/react";
import { useTranslations } from "next-intl";

import type { WithdrawalBalanceResponse } from "@/shared/api/generated/types.gen";

import { useBalance } from "../hooks/useBalance";
import { formatAmount } from "../lib/formatAmount";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";
import { InfoTooltip } from "./InfoTooltip";
import { WidgetCard } from "@/shared/components/WidgetCard";

export const BalanceCard = () => {
  const t = useTranslations("withdrawal.balance");
  const { data, isLoading, isError } = useBalance();

  useEffect(() => {
    if (isError) toast.danger(t("errors.loadFailed"));
  }, [isError, t]);

  const balance = data?.data as WithdrawalBalanceResponse | undefined;

  const items: Array<{ key: "total" | "frozen" | "available" }> = [
    { key: "total" },
    { key: "frozen" },
    { key: "available" },
  ];

  return (
    <WidgetCard className="p-0" variant="transparent">
      <Card.Header>
        <Card.Title>{t("title")}</Card.Title>
      </Card.Header>
      <Card.Content>
        <DashboardLayout>
          {items.map(({ key }) => (
            <DashboardItem key={key} span={4}>
              <WidgetCard>
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <Card.Title>{t(key)}</Card.Title>
                    <InfoTooltip
                      title={t(`${key}Hint.title`)}
                      description={t(`${key}Hint.description`)}
                    />
                  </div>
                </Card.Header>
                <Card.Content>
                  {isLoading ? (
                    <Skeleton className="h-7 w-full" />
                  ) : (
                    <Typography.Paragraph>{formatAmount(balance?.[key])} USDT</Typography.Paragraph>
                  )}
                </Card.Content>
              </WidgetCard>
            </DashboardItem>
          ))}
        </DashboardLayout>
      </Card.Content>
    </WidgetCard>
  );
};
