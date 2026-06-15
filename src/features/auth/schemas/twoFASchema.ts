import { z } from 'zod';

export const createTwoFASchema = (t: (key: string) => string) =>
  z.object({
    code: z.string().min(6, t('twoFA.errors.codeRequired')).max(20),
  });

export type TwoFAFormValues = z.infer<ReturnType<typeof createTwoFASchema>>;
