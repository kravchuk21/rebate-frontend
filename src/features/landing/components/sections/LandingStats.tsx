"use client";

import { Typography, Card } from "@heroui/react";
import { useTranslations } from "next-intl";

interface StatItem {
  value: string;
  label: string;
}

export const LandingStats = () => {
  const t = useTranslations("landing");
  const items = t.raw("stats.items") as StatItem[];

  return (
    <Card className="grid grid-cols-2 gap-8 md:grid-cols-4 items-center">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <Typography.Heading className="text-3xl font-extrabold tracking-tight text-center">
            {item.value}
          </Typography.Heading>
          <Typography.Paragraph color="muted" size="sm" className="text-center">
            {item.label}
          </Typography.Paragraph>
        </div>
      ))}
    </Card>
  );
};
