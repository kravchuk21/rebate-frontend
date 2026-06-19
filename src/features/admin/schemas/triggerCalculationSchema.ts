import { z } from "zod";

export const triggerCalculationSchema = z.object({
  broker_account_id: z.string().min(1),
  date: z.string().min(1),
});

export type TriggerCalculationFormValues = z.infer<typeof triggerCalculationSchema>;
