"use client";

import { Chip } from "@heroui/react";
import { useTranslations } from "next-intl";

const colorMap: Record<string, "success" | "accent" | "danger" | "warning" | "default"> = {
  pending: "warning",
  processing: "accent",
  completed: "success",
  rejected: "danger",
  cancelled: "default",
};

const statuses = ["pending", "processing", "completed", "rejected", "cancelled"] as const;

interface WithdrawalStatusChipProps {
  status: string;
}

export const WithdrawalStatusChip = ({ status }: WithdrawalStatusChipProps) => {
  const t = useTranslations("withdrawal.history.status");

  const label = (statuses as readonly string[]).includes(status)
    ? t(status as (typeof statuses)[number])
    : status;

  return <Chip color={colorMap[status] ?? "default"}>{label}</Chip>;
};
