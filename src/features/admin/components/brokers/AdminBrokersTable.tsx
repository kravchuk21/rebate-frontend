"use client";

import "@/shared/api/instance";

import { useEffect, useMemo, useState } from "react";
import { AlertDialog, Button, ButtonGroup, toast } from "@heroui/react";
import { useTranslations } from "next-intl";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pencil, Plus, TrashBin } from "@gravity-ui/icons";

import type { BrokerResponse } from "@/shared/api/generated/types.gen";
import { DataTable } from "@/shared/components/DataTable";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";
import { useModal } from "@/shared/hooks/useModal";
import { Modals } from "@/shared/lib/routes";

import { useBrokers } from "@/features/broker/hooks/useBrokers";
import { getAdminErrorMessage } from "../../lib/getAdminErrorMessage";
import { useAdminDeleteBroker } from "../../hooks/useAdminDeleteBroker";
import { BrokerFormModal } from "./BrokerFormModal";

// The public broker list returns `rebate_rate` and `uid_format_regex` even though
// the generated `BrokerResponse` type omits them; widen it locally so edit can
// prefill those fields.
type AdminBrokerRow = BrokerResponse & {
  rebate_rate?: string;
  uid_format_regex?: string;
};

const columnHelper = createColumnHelper<AdminBrokerRow>();

export const AdminBrokersTable = () => {
  const t = useTranslations("admin.brokers");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const brokerForm = useModal(Modals.BrokerForm);

  const { data, isError } = useBrokers();

  useEffect(() => {
    if (isError) toast.danger(t("errors.loadFailed"));
  }, [isError, t]);

  const deleteBroker = useAdminDeleteBroker();

  // The response interceptor in `@/shared/api/instance` unwraps the `{ data: ... }`
  // envelope, so `data.data` is already the broker array.
  const brokers = useMemo(() => (data?.data as AdminBrokerRow[] | undefined) ?? [], [data]);

  const handleDelete = (brokerID: string) => {
    deleteBroker.mutate(
      { path: { brokerID } },
      {
        onSuccess: () => setDeleteTarget(null),
        onError: (error) => toast.danger(getAdminErrorMessage(error) ?? t("errors.deleteFailed")),
      },
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("columns.name"),
        cell: (info) => info.getValue() ?? "—",
      }),
      columnHelper.accessor("slug", {
        header: t("columns.slug"),
        cell: (info) => info.getValue() ?? "—",
      }),
      columnHelper.display({
        id: "actions",
        header: t("columns.actions"),
        cell: ({ row }) => {
          const broker = row.original;
          return (
            <ButtonGroup size="sm" variant="tertiary">
              <Button
                variant="tertiary"
                onPress={() =>
                  broker.id &&
                  brokerForm.open({
                    brokerID: broker.id,
                    name: broker.name ?? "",
                    slug: broker.slug ?? "",
                    rebateRate: broker.rebate_rate ?? "",
                    uidFormatRegex: broker.uid_format_regex ?? "",
                  })
                }
              >
                <Pencil />
              </Button>
              <Button variant="tertiary" onPress={() => setDeleteTarget(broker.id ?? null)}>
                <ButtonGroup.Separator />
                <TrashBin />
              </Button>
            </ButtonGroup>
          );
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, brokerForm.open],
  );

  const table = useReactTable({
    data: brokers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row, index) => row.id ?? String(index),
  });

  return (
    <DashboardLayout>
      <DashboardItem>
        <div className="flex items-center justify-end">
          <Button variant="outline" onPress={() => brokerForm.open()}>
            <Plus />
            {t("addBroker")}
          </Button>
        </div>
      </DashboardItem>

      <DashboardItem>
        <DataTable
          table={table}
          ariaLabel={t("title")}
          emptyLabel={t("emptyDesc")}
          rowHeaderColumnId="name"
        />
      </DashboardItem>

      <AlertDialog
        isOpen={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Heading>{t("delete.confirmTitle")}</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <p>{t("delete.confirmDesc")}</p>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button variant="tertiary" slot="close">
                  {t("delete.cancel")}
                </Button>
                <Button
                  variant="primary"
                  onPress={() => deleteTarget && handleDelete(deleteTarget)}
                  isDisabled={deleteBroker.isPending}
                >
                  {t("delete.confirm")}
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>

      <BrokerFormModal />
    </DashboardLayout>
  );
};
