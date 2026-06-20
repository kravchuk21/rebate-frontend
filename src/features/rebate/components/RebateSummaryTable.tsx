"use client";

import { Card, Skeleton, Typography } from "@heroui/react";
import { useTranslations } from "next-intl";

import type { RebateStatsResponse } from "@/shared/api/generated/types.gen";
import { formatAmount } from "@/features/withdrawal/lib/formatAmount";

import { useRebateStats } from "../hooks/useRebateStats";
import { WidgetCard } from "@/shared/components/WidgetCard";

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
  const { data, isLoading, isError } = useRebateStats();

  const stats = data?.data as RebateStatsResponse | undefined;

  return (
    <WidgetCard>
      <Card.Header>
        <Card.Title>{t("summaryTable.title")}</Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-col">
        {isError ? (
          <Typography.Paragraph size="sm" className="text-danger">
            —
          </Typography.Paragraph>
        ) : isLoading ? (
          <>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </>
        ) : (
          SUMMARY_ROWS.map(({ labelKey, field }) => (
            <div key={field} className="flex items-center justify-between">
              <Typography.Paragraph size="sm" color="muted">
                {t(`summary.${labelKey}`)}
              </Typography.Paragraph>
              <Typography type="body-sm">{formatAmount(stats?.[field])} USDT</Typography>
            </div>
          ))
        )}
      </Card.Content>
    </WidgetCard>
  );
};
