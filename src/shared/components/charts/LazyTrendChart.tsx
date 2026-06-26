"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@heroui/react";

import type { TrendChartProps } from "./TrendChart";

/**
 * Code-split wrapper around {@link TrendChart}.
 *
 * `TrendChart` statically pulls in `chart.js` + `react-chartjs-2` (and registers
 * Chart.js controllers on import). Loading it eagerly drags that whole library
 * into every bundle that renders a stats widget. The chart is a `<canvas>` that
 * can't render on the server anyway, so we defer it to a client-only dynamic
 * import — chart.js downloads only once a widget actually shows a chart.
 */
export const LazyTrendChart = dynamic<TrendChartProps>(
  () => import("./TrendChart").then((m) => m.TrendChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-48 w-full" />,
  },
);
