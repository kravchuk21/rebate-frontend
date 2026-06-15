import { z } from 'zod';

export const changeReferrerSchema = z.object({
  referrer_id: z.string(),
});

export type ChangeReferrerFormValues = z.infer<typeof changeReferrerSchema>;
