"use client";

import {
  ArrowDownToLine,
  ChartLine,
  Clock,
  Gift,
  SealCheck,
  ShieldCheck,
} from "@gravity-ui/icons";
import { Card, Typography } from "@heroui/react";
import { useTranslations } from "next-intl";
import type { ComponentType } from "react";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";

interface Feature {
  title: string;
  description: string;
}

const icons: ComponentType<{ className?: string }>[] = [
  Clock,
  ArrowDownToLine,
  ChartLine,
  ShieldCheck,
  Gift,
  SealCheck,
];

export const LandingFeatures = () => {
  const t = useTranslations("landing");
  const items = t.raw("features.items") as Feature[];

  return (
    <DashboardLayout>
      <DashboardItem>
        <Typography.Heading className="text-center text-3xl font-extrabold md:text-4xl">
          {t("features.title")}
        </Typography.Heading>
      </DashboardItem>
      <DashboardItem>
        <Typography.Paragraph color="muted" className="text-center">
          {t("features.subtitle")}
        </Typography.Paragraph>
      </DashboardItem>

      <DashboardItem>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((feature, index) => {
            const Icon = icons[index] ?? SealCheck;
            return (
              <Card key={feature.title} className="h-full">
                <Card.Header>
                  <Icon className="size-5 mb-2" />
                  <Card.Title>{feature.title}</Card.Title>
                  <Card.Description>{feature.description}</Card.Description>
                </Card.Header>
              </Card>
            );
          })}
        </div>
      </DashboardItem>
    </DashboardLayout >
  );
};
