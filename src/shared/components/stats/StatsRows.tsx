"use client";

import { Typography } from "@heroui/react";

import { TypographySkeletonSm } from "@/shared/components/Skeletons";
import { DashboardItem, DashboardLayout } from "@/shared/components/layout";

export interface StatsRow {
  label: string;
  value: string | number;
}

interface StatsRowsProps {
  rows: StatsRow[];
  isLoading?: boolean;
}

export const StatsRows = ({ rows, isLoading = false }: StatsRowsProps) => (
  <DashboardLayout gap={2}>
    {rows.map(({ label, value }) => (
      <DashboardItem key={label} className="flex items-center">
        <Typography.Paragraph size="sm" color="muted" className="flex-1">
          {label}
        </Typography.Paragraph>
        <div className="flex-1 flex justify-end">
          {isLoading ? <TypographySkeletonSm /> : <Typography type="body-sm">{value}</Typography>}
        </div>
      </DashboardItem>
    ))}
  </DashboardLayout>
);
