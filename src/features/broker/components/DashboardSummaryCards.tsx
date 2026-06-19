"use client";

import "@/shared/api/instance";

import { Button, Card, Link, Skeleton, Typography } from "@heroui/react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { Routes } from "@/shared/lib/routes";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";
import type {
  BrokerAccountDetailResponse,
  ReferralStatsResponse,
  WithdrawalBalanceResponse,
} from "@/shared/api/generated/types.gen";
import { useBalance } from "@/features/withdrawal/hooks/useBalance";
import { formatAmount } from "@/features/withdrawal/lib/formatAmount";
import { useReferralStats } from "@/features/referral/hooks/useReferralStats";

import { useMyAccounts } from "../hooks/useMyAccounts";
import { WidgetCard } from "@/shared/components/WidgetCard";

export const DashboardSummaryCards = () => {
  const t = useTranslations("dashboard.cards");
  const router = useRouter();
  const { data } = useMyAccounts();
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance();
  const { data: referralData, isLoading: isReferralLoading } = useReferralStats();

  const accounts =
    (data?.data as { items?: BrokerAccountDetailResponse[] } | undefined)?.items ?? [];
  const approvedCount = accounts.filter((account) => account.status === "approved").length;

  const balance = balanceData?.data as WithdrawalBalanceResponse | undefined;
  const referralStats = referralData?.data as ReferralStatsResponse | undefined;

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
    {
      title: t("referralCode"),
      isLoading: isReferralLoading,
      value: referralStats?.referral_code ?? "—",
      actionLabel: t("viewReferrals"),
      href: Routes.Referrals,
    },
  ] as const;

  return (
    <DashboardLayout>
      {summaryCards.map((card) => (
        <DashboardItem key={card.title} span={4}>
          <WidgetCard>
            <Card.Header>
              <Card.Title>{card.title}</Card.Title>
            </Card.Header>
            <Card.Content>
              {card.isLoading ? (
                <Skeleton className="h-7 w-full" />
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
  );
};
