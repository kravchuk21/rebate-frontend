"use client";

import { Chip } from "@heroui/react";
import { useTranslations } from "next-intl";

const colorMap: Record<string, "success" | "accent" | "danger" | "warning" | "default"> = {
  rebate_credit: "success",
  referral_credit: "accent",
  withdrawal_debit: "danger",
  withdrawal_freeze: "warning",
  withdrawal_unfreeze: "default",
  adjustment: "warning",
};

const ledgerTypes = [
  "rebate_credit",
  "referral_credit",
  "withdrawal_debit",
  "withdrawal_freeze",
  "withdrawal_unfreeze",
  "adjustment",
] as const;

interface LedgerTypeChipProps {
  type: string;
}

export const LedgerTypeChip = ({ type }: LedgerTypeChipProps) => {
  const t = useTranslations("withdrawal.ledger.type");

  const label = (ledgerTypes as readonly string[]).includes(type)
    ? t(type as (typeof ledgerTypes)[number])
    : type;

  return <Chip color={colorMap[type] ?? "default"}>{label}</Chip>;
};
