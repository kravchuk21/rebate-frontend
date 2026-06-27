"use client";

import "@/shared/api/instance";

import { Button, Card, Link, Typography } from "@heroui/react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { Routes } from "@/shared/lib/routes";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";
import type {
  BrokerAccountDetailResponse,
  WithdrawalBalanceResponse,
} from "@/shared/api/generated/types.gen";
import { ReferralLinkCard } from "@/features/referral/components/ReferralLinkCard";
import { useBalance } from "@/features/withdrawal/hooks/useBalance";
import { formatAmount } from "@/features/withdrawal/lib/formatAmount";

import { useMyAccounts } from "../hooks/useMyAccounts";
import { WidgetCard } from "@/shared/components/WidgetCard";
import { TypographySkeleton } from "@/shared/components/Skeletons";

export const DashboardSummaryCards = () => {
  const t = useTranslations("dashboard.cards");
  const router = useRouter();
  const { data } = useMyAccounts();
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance();

  const accounts =
    (data?.data as { items?: BrokerAccountDetailResponse[] } | undefined)?.items ?? [];
  const approvedCount = accounts.filter((account) => account.status === "approved").length;

  const balance = balanceData?.data as WithdrawalBalanceResponse | undefined;

  const summaryCards = [
    {
      title: t("accounts"),
      isLoading: false,
      value: approvedCount,
      actionLabel: t("manageAccounts"),
      href: Routes.Accounts,
    },
    {
      title: t("balance"),
      isLoading: isBalanceLoading,
      value: `${formatAmount(balance?.available)} USDT`,
      actionLabel: t("withdrawFunds"),
      href: Routes.Withdrawal,
    },
  ] as const;

  return (
    <DashboardLayout>
      <DashboardItem span={6}>
        <DashboardLayout>
          {summaryCards.map((card) => (
            <DashboardItem key={card.title}>
              <WidgetCard>
                <Card.Header>
                  <Card.Title>{card.title}</Card.Title>
                </Card.Header>
                <Card.Content>
                  {card.isLoading ? (
                    <TypographySkeleton />
                  ) : (
                    <Typography.Paragraph>{card.value}</Typography.Paragraph>
                  )}
                </Card.Content>
                <Card.Footer>
                  <Button variant="secondary" size="sm" onPress={() => router.push(card.href)}>
                    {card.actionLabel}
                    <Link.Icon />
                  </Button>
                </Card.Footer>
              </WidgetCard>
            </DashboardItem>
          ))}
        </DashboardLayout>
      </DashboardItem>
      <DashboardItem span={6}>
        <ReferralLinkCard />
      </DashboardItem>
    </DashboardLayout>
  );
};
