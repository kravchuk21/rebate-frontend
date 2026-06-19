"use client";

import { Card, Typography } from "@heroui/react";
import { useTranslations } from "next-intl";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";

interface Step {
  title: string;
  description: string;
}

export const LandingHowItWorks = () => {
  const t = useTranslations("landing");
  const steps = t.raw("howItWorks.steps") as Step[];

  return (
    <section className="w-full">
      <div className="mb-12 flex flex-col items-center gap-2 text-center">
        <Typography.Heading className="text-3xl font-extrabold tracking-tight md:text-4xl">
          {t("howItWorks.title")}
        </Typography.Heading>
        <Typography.Paragraph color="muted">{t("howItWorks.subtitle")}</Typography.Paragraph>
      </div>

      <DashboardLayout>
        {steps.map((step) => (
          <DashboardItem span={4}>
            <Card key={step.title} className="h-full">
              <Card.Header>
                <Card.Title>{step.title}</Card.Title>
                <Card.Description>
                  {step.description}
                </Card.Description>
              </Card.Header>
            </Card>
          </DashboardItem>
        ))}
      </DashboardLayout>
    </section>
  );
};
