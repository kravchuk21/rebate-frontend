import { z } from 'zod';

export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.email(t('auth.errors.email')),
    password: z.string().min(8, t('auth.errors.passwordMin')),
  });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
