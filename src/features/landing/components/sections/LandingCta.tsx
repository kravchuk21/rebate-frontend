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
            <Typography.Heading level={4} className="text-center">
              {t("cta.title")}
            </Typography.Heading>
          </DashboardItem>
          <DashboardItem>
            <Card.Description className="text-center">
              {t("cta.description")}
            </Card.Description>
          </DashboardItem>
          <DashboardItem>
            <AuthModalTrigger />
          </DashboardItem>
        </DashboardLayout>
      </Card.Content>
    </Card>
  );
};
