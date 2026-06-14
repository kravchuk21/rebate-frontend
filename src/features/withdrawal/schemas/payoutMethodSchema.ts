import { z } from 'zod';

import { validateAddress, type Network } from '../lib/validateAddress';

const networks = ['TRC20', 'ERC20', 'BEP20', 'SOL'] as const;

export const createPayoutMethodSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z.string().min(1, t('withdrawal.payoutMethods.form.validation.name')),
      network: z.enum(networks, {
        message: t('withdrawal.payoutMethods.form.validation.network'),
      }),
      address: z.string().min(1, t('withdrawal.payoutMethods.form.validation.address')),
    })
    .refine((data) => validateAddress(data.network as Network, data.address), {
      message: t('withdrawal.payoutMethods.form.validation.addressInvalid'),
      path: ['address'],
    });

export type PayoutMethodFormValues = z.infer<ReturnType<typeof createPayoutMethodSchema>>;
