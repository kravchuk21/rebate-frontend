import { z } from 'zod';

export const createAdjustCalculationSchema = (t: (key: string) => string) =>
  z.object({
    new_gross_rebate: z.string().min(1, t('admin.rebate.adjust.validation.newGrossRebate')),
    reason: z.string().min(1, t('admin.rebate.adjust.validation.reason')),
  });

export type AdjustCalculationFormValues = z.infer<ReturnType<typeof createAdjustCalculationSchema>>;
