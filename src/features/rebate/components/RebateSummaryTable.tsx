"use client";

import { Card } from "@heroui/react";
import { useTranslations } from "next-intl";

import type { RebateStatsResponse } from "@/shared/api/generated/types.gen";
import { formatAmount } from "@/features/withdrawal/lib/formatAmount";
import { WidgetCard } from "@/shared/components/WidgetCard";
import { StatsRows } from "@/shared/components/stats";
import { useRebateStats } from "../hooks/useRebateStats";

type SummaryField = "all_time" | "last_7_days" | "today" | "current_month" | "last_month";

const SUMMARY_ROWS: { labelKey: string; field: SummaryField }[] = [
  { labelKey: "allTime", field: "all_time" },
  { labelKey: "last7Days", field: "last_7_days" },
  { labelKey: "today", field: "today" },
  { labelKey: "currentMonth", field: "current_month" },
  { labelKey: "lastMonth", field: "last_month" },
];

export const RebateSummaryTable = () => {
  const t = useTranslations("rebate.stats");
  const { data, isLoading } = useRebateStats();

  const stats = data?.data as RebateStatsResponse | undefined;

  const rows = SUMMARY_ROWS.map(({ labelKey, field }) => ({
    label: t(`summary.${labelKey}`),
    value: `${formatAmount(stats?.[field])} USDT`,
  }));

  return (
    <WidgetCard>
      <Card.Header>
        <Card.Title>{t("summaryTable.title")}</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="mt-auto">
          <StatsRows rows={rows} isLoading={isLoading} />
        </div>
      </Card.Content>
    </WidgetCard>
  );
};
