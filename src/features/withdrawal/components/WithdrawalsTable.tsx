"use client";

import "@/shared/api/instance";

import { useEffect, useMemo, useState } from "react";
import { AlertDialog, Alert, Button, toast } from "@heroui/react";
import { useLocale, useTranslations } from "next-intl";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { getErrorMessage } from "@/features/auth/lib/getErrorMessage";
import type { WithdrawalResponse } from "@/shared/api/generated/types.gen";
import { DataTable } from "@/shared/components/DataTable";

import { useCancelWithdrawal } from "../hooks/useCancelWithdrawal";
import { useWithdrawals } from "../hooks/useWithdrawals";
import { formatAmount } from "../lib/formatAmount";
import { truncateAddress } from "../lib/validateAddress";
import { WithdrawalStatusChip } from "./WithdrawalStatusChip";

const LIMIT = 20;

const columnHelper = createColumnHelper<WithdrawalResponse>();

export const WithdrawalsTable = () => {
  const t = useTranslations("withdrawal.history");
  const locale = useLocale();
  const [offset, setOffset] = useState(0);
  const { data, isError } = useWithdrawals(LIMIT, offset);
  const cancelWithdrawal = useCancelWithdrawal();
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  useEffect(() => {
    if (isError) toast.danger(t("errors.loadFailed"));
  }, [isError, t]);

  const responseData = data?.data as
    | { items?: WithdrawalResponse[]; total_count?: number }
    | undefined;
  const withdrawals = responseData?.items ?? [];
  const totalCount = responseData?.total_count ?? 0;

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }),
    [locale],
  );

  const handleCancel = (id: string) => {
    cancelWithdrawal.mutate(
      { path: { withdrawalID: id } },
      {
        onSuccess: () => setCancelTarget(null),
      },
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "method",
        header: t("columns.method"),
        cell: ({ row }) => {
          const { payout_method } = row.original;
          return payout_method ? `${payout_method.name} (${payout_method.network})` : "—";
        },
      }),
      columnHelper.accessor("amount_requested", {
        header: t("columns.amount"),
        cell: (info) => `${formatAmount(info.getValue())} USDT`,
      }),
      columnHelper.accessor("network_fee", {
        header: t("columns.fee"),
        cell: (info) => {
          const v = info.getValue();
          return v != null ? `${formatAmount(v)} USDT` : "—";
        },
      }),
      columnHelper.accessor("amount_to_send", {
        header: t("columns.youReceive"),
        cell: (info) => {
          const v = info.getValue();
          return v != null ? `${formatAmount(v)} USDT` : "—";
        },
      }),
      columnHelper.accessor("status", {
        header: t("columns.status"),
        cell: (info) => <WithdrawalStatusChip status={info.getValue() ?? ""} />,
      }),
      columnHelper.accessor("requested_at", {
        header: t("columns.date"),
        cell: (info) => {
          const v = info.getValue();
          return v ? dateFormatter.format(new Date(v)) : "—";
        },
      }),
      columnHelper.accessor("tx_hash", {
        header: t("columns.txHash"),
        cell: (info) => {
          const v = info.getValue();
          return v ? truncateAddress(v) : "—";
        },
      }),
      columnHelper.display({
        id: "cancel",
        header: t("cancel"),
        cell: ({ row }) => {
          const withdrawal = row.original;
          return withdrawal.status === "pending" && withdrawal.id ? (
            <Button
              variant="tertiary"
              size="sm"
              onPress={() => setCancelTarget(withdrawal.id ?? null)}
            >
              {t("cancel")}
            </Button>
          ) : null;
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, dateFormatter],
  );

  const table = useReactTable({
    data: withdrawals,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row, index) => row.id ?? String(index),
  });

  if (isError) return null;

  return (
    <>
      <DataTable
        table={table}
        ariaLabel={t("title")}
        emptyLabel={t("empty")}
        rowHeaderColumnId="method"
        pagination={{ offset, limit: LIMIT, totalCount, onOffsetChange: setOffset }}
      />

      <AlertDialog
        isOpen={cancelTarget !== null}
        onOpenChange={(open) => !open && setCancelTarget(null)}
      >
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Heading>{t("cancelConfirm")}</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body className="flex flex-col gap-3">
                {cancelWithdrawal.isError && (
                  <Alert status="danger">
                    <Alert.Content>
                      <Alert.Description>
                        {getErrorMessage(cancelWithdrawal.error) ?? t("errors.cancelFailed")}
                      </Alert.Description>
                    </Alert.Content>
                  </Alert>
                )}
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button variant="tertiary" slot="close">
                  {t("cancel")}
                </Button>
                <Button
                  variant="primary"
                  onPress={() => cancelTarget && handleCancel(cancelTarget)}
                  isDisabled={cancelWithdrawal.isPending}
                >
                  {t("cancel")}
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </>
  );
};
