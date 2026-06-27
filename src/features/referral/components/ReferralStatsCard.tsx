"use client";

import { Card, Typography } from "@heroui/react";
import { useTranslations } from "next-intl";

import type { ReferralStatsResponse } from "@/shared/api/generated/types.gen";

import { useReferralStats } from "../hooks/useReferralStats";
import { WidgetCard } from "@/shared/components/WidgetCard";
import { TypographySkeletonSm } from "@/shared/components/Skeletons";
import { DashboardItem, DashboardLayout } from "@/shared/components/layout";

export const ReferralStatsCard = () => {
  const t = useTranslations("referrals.stats");
  const { data, isLoading } = useReferralStats();

  const stats = data?.data as ReferralStatsResponse | undefined;

  const rows: { label: string; value: string | number }[] = [
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
          <DashboardLayout gap={2}>
            {rows.map(({ label, value }) => (
              <DashboardItem key={label} className="flex items-center">
                <Typography.Paragraph size="sm" color="muted" className="flex-1">
                  {label}
                </Typography.Paragraph>
                <div className="flex-1 flex justify-end">
                  {isLoading ? <TypographySkeletonSm /> : <Typography type="body-sm">{value}</Typography>}
                </div>
              </DashboardItem>
            ))}
          </DashboardLayout>
        </div>
      </Card.Content>
    </WidgetCard>
  );
};
