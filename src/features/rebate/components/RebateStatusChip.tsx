"use client";

import { Chip } from "@heroui/react";
import { useTranslations } from "next-intl";

const colorMap: Record<string, "success" | "accent" | "danger" | "warning" | "default"> = {
  calculated: "success",
  paid: "accent",
  pending_data: "warning",
  adjusted: "default",
};

const statuses = ["calculated", "paid", "pending_data", "adjusted"] as const;

interface RebateStatusChipProps {
  status: string;
}

export const RebateStatusChip = ({ status }: RebateStatusChipProps) => {
  const t = useTranslations("rebate.status");

  const label = (statuses as readonly string[]).includes(status)
    ? t(status as (typeof statuses)[number])
    : status;

  return <Chip color={colorMap[status] ?? "default"}>{label}</Chip>;
};
