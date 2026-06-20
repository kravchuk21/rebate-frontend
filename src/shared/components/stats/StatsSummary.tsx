"use client";

import { Skeleton, Typography } from "@heroui/react";

import { formatAmount } from "@/features/withdrawal/lib/formatAmount";

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

export const StatsSummary = ({ t, stats, isLoading }: StatsSummaryProps) => (
  <>
    {SUMMARY_ROWS.map(({ labelKey, field }) => (
      <div key={field} className="flex items-center justify-between gap-4">
        <Typography.Paragraph className="flex-1" size="sm" color="muted">
          {t(`summary.${labelKey}`)}
        </Typography.Paragraph>
        {isLoading ? (
          <Skeleton className="h-7 flex-1" />
        ) : (
          <Typography.Paragraph className="flex-1 text-right" size="sm">
            {`${formatAmount(stats?.[field])} USDT`}
          </Typography.Paragraph>
        )}
      </div>
    ))}
  </>
);
