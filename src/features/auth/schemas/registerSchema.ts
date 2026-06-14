import { z } from 'zod';

export const createRegisterSchema = (t: (key: string) => string) =>
  z.object({
    email: z.email(t('auth.errors.email')),
    password: z.string().min(8, t('auth.errors.passwordMin')),
    referral_code: z.string().optional(),
  });

export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;
