import { z } from 'zod';

export const createAdjustBalanceSchema = (t: (key: string) => string) =>
  z.object({
    amount: z
      .string()
      .min(1, t('admin.users.adjustBalance.validation.amount'))
      .refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) !== 0, {
        message: t('admin.users.adjustBalance.validation.amountNonZero'),
      }),
    reason: z.string().min(1, t('admin.users.adjustBalance.validation.reason')),
  });

export type AdjustBalanceFormValues = z.infer<ReturnType<typeof createAdjustBalanceSchema>>;
