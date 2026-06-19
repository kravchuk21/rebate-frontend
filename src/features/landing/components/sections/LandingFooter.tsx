"use client";

import { Typography, Link } from "@heroui/react";
import { useTranslations } from "next-intl";

import { Routes } from "@/shared/lib/routes";
import { LocaleSwitcher } from "@/shared/components/LocaleSwitcher";
import { ThemeSwitcher } from "@/shared/components/dashboard/ThemeSwitcher";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";

export const LandingFooter = () => {
  const t = useTranslations("landing");

  return (
    <footer>
      <DashboardLayout>
        <DashboardItem span={6} className="flex flex-col gap-2">
          <Typography.Paragraph className="font-semibold">
            Sliceback
          </Typography.Paragraph>
          <Typography.Paragraph color="muted" size="sm">
            {t("footer.tagline")}
          </Typography.Paragraph>
        </DashboardItem>

        <DashboardItem span={6} className="flex flex-col gap-2 md:items-end">
          <Typography.Paragraph size="sm" className="font-medium">
            {t("footer.resources")}
          </Typography.Paragraph>
          <div className="flex gap-6">
            <Link href={Routes.Blog}>
              {t("blog")}
              <Link.Icon />
            </Link>
            <Link href={Routes.Faq}>
              {t("faq")}
              <Link.Icon />
            </Link>
          </div>
        </DashboardItem>

        <DashboardItem className="flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Typography.Paragraph color="muted" size="xs">
            © {new Date().getFullYear()} Sliceback. {t("footer.rights")}
          </Typography.Paragraph>
          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <ThemeSwitcher />
          </div>
        </DashboardItem>
      </DashboardLayout>
    </footer>
  );
};
