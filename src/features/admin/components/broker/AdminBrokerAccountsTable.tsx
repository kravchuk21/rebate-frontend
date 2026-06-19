"use client";

import "@/shared/api/instance";

import { useEffect, useMemo, useState } from "react";
import { Button, ButtonGroup, ToggleButton, ToggleButtonGroup, toast } from "@heroui/react";
import { useLocale, useTranslations } from "next-intl";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import type { BrokerAccountDetailResponse } from "@/shared/api/generated/types.gen";
import { AccountStatusChip } from "@/features/broker/components/AccountStatusChip";
import { DataTable } from "@/shared/components/DataTable";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";
import { formatDateYMD } from "@/shared/lib/formatDate";

import { getAdminErrorMessage } from "../../lib/getAdminErrorMessage";
import { useAdminApproveBrokerAccount } from "../../hooks/useAdminApproveBrokerAccount";
import { useAdminBrokerAccounts } from "../../hooks/useAdminBrokerAccounts";
import { useAdminRejectBrokerAccount } from "../../hooks/useAdminRejectBrokerAccount";
import { useAdminRevokeBrokerAccount } from "../../hooks/useAdminRevokeBrokerAccount";
import { RejectReasonModal } from "./RejectReasonModal";
import { Check, CircleXmark, ArrowRotateLeft } from "@gravity-ui/icons";

const LIMIT = 20;

const STATUSES = ["pending", "approved", "rejected", "revoked"] as const;

const columnHelper = createColumnHelper<BrokerAccountDetailResponse>();

export const AdminBrokerAccountsTable = () => {
  const t = useTranslations("admin.brokerAccounts");
  const locale = useLocale();
  const [status, setStatus] = useState<string | null>("pending");
  const [offset, setOffset] = useState(0);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);

  const { data, isError } = useAdminBrokerAccounts({
    status: status ?? undefined,
    limit: LIMIT,
    offset,
  });

  useEffect(() => {
    if (isError) toast.danger(t("errors.loadFailed"));
  }, [isError, t]);

  const approveAccount = useAdminApproveBrokerAccount();
  const rejectAccount = useAdminRejectBrokerAccount();
  const revokeAccount = useAdminRevokeBrokerAccount();

  const responseData = data?.data as
    | { items?: BrokerAccountDetailResponse[]; total_count?: number }
    | undefined;
  const accounts = useMemo(() => responseData?.items ?? [], [responseData]);
  const totalCount = responseData?.total_count ?? 0;

  const handleStatusChange = (key: string | null) => {
    setStatus(key === "all" || key === null ? null : key);
    setOffset(0);
  };

  const handleApprove = (accountID: string) => {
    approveAccount.mutate({ path: { accountID } });
  };

  const handleReject = (reason: string) => {
    if (!rejectTarget) return;
    rejectAccount.mutate(
      { path: { accountID: rejectTarget }, body: { reason } },
      { onSuccess: () => setRejectTarget(null) },
    );
  };

  const handleRevoke = (reason: string) => {
    if (!revokeTarget) return;
    revokeAccount.mutate(
      { path: { accountID: revokeTarget }, body: { reason } },
      { onSuccess: () => setRevokeTarget(null) },
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "broker",
        header: t("columns.broker"),
        cell: ({ row }) => row.original.broker?.name ?? "—",
      }),
      columnHelper.accessor("uid", {
        header: t("columns.uid"),
        cell: (info) => info.getValue() ?? "—",
      }),
      columnHelper.accessor("status", {
        header: t("columns.status"),
        cell: (info) => <AccountStatusChip status={info.getValue() ?? ""} />,
      }),
      columnHelper.accessor("created_at", {
        header: t("columns.submittedAt"),
        cell: (info) => {
          const v = info.getValue();
          return v ? formatDateYMD(v, locale) : "—";
        },
      }),
      columnHelper.display({
        id: "actions",
        header: t("columns.actions"),
        cell: ({ row }) => {
          const account = row.original;
          return (
            <ButtonGroup size="sm" variant="tertiary">
              {account.status === "pending" && (
                <>
                  <Button
                    variant="tertiary"
                    onPress={() => account.id && handleApprove(account.id)}
                  >
                    <Check />
                  </Button>
                  <Button variant="tertiary" onPress={() => setRejectTarget(account.id ?? null)}>
                    <ButtonGroup.Separator />
                    <CircleXmark />
                  </Button>
                </>
              )}
              {account.status === "approved" && (
                <Button variant="tertiary" onPress={() => setRevokeTarget(account.id ?? null)}>
                  <ArrowRotateLeft />
                </Button>
              )}
            </ButtonGroup>
          );
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, locale],
  );

  const table = useReactTable({
    data: accounts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row, index) => row.id ?? String(index),
  });

  return (
    <DashboardLayout>
      <DashboardItem>
        <ToggleButtonGroup
          fullWidth
          aria-label={t("tabs.pending")}
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[status ?? "all"]}
          onSelectionChange={(keys) => handleStatusChange(String([...keys][0] ?? "all"))}
          size="sm"
        >
          <ToggleButton id="all">{t("tabs.all")}</ToggleButton>
          {STATUSES.map((s) => (
            <ToggleButton key={s} id={s}>
              {t(`tabs.${s}`)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
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

      <RejectReasonModal
        type="reject"
        isOpen={rejectTarget !== null}
        isPending={rejectAccount.isPending}
        error={rejectAccount.error}
        errorMessage={getAdminErrorMessage(rejectAccount.error) ?? t("errors.rejectFailed")}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        onSubmit={handleReject}
      />

      <RejectReasonModal
        type="revoke"
        isOpen={revokeTarget !== null}
        isPending={revokeAccount.isPending}
        error={revokeAccount.error}
        errorMessage={getAdminErrorMessage(revokeAccount.error) ?? t("errors.revokeFailed")}
        onOpenChange={(open) => !open && setRevokeTarget(null)}
        onSubmit={handleRevoke}
      />
    </DashboardLayout>
  );
};
