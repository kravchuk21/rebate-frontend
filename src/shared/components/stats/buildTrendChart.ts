import type { PeriodStatsResponse, RangeMode } from "./types";

export interface TrendChartData {
  labels: string[];
  data: number[];
  max: number;
}

// Derive TrendChart-ready labels/data/max from period stats for the given range.
export const buildTrendChart = (
  stats: PeriodStatsResponse | undefined,
  range: RangeMode,
  locale: string,
): TrendChartData => {
  const breakdown =
    (range === "last_7_days" ? stats?.last_7_days_breakdown : stats?.last_30_days_breakdown) ?? [];

  const labels = breakdown.map((day) =>
    day.date
      ? new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit" }).format(
          new Date(day.date),
        )
      : "—",
  );
  const data = breakdown.map((day) => Number(day.amount ?? 0));
  const max = Math.max(10, Math.ceil((Math.max(0, ...data) * 1.2) / 10) * 10);

  return { labels, data, max };
};
