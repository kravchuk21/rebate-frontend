"use client";

import { WidgetCard } from "@/shared/components/WidgetCard";
import { StatsRows } from "@/shared/components/stats/StatsRows";
import { Card } from "@heroui/react";
import { useTranslations } from "next-intl";

interface ProfileAccountInfoProps {
  email: string;
  role: string;
  twoFaEnabled: boolean;
}

export const ProfileAccountInfo = ({ email, role, twoFaEnabled }: ProfileAccountInfoProps) => {
  const t = useTranslations("profile.account");
  const tTwoFA = useTranslations("profile.twoFA");

  const rows = [
    { label: t("email"), value: email },
    { label: t("role"), value: role },
    { label: tTwoFA("title"), value: twoFaEnabled ? tTwoFA("enabled") : tTwoFA("disabled") },
  ];

  return (
    <WidgetCard>
      <Card.Header>
        <Card.Title>{t("title")}</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="mt-auto">
          <StatsRows rows={rows} />
        </div>
      </Card.Content>
    </WidgetCard>
  );
};
