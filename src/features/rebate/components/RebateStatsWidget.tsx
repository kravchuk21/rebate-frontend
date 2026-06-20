"use client";

import { toast } from "@heroui/react";
import { useTranslations } from "next-intl";

import type { RebateStatsResponse } from "@/shared/api/generated/types.gen";
import { Routes } from "@/shared/lib/routes";
import { StatsWidget } from "@/shared/components/stats";

import { useRebateStats } from "../hooks/useRebateStats";

interface RebateStatsWidgetProps {
  fullMode?: boolean;
}

export const RebateStatsWidget = ({ fullMode = true }: RebateStatsWidgetProps) => {
  const t = useTranslations("rebate.stats");
  const { data, isLoading, isError } = useRebateStats();

  const stats = data?.data as RebateStatsResponse | undefined;

  return (
    <StatsWidget
      t={t}
      stats={stats}
      isLoading={isLoading}
      isError={isError}
      viewAllHref={Routes.Rebate}
      onError={() => toast.danger(t("errors.loadFailed"))}
      fullMode={fullMode}
    />
  );
};
