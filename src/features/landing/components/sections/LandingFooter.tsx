"use client";

import { Typography, Link } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";

import { cn } from "@/shared/lib/cn";
import { Routes } from "@/shared/lib/routes";
import { LocaleSwitcher } from "@/shared/components/LocaleSwitcher";
import { ThemeSwitcher } from "@/shared/components/dashboard/ThemeSwitcher";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sliceback.trade";

const AI_PROVIDERS = [
  {
    name: "ChatGPT",
    icon: "simple-icons:openai",
    buildUrl: (prompt: string) =>
      `https://chatgpt.com/?hints=search&q=${prompt}`,
  },
  {
    name: "Claude",
    icon: "simple-icons:claude",
    buildUrl: (prompt: string) => `https://claude.ai/new?q=${prompt}`,
  },
  {
    name: "Perplexity",
    icon: "simple-icons:perplexity",
    buildUrl: (prompt: string) =>
      `https://www.perplexity.ai/search?q=${prompt}`,
  },
  {
    name: "Gemini",
    icon: "simple-icons:googlegemini",
    buildUrl: (prompt: string) =>
      `https://www.google.com/search?udm=50&q=${prompt}`,
  },
  {
    name: "Grok",
    icon: "simple-icons:x",
    buildUrl: (prompt: string) => `https://grok.com/?q=${prompt}`,
  },
] as const;

export const LandingFooter = () => {
  const t = useTranslations("landing");

  const encodedPrompt = encodeURIComponent(
    t("footer.askAi.prompt", { site: SITE_URL }),
  );

  return (
    <footer>
      <DashboardLayout>
        <div className="flex flex-col md:flex-row justify-between gap-2">
          <div className="flex flex-1 flex-col gap-2">
            <Typography.Paragraph className="font-semibold">
              Sliceback
            </Typography.Paragraph>
            <Typography.Paragraph color="muted" size="sm">
              {t("footer.tagline")}
            </Typography.Paragraph>
          </div>

          <div className="flex flex-1 flex-col gap-2 md:items-end">
            <Typography.Paragraph size="sm" className="font-medium">
              {t("footer.resources")}
            </Typography.Paragraph>
            <div className="flex gap-2">
              <Link href={Routes.Blog}>
                {t("blog")}
                <Link.Icon />
              </Link>
              <Link href={Routes.Brokers}>
                {t("brokers")}
                <Link.Icon />
              </Link>
              <Link href={Routes.Faq}>
                {t("faq")}
                <Link.Icon />
              </Link>
            </div>
          </div>
        </div>

        <DashboardItem className="flex flex-col gap-2 border-t pt-6">
          <Typography.Paragraph size="sm" className="font-medium">
            {t("footer.askAi.title")}
          </Typography.Paragraph>
          <div
            className="flex flex-wrap gap-2"
            aria-label={t("footer.askAi.groupLabel")}
          >
            {AI_PROVIDERS.map((provider) => (
              <Link
                key={provider.name}
                href={provider.buildUrl(encodedPrompt)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("footer.askAi.ask", { provider: provider.name })}
                className={cn(
                  buttonVariants({ variant: "tertiary", size: "sm" }),
                  "gap-2",
                )}
              >
                <Icon icon={provider.icon} />
                {provider.name}
              </Link>
            ))}
          </div>
        </DashboardItem>

        <DashboardItem className="flex flex-col gap-2 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Typography.Paragraph color="muted" size="xs">
            © {new Date().getFullYear()} Sliceback. {t("footer.rights")}
          </Typography.Paragraph>
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeSwitcher />
          </div>
        </DashboardItem>
      </DashboardLayout>
    </footer>
  );
};
