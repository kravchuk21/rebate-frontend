import { z } from 'zod';

export const createImportBrokerDataSchema = (t: (key: string) => string) =>
  z.object({
    broker_account_id: z.string().min(1, t('admin.rebate.import.validation.brokerAccount')),
    date: z.string().min(1, t('admin.rebate.import.validation.date')),
    volume: z.string(),
    gross_rebate: z.string().min(1, t('admin.rebate.import.validation.grossRebate')),
  });

export type ImportBrokerDataFormValues = z.infer<ReturnType<typeof createImportBrokerDataSchema>>;
