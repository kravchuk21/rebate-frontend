"use client";

import { useEffect, useMemo, useState } from "react";
import { Chip, toast } from "@heroui/react";
import { useLocale, useTranslations } from "next-intl";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import type { ReferralEntryResponse } from "@/shared/api/generated/types.gen";
import { DataTable } from "@/shared/components/DataTable";
import { formatAmount } from "@/features/withdrawal/lib/formatAmount";

import { useMyReferrals } from "../hooks/useMyReferrals";

const LIMIT = 20;

const statusColorMap: Record<string, "success" | "danger" | "default"> = {
  active: "success",
  suspended: "danger",
};

const columnHelper = createColumnHelper<ReferralEntryResponse>();

export const ReferralsTable = () => {
  const t = useTranslations("referrals.table");
  const tErrors = useTranslations("referrals.errors");
  const locale = useLocale();
  const [offset, setOffset] = useState(0);
  const { data, isError } = useMyReferrals(LIMIT, offset);

  useEffect(() => {
    if (isError) toast.danger(tErrors("loadFailed"));
  }, [isError, tErrors]);

  const responseData = data?.data as
    | { items?: ReferralEntryResponse[]; total_count?: number }
    | undefined;
  const items = responseData?.items ?? [];
  const totalCount = responseData?.total_count ?? 0;

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }),
    [locale],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("email", {
        header: t("columns.email"),
        cell: (info) => info.getValue() ?? "—",
      }),
      columnHelper.accessor("joined_at", {
        header: t("columns.joinedAt"),
        cell: (info) => {
          const v = info.getValue();
          return v ? dateFormatter.format(new Date(v)) : "—";
        },
      }),
      columnHelper.accessor("status", {
        header: t("columns.status"),
        cell: (info) => {
          const status = info.getValue();
          return <Chip color={statusColorMap[status ?? ""] ?? "default"}>{status ?? "—"}</Chip>;
        },
      }),
      columnHelper.accessor("total_earned", {
        header: t("columns.earned"),
        cell: (info) => `${formatAmount(info.getValue())} USDT`,
      }),
    ],
    [t, dateFormatter],
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row, index) => row.user_id ?? String(index),
  });

  if (isError) return null;

  return (
    <DataTable
      table={table}
      ariaLabel={t("title")}
      emptyLabel={t("emptyDesc")}
      rowHeaderColumnId="email"
      pagination={{ offset, limit: LIMIT, totalCount, onOffsetChange: setOffset }}
    />
  );
};
