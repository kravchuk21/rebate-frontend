"use client";

import { useMediaQuery } from "@siberiacancode/reactuse";
import { useMemo } from "react";

import { Bar } from "@/components/charts/bar";
import { BarChart } from "@/components/charts/bar-chart";
import { BarXAxis } from "@/components/charts/bar-x-axis";
import { Grid } from "@/components/charts/grid";
import { ChartTooltip } from "@/components/charts/tooltip";

export interface TrendChartProps {
  data: number[];
  labels?: string[];
  className?: string;
}

export const TrendChart = ({ data, labels = [], className }: TrendChartProps) => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  const chartData = useMemo(
    () => labels.map((month, i) => ({ month, value: data[i] ?? 0 })),
    [labels, data],
  );

  return (
    <div className={className ?? "h-80 w-full"}>
      <BarChart
        className="h-full"
        aspectRatio="auto"
        margin={{ top: 8, right: 8, bottom: 40, left: 8 }}
        data={chartData}
        xDataKey="month"
      >
        <Grid horizontal />
        <Bar dataKey="value" lineCap="round" />
        <BarXAxis maxLabels={isMobile ? 7 : 12} />
        <ChartTooltip />
      </BarChart>
    </div>
  );
};
