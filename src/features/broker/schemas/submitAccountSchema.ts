import { z } from 'zod';

export const createSubmitAccountSchema = (t: (key: string) => string) =>
  z.object({
    broker_id: z.string().min(1, t('accounts.submit.validation.broker')),
    uid: z.string().min(1, t('accounts.submit.validation.uid')),
  });

export type SubmitAccountFormValues = z.infer<ReturnType<typeof createSubmitAccountSchema>>;
