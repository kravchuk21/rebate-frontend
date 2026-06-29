"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@heroui/react";

import type { TrendChartProps } from "./TrendChart";

/**
 * Code-split wrapper around {@link TrendChart}.
 *
 * `TrendChart` statically pulls in the Bklit chart components (`@visx/*` +
 * `motion`). Loading it eagerly drags that whole library into every bundle that
 * renders a stats widget, so we defer it to a client-only dynamic import — the
 * charting deps download only once a widget actually shows a chart.
 */
export const LazyTrendChart = dynamic<TrendChartProps>(
  () => import("./TrendChart").then((m) => m.TrendChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-48 w-full" />,
  },
);
