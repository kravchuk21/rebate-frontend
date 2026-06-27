"use client";

import { Chip, Typography } from "@heroui/react";
import { useTranslations } from "next-intl";

import { AuthModalTrigger } from "@/features/auth/components/AuthModalTrigger";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";

export const LandingHero = () => {
  const t = useTranslations("landing");

  return (
    <DashboardLayout className="flex flex-col items-center">
      <DashboardItem>
        <Chip variant="soft" color="success">
          <Chip.Label>{t("badge")}</Chip.Label>
        </Chip>
      </DashboardItem>
      <DashboardItem>
        <Typography.Heading className="text-center text-4xl font-extrabold md:text-6xl">
          {t("tagline")}
        </Typography.Heading>
      </DashboardItem>
      <DashboardItem>
        <Typography.Paragraph color="muted" className="text-center">
          {t("description")}
        </Typography.Paragraph>
      </DashboardItem>
      <DashboardItem>
        <AuthModalTrigger />
      </DashboardItem>
      <DashboardItem>
        <Typography.Paragraph color="muted" size="sm">
          {t("heroNote")}
        </Typography.Paragraph>
      </DashboardItem>
    </DashboardLayout>
  );
};
