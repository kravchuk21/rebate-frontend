"use client";

import "@/shared/api/instance";

import { useMemo, useState } from "react";
import { Button, DateField, Label, Modal, TextArea, TextField, toast, Typography } from "@heroui/react";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { useTranslations } from "next-intl";

import type { RebateAdminBatchImportResult } from "@/shared/api/generated/types.gen";
import { BaseModal } from "@/shared/components/BaseModal";
import { useModal } from "@/shared/hooks/useModal";
import { Modals } from "@/shared/lib/routes";

import { getAdminErrorMessage } from "../../lib/getAdminErrorMessage";
import { useAdminImportBrokerData } from "../../hooks/useAdminImportBrokerData";
import { parseBatchImport, rowsToItems } from "../../lib/parseBatchImport";
import { DashboardItem, DashboardLayout } from "@/shared/components/layout";

export const ImportBrokerDataModal = () => {
  const t = useTranslations();
  const ti = useTranslations("admin.rebate.import");
  const { isOpen, close } = useModal(Modals.ImportBrokerData);
  const importBrokerData = useAdminImportBrokerData();

  const [date, setDate] = useState(() => today(getLocalTimeZone()).toString());
  const [raw, setRaw] = useState("");

  const rows = useMemo(() => parseBatchImport(raw, (key) => ti(`validation.${key}`)), [raw, ti]);
  const validRows = rows.filter((row) => !row.error);
  const invalidCount = rows.length - validRows.length;
  const firstError = rows.find((row) => row.error)?.error;
  const canSubmit =
    Boolean(date) && validRows.length > 0 && invalidCount === 0 && !importBrokerData.isPending;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDate(today(getLocalTimeZone()).toString());
      setRaw("");
      importBrokerData.reset();
      close();
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    importBrokerData.mutate(
      { body: { date, items: rowsToItems(rows) } },
      {
        onSuccess: (response) => {
          const result = (response.data as { data?: RebateAdminBatchImportResult } | undefined)
            ?.data;
          toast.success(
            ti("imported", {
              calculated: result?.calculated ?? validRows.length,
              failed: result?.failed ?? 0,
            }),
          );
          handleOpenChange(false);
        },
        onError: (error) => {
          toast.danger(getAdminErrorMessage(error) ?? t("admin.rebate.errors.importFailed"));
        },
      },
    );
  };

  return (
    <BaseModal isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Header>
        <Modal.Heading>{ti("title")}</Modal.Heading>
      </Modal.Header>
      <Modal.Body className="flex flex-col gap-4">
        <DashboardLayout>
          <DashboardItem>
            <DateField
              value={date ? parseDate(date) : null}
              onChange={(value) => setDate(value?.toString() ?? "")}
              isRequired
              fullWidth
            >
              <Label>{ti("date")}</Label>
              <DateField.Group variant="secondary">
                <DateField.Input>
                  {(segment) => <DateField.Segment segment={segment} />}
                </DateField.Input>
              </DateField.Group>
            </DateField>
          </DashboardItem>

          <DashboardItem>
            <TextField isRequired value={raw} onChange={setRaw} fullWidth>
              <Label>{ti("paste")}</Label>
              <TextArea
                variant="secondary"
                rows={6}
                placeholder={ti("pastePlaceholder")}
              />
            </TextField>
          </DashboardItem>

          <DashboardItem>
            <Typography.Paragraph size="xs" color="muted">{ti("pasteHint")}</Typography.Paragraph>
          </DashboardItem>

          {rows.length > 0 && (
            <DashboardItem>
              <Typography.Paragraph size="xs" color="muted">
                {ti("validCount")}: <span className="text-success">{validRows.length}</span>
                {invalidCount > 0 && (
                  <>
                    {" · "}
                    {ti("invalidCount")}: <span className="text-danger">{invalidCount}</span>
                    {firstError && <span className="text-danger"> - {firstError}</span>}
                  </>
                )}
              </Typography.Paragraph>
            </DashboardItem>
          )}
        </DashboardLayout>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="tertiary" slot="close">
          {t("admin.brokerAccounts.reject.cancel")}
        </Button>
        <Button type="button" variant="primary" isDisabled={!canSubmit} onPress={handleSubmit}>
          {ti("submit")}
        </Button>
      </Modal.Footer>
    </BaseModal>
  );
};
