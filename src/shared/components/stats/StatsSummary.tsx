"use client";

import { formatAmount } from "@/features/withdrawal/lib/formatAmount";

import { StatsRows } from "./StatsRows";
import type { PeriodStatsResponse, StatsTranslator } from "./types";

type SummaryField = "all_time" | "last_7_days" | "today" | "current_month" | "last_month";

const SUMMARY_ROWS: { labelKey: string; field: SummaryField }[] = [
  { labelKey: "allTime", field: "all_time" },
  { labelKey: "last7Days", field: "last_7_days" },
  { labelKey: "today", field: "today" },
  { labelKey: "currentMonth", field: "current_month" },
  { labelKey: "lastMonth", field: "last_month" },
];

interface StatsSummaryProps {
  t: StatsTranslator;
  stats: PeriodStatsResponse | undefined;
  isLoading: boolean;
}

export const StatsSummary = ({ t, stats, isLoading }: StatsSummaryProps) => {
  const rows = SUMMARY_ROWS.map(({ labelKey, field }) => ({
    label: t(`summary.${labelKey}`),
    value: `${formatAmount(stats?.[field])} USDT`,
  }));

  return <StatsRows rows={rows} isLoading={isLoading} />;
};
