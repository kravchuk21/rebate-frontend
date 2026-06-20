"use client";

import { toast } from "@heroui/react";
import { useTranslations } from "next-intl";

import type { ReferralEarningsStatsResponse } from "@/shared/api/generated/types.gen";
import { Routes } from "@/shared/lib/routes";
import { StatsWidget } from "@/shared/components/stats";

import { useReferralEarningsStats } from "../hooks/useReferralEarningsStats";

interface ReferralStatsWidgetProps {
  fullMode?: boolean;
}

export const ReferralStatsWidget = ({ fullMode = true }: ReferralStatsWidgetProps) => {
  const t = useTranslations("referrals.earnings");
  const { data, isLoading, isError } = useReferralEarningsStats();

  const stats = data?.data as ReferralEarningsStatsResponse | undefined;

  return (
    <StatsWidget
      t={t}
      stats={stats}
      isLoading={isLoading}
      isError={isError}
      viewAllHref={Routes.Referrals}
      onError={() => toast.danger(t("errors.loadFailed"))}
      fullMode={fullMode}
    />
  );
};
