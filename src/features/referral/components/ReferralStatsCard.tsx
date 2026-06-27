"use client";

import { Card } from "@heroui/react";
import { useTranslations } from "next-intl";

import type { ReferralStatsResponse } from "@/shared/api/generated/types.gen";

import { useReferralStats } from "../hooks/useReferralStats";
import { WidgetCard } from "@/shared/components/WidgetCard";
import { StatsRows } from "@/shared/components/stats";

export const ReferralStatsCard = () => {
  const t = useTranslations("referrals.stats");
  const { data, isLoading } = useReferralStats();

  const stats = data?.data as ReferralStatsResponse | undefined;

  const rows = [
    { label: t("totalReferrals"), value: stats?.total_referrals ?? 0 },
    { label: t("activeReferrals"), value: stats?.active_referrals ?? 0 },
    { label: t("totalEarned"), value: `${stats?.total_earned ?? 0} USDT` },
    { label: t("pendingEarned"), value: `${stats?.pending_earned ?? 0} USDT` },
  ];

  return (
    <WidgetCard>
      <Card.Header>
        <Card.Title>{t("title")}</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="mt-auto">
          <StatsRows rows={rows} isLoading={isLoading} />
        </div>
      </Card.Content>
    </WidgetCard>
  );
};
