"use client";

import { Card, Input } from "@heroui/react";
import { useTranslations } from "next-intl";

import type { ReferralStatsResponse } from "@/shared/api/generated/types.gen";

import { useReferralStats } from "../hooks/useReferralStats";
import { WidgetCard } from "@/shared/components/WidgetCard";
import { CopyButton } from "@/shared/components/CopyButton";
import { DashboardItem, DashboardLayout } from "@/shared/components/layout";
import { InputSkeleton } from "@/shared/components/Skeletons";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

export const ReferralLinkCard = () => {
  const t = useTranslations("referrals.link");
  const { data, isLoading } = useReferralStats();

  const stats = data?.data as ReferralStatsResponse | undefined;

  const fullUrl = stats?.referral_code ? `${SITE_URL}?ref=${stats.referral_code}` : undefined;

  return (
    <WidgetCard>
      <Card.Header>
        <Card.Title>{t("title")}</Card.Title>
        <Card.Description>{t("description")}</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="mt-auto">
          <DashboardLayout>
            <DashboardItem className="flex gap-2">
              {isLoading ? <InputSkeleton /> :
                <Input
                  variant="secondary"
                  className="flex-1"
                  value={fullUrl ?? "—"}
                  disabled
                />
              }
              <CopyButton variant="primary" value={fullUrl ?? ""} isDisabled={!fullUrl} label={t("copy")} size="md" />
            </DashboardItem>
            <DashboardItem className="flex gap-2">
              {isLoading ? <InputSkeleton /> :
                <Input
                  variant="secondary"
                  className="flex-1"
                  value={stats?.referral_code ?? "—"}
                  disabled
                />
              }
              <CopyButton variant="primary" value={stats?.referral_code ?? ""} isDisabled={!stats?.referral_code} label={t("copy")} size="md" />
            </DashboardItem>
          </DashboardLayout>
        </div>
      </Card.Content>
    </WidgetCard>
  );
};
