"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Card, Link, Skeleton, toast } from "@heroui/react";
import { useLocale, useTranslations } from "next-intl";

import type { RebateStatsResponse } from "@/shared/api/generated/types.gen";
import { useRouter } from "@/i18n/navigation";
import { Routes } from "@/shared/lib/routes";
import { TrendChart, type TrendChartType } from "@/shared/components/charts";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";
import { WidgetCard } from "@/shared/components/WidgetCard";

import { useRebateStats } from "../hooks/useRebateStats";
import { buildTrendChart, type RangeMode } from "../lib/buildTrendChart";
import { RebateChartTypeSwitch } from "./RebateChartTypeSwitch";
import { RebateRangeSelect } from "./RebateRangeSelect";
import { RebateStatsSummary } from "./RebateStatsSummary";

interface RebateStatsWidgetProps {
  fullMode?: boolean;
}

export const RebateStatsWidget = ({ fullMode = true }: RebateStatsWidgetProps) => {
  const t = useTranslations("rebate.stats");
  const locale = useLocale();
  const router = useRouter();
  const [range, setRange] = useState<RangeMode>("last_7_days");
  const [chartType, setChartType] = useState<TrendChartType>("line");
  const { data, isLoading, isError } = useRebateStats();

  useEffect(() => {
    if (isError) toast.danger(t("errors.loadFailed"));
  }, [isError, t]);

  const stats = data?.data as RebateStatsResponse | undefined;
  const chart = useMemo(() => buildTrendChart(stats, range, locale), [stats, range, locale]);

  if (isError) return null;

  const rangeSelect = <RebateRangeSelect value={range} onChange={setRange} />;
  const chartSwitch = <RebateChartTypeSwitch value={chartType} onChange={setChartType} />;

  return (
    <WidgetCard>
      <Card.Header>
        <div className="flex items-center justify-between gap-4">
          {fullMode ? (
            <>
              <Card.Title>{t("title")}</Card.Title>
              {rangeSelect}
            </>
          ) : (
            <>
              {rangeSelect}
              {chartSwitch}
            </>
          )}
        </div>
      </Card.Header>
      <Card.Content>
        <DashboardLayout>
          {fullMode && (
            <>
              <DashboardItem>
                <RebateStatsSummary stats={stats} isLoading={isLoading} />
              </DashboardItem>
              <DashboardItem className="flex items-center justify-between">
                <Button variant="secondary" size="sm" onPress={() => router.push(Routes.Rebate)}>
                  {t("viewAll")}
                  <Link.Icon />
                </Button>
                {chartSwitch}
              </DashboardItem>
            </>
          )}

          <DashboardItem>
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <TrendChart
                data={chart.data}
                labels={chart.labels}
                max={chart.max}
                type={chartType}
                className="h-48 w-full"
              />
            )}
          </DashboardItem>
        </DashboardLayout>
      </Card.Content>
    </WidgetCard>
  );
};
