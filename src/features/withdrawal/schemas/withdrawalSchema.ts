import { z } from "zod";

export const createWithdrawalSchema = (t: (key: string) => string) =>
  z.object({
    payout_method_id: z.string().min(1, t("withdrawal.request.validation.method")),
    amount: z
      .string()
      .min(1, t("withdrawal.request.validation.amount"))
      .refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
        message: t("withdrawal.request.validation.amount"),
      }),
  });

export type WithdrawalFormValues = z.infer<ReturnType<typeof createWithdrawalSchema>>;
