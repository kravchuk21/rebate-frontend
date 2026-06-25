"use client";

import "@/shared/api/instance";

import { useEffect, useMemo, useState } from "react";
import { Button, toast } from "@heroui/react";
import { useLocale, useTranslations } from "next-intl";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pencil } from "@gravity-ui/icons";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";

import type { RebateCalculationResponse } from "@/shared/api/generated/types.gen";
import { formatAmount } from "@/features/withdrawal/lib/formatAmount";
import { RebateStatusChip } from "@/features/rebate/components/RebateStatusChip";
import { formatPeriodDate } from "@/features/rebate/lib/formatPeriodDate";
import { DataTable } from "@/shared/components/DataTable";
import { useModal } from "@/shared/hooks/useModal";
import { Modals } from "@/shared/lib/routes";

import { useAdminCalculations } from "../../hooks/useAdminCalculations";
import { AdjustCalculationModal } from "./AdjustCalculationModal";
import { ImportBrokerDataModal } from "./ImportBrokerDataModal";

const LIMIT = 20;

const columnHelper = createColumnHelper<RebateCalculationResponse>();

export const AdminCalculationsTable = () => {
  const t = useTranslations("admin.rebate");
  const locale = useLocale();
  const [offset, setOffset] = useState(0);
  const { open: openImport } = useModal(Modals.ImportBrokerData);
  const { open: openAdjust } = useModal(Modals.AdjustCalculation);

  const { data, isError } = useAdminCalculations({ limit: LIMIT, offset });

  useEffect(() => {
    if (isError) toast.danger(t("errors.loadFailed"));
  }, [isError, t]);

  const responseData = data?.data as
    | { items?: RebateCalculationResponse[]; total_count?: number }
    | undefined;
  const calculations = responseData?.items ?? [];
  const totalCount = responseData?.total_count ?? 0;

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "broker",
        header: t("columns.broker"),
        cell: ({ row }) => row.original.broker_account?.broker_name ?? "—",
      }),
      columnHelper.display({
        id: "uid",
        header: t("columns.uid"),
        cell: ({ row }) => row.original.broker_account?.uid ?? "—",
      }),
      columnHelper.accessor("period_date", {
        header: t("columns.period"),
        cell: (info) => formatPeriodDate(info.getValue(), locale),
      }),
      columnHelper.accessor("gross_rebate", {
        header: t("columns.grossRebate"),
        cell: (info) => `${formatAmount(info.getValue())} USDT`,
      }),
      columnHelper.accessor("user_payout_amount", {
        header: t("columns.payout"),
        cell: (info) => `${formatAmount(info.getValue())} USDT`,
      }),
      columnHelper.accessor("status", {
        header: t("columns.status"),
        cell: (info) => <RebateStatusChip status={info.getValue() ?? ""} />,
      }),
      columnHelper.display({
        id: "actions",
        header: t("columns.actions"),
        cell: ({ row }) => (
          <Button
            isIconOnly
            variant="tertiary"
            size="sm"
            onPress={() =>
              openAdjust({
                calculationID: row.original.id ?? "",
                gross: String(row.original.gross_rebate ?? ""),
              })
            }
          >
            <Pencil />
          </Button>
        ),
      }),
    ],
    [t, locale, openAdjust],
  );

  const table = useReactTable({
    data: calculations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row, index) => row.id ?? String(index),
  });

  return (
    <DashboardLayout>
      <DashboardItem>
        <div className="flex items-center justify-end">
          <Button onPress={() => openImport()}>
            {t("import.title")}
          </Button>
        </div>
      </DashboardItem>

      <DashboardItem>
        <DataTable
          table={table}
          ariaLabel={t("title")}
          emptyLabel={t("emptyDesc")}
          rowHeaderColumnId="broker"
          pagination={{ offset, limit: LIMIT, totalCount, onOffsetChange: setOffset }}
        />
      </DashboardItem>

      <ImportBrokerDataModal />
      <AdjustCalculationModal />
    </DashboardLayout>
  );
};
