"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Card, Link, Skeleton } from "@heroui/react";
import { useLocale } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { LazyTrendChart } from "@/shared/components/charts";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";
import { WidgetCard } from "@/shared/components/WidgetCard";

import { buildTrendChart } from "./buildTrendChart";
import { StatsRangeSelect } from "./StatsRangeSelect";
import { StatsSummary } from "./StatsSummary";
import type { PeriodStatsResponse, RangeMode, StatsTranslator } from "./types";

interface StatsWidgetProps {
  /** Namespaced translator (rebate.stats, referrals.earnings, ...). */
  t: StatsTranslator;
  stats: PeriodStatsResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  /** Route pushed by the "view all" button in full mode. */
  viewAllHref?: string;
  /** Called when an error occurs (e.g. to show a toast). */
  onError?: () => void;
  fullMode?: boolean;
}

export const StatsWidget = ({
  t,
  stats,
  isLoading,
  isError,
  viewAllHref,
  onError,
  fullMode = true,
}: StatsWidgetProps) => {
  const locale = useLocale();
  const router = useRouter();
  const [range, setRange] = useState<RangeMode>("last_7_days");

  useEffect(() => {
    if (isError) onError?.();
  }, [isError, onError]);

  const chart = useMemo(() => buildTrendChart(stats, range, locale), [stats, range, locale]);

  if (isError) return null;

  const rangeSelect = <StatsRangeSelect t={t} value={range} onChange={setRange} />;

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
            rangeSelect
          )}
        </div>
      </Card.Header>
      <Card.Content>
        <DashboardLayout>
          {fullMode && (
            <>
              <DashboardItem>
                <StatsSummary t={t} stats={stats} isLoading={isLoading} />
              </DashboardItem>
              {viewAllHref && (
                <DashboardItem className="flex items-center justify-between">
                  <Button variant="secondary" size="sm" onPress={() => router.push(viewAllHref)}>
                    {t("viewAll")}
                    <Link.Icon />
                  </Button>
                </DashboardItem>
              )}
            </>
          )}

          <DashboardItem>
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <LazyTrendChart data={chart.data} labels={chart.labels} className="h-48 w-full" />
            )}
          </DashboardItem>
        </DashboardLayout>
      </Card.Content>
    </WidgetCard>
  );
};
