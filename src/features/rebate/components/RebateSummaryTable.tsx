"use client";

import { useEffect } from "react";
import { Skeleton, Table, toast } from "@heroui/react";
import { useTranslations } from "next-intl";

import type { RebateStatsResponse } from "@/shared/api/generated/types.gen";
import { formatAmount } from "@/features/withdrawal/lib/formatAmount";

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
  const { data, isLoading, isError } = useRebateStats();

  useEffect(() => {
    if (isError) toast.danger(t("errors.loadFailed"));
  }, [isError, t]);

  const stats = data?.data as RebateStatsResponse | undefined;

  if (isError) return null;

  return (
    <Table className="h-full">
      <Table.ScrollContainer>
        <Table.Content aria-label={t("summaryTable.title")}>
          <Table.Header>
            <Table.Column id="period" isRowHeader className="text-nowrap">
              {t("summaryTable.period")}
            </Table.Column>
            <Table.Column id="sum" className="text-nowrap">
              {t("summaryTable.sum")}
            </Table.Column>
          </Table.Header>
          <Table.Body>
            {SUMMARY_ROWS.map(({ labelKey, field }) => (
              <Table.Row key={field}>
                <Table.Cell>{t(`summary.${labelKey}`)}</Table.Cell>
                <Table.Cell>
                  {isLoading ? (
                    <Skeleton className="h-5 w-24" />
                  ) : (
                    `${formatAmount(stats?.[field])} USDT`
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};
