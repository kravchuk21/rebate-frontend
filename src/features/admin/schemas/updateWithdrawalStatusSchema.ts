import { z } from "zod";

export const createUpdateWithdrawalStatusSchema = (t: (key: string) => string) =>
  z
    .object({
      status: z.string().min(1, t("admin.withdrawals.updateStatus.validation.status")),
      tx_hash: z.string().optional(),
      reason: z.string().optional(),
      admin_note: z.string().optional(),
    })
    .refine((data) => data.status !== "completed" || !!data.tx_hash?.trim(), {
      message: t("admin.withdrawals.updateStatus.validation.txHash"),
      path: ["tx_hash"],
    })
    .refine((data) => data.status !== "rejected" || !!data.reason?.trim(), {
      message: t("admin.withdrawals.updateStatus.validation.reason"),
      path: ["reason"],
    });

export type UpdateWithdrawalStatusFormValues = z.infer<
  ReturnType<typeof createUpdateWithdrawalStatusSchema>
>;
