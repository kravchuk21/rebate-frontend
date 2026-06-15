import { z } from 'zod';

export const createReasonSchema = (message: string) =>
  z.object({
    reason: z.string().min(1, message),
  });

export type ReasonFormValues = z.infer<ReturnType<typeof createReasonSchema>>;
