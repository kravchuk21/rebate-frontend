'use client';

import { useSyncExternalStore } from 'react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  type ChartOptions,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler, Tooltip);

const DEFAULT_LABELS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

const AXIS_FONT = {
  size: 11,
  family: 'system-ui, -apple-system, "Segoe UI", sans-serif',
};

export type TrendChartType = 'bar' | 'line';

interface TrendChartProps {
  data: number[];
  labels?: string[];
  max?: number;
  className?: string;
  type?: TrendChartType;
}

interface ChartColors {
  accent: string;
  accentHover: string;
  accentSoft: string;
  muted: string;
  border: string;
  overlay: string;
  overlayForeground: string;
  surface: string;
  barRadius: number;
  tooltipRadius: number;
}

const FALLBACK_COLORS: ChartColors = {
  accent: '#3b82f6',
  accentHover: '#60a5fa',
  accentSoft: 'rgba(59, 130, 246, 0.15)',
  muted: '#9ca3af',
  border: 'rgba(255, 255, 255, 0.08)',
  overlay: '#1f1f1f',
  overlayForeground: '#fff',
  surface: '#fff',
  barRadius: 10,
  tooltipRadius: 6,
};

// Resolves HeroUI design tokens (incl. color-mix/oklch) via the DOM so Chart.js
// canvas rendering always matches the active theme.
function readChartColors(): ChartColors {
  const probes = {
    accent: 'bg-accent',
    accentHover: 'bg-accent-hover',
    accentSoft: 'bg-accent-soft',
    muted: 'text-muted',
    border: 'border border-border',
    overlay: 'bg-overlay',
    overlayForeground: 'text-overlay-foreground',
    surface: 'bg-surface',
    barRadius: 'rounded-lg',
    tooltipRadius: 'rounded-xl',
  } as const;

  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;visibility:hidden;';

  const elements = Object.fromEntries(
    Object.entries(probes).map(([key, className]) => {
      const el = document.createElement('div');
      el.className = className;
      container.appendChild(el);
      return [key, el];
    }),
  ) as Record<keyof typeof probes, HTMLDivElement>;

  document.body.appendChild(container);

  const colors: ChartColors = {
    accent: getComputedStyle(elements.accent).backgroundColor,
    accentHover: getComputedStyle(elements.accentHover).backgroundColor,
    accentSoft: getComputedStyle(elements.accentSoft).backgroundColor,
    muted: getComputedStyle(elements.muted).color,
    border: getComputedStyle(elements.border).borderColor,
    overlay: getComputedStyle(elements.overlay).backgroundColor,
    overlayForeground: getComputedStyle(elements.overlayForeground).color,
    surface: getComputedStyle(elements.surface).backgroundColor,
    barRadius: parseFloat(getComputedStyle(elements.barRadius).borderRadius) || FALLBACK_COLORS.barRadius,
    tooltipRadius:
      parseFloat(getComputedStyle(elements.tooltipRadius).borderRadius) || FALLBACK_COLORS.tooltipRadius,
  };

  document.body.removeChild(container);

  return colors;
}

let cachedColors: ChartColors | null = null;

function getSnapshot(): ChartColors {
  if (!cachedColors) cachedColors = readChartColors();
  return cachedColors;
}

function getServerSnapshot(): ChartColors {
  return FALLBACK_COLORS;
}

function subscribe(onStoreChange: () => void) {
  cachedColors = null;

  const observer = new MutationObserver(() => {
    cachedColors = null;
    onStoreChange();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });

  return () => observer.disconnect();
}

function useChartColors(): ChartColors {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const TrendChart = ({
  data,
  labels = DEFAULT_LABELS,
  max = 60,
  className,
  type = 'line',
}: TrendChartProps) => {
  const colors = useChartColors();

  const scales = {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: colors.muted, font: AXIS_FONT },
    },
    y: {
      min: 0,
      max,
      border: { display: false },
      grid: { color: colors.border },
      ticks: { color: colors.muted, font: AXIS_FONT, stepSize: max / 3 },
    },
  };

  const plugins = {
    legend: { display: false },
    title: { display: false },
    tooltip: {
      backgroundColor: colors.overlay,
      titleColor: colors.overlayForeground,
      bodyColor: colors.overlayForeground,
      padding: 8,
      cornerRadius: colors.tooltipRadius,
      displayColors: false,
    },
  };

  return (
    <div className={className ?? 'h-80 w-full p-2'}>
      {type === 'line' ? (
        <Line
          data={{
            labels,
            datasets: [
              {
                data,
                borderColor: colors.accent,
                backgroundColor: colors.accentSoft,
                pointBackgroundColor: colors.accent,
                pointBorderColor: colors.surface,
                pointHoverBackgroundColor: colors.accentHover,
                pointHoverBorderColor: colors.surface,
                pointRadius: 0,
                pointHoverRadius: 5,
                borderWidth: 2,
                tension: 0.4,
                cubicInterpolationMode: 'monotone',
                fill: true,
              },
            ],
          }}
          options={{ responsive: true, maintainAspectRatio: false, plugins, scales } satisfies ChartOptions<'line'>}
        />
      ) : (
        <Bar
          data={{
            labels,
            datasets: [
              {
                data,
                backgroundColor: colors.accent,
                hoverBackgroundColor: colors.accentHover,
                borderRadius: {
                  topLeft: colors.barRadius,
                  topRight: colors.barRadius,
                  bottomLeft: colors.barRadius,
                  bottomRight: colors.barRadius,
                },
                borderSkipped: false,
                barPercentage: 0.6,
                categoryPercentage: 1,
              },
            ],
          }}
          options={{ responsive: true, maintainAspectRatio: false, plugins, scales } satisfies ChartOptions<'bar'>}
        />
      )}
    </div>
  );
};
