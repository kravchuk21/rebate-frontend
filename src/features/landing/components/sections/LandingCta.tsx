"use client";

import { Card, Typography } from "@heroui/react";
import { useTranslations } from "next-intl";

import { AuthModalTrigger } from "@/features/auth/components/AuthModalTrigger";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";

export const LandingCta = () => {
  const t = useTranslations("landing");

  return (
    <Card>
      <Card.Content>
        <DashboardLayout>
          <DashboardItem>
            <Typography.Heading className="text-center">
              {t("cta.title")}
            </Typography.Heading>
          </DashboardItem>
          <DashboardItem className="text-center">
            <Typography.Paragraph color="muted">
              {t("cta.description")}
            </Typography.Paragraph>
          </DashboardItem>
          <DashboardItem>
            <AuthModalTrigger />
          </DashboardItem>
        </DashboardLayout>
      </Card.Content>
    </Card>
  );
};
