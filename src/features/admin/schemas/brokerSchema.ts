import { z } from "zod";

export const createBrokerSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("admin.brokers.form.validation.name")),
    slug: z.string().min(1, t("admin.brokers.form.validation.slug")),
    rebate_rate: z
      .string()
      .min(1, t("admin.brokers.form.validation.rebateRate"))
      .refine((value) => !isNaN(parseFloat(value)), {
        message: t("admin.brokers.form.validation.rebateRate"),
      }),
    uid_format_regex: z.string().optional(),
  });

export type BrokerFormValues = z.infer<ReturnType<typeof createBrokerSchema>>;
