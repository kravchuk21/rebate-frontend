import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/shared/components/dashboard/PageHeader";
import { ReferralLinkCard } from "@/features/referral/components/ReferralLinkCard";
import { redirect } from "@/i18n/navigation";
import { getAccessToken } from "@/shared/lib/cookies";
import { decodeAccessToken } from "@/shared/lib/decodeToken";
import { Routes } from "@/shared/lib/routes";
import { ChangePasswordSection } from "@/features/auth/components/profile/ChangePasswordSection";
import { ProfileAccountInfo } from "@/features/auth/components/profile/ProfileAccountInfo";
import { TwoFASection } from "@/features/auth/components/profile/TwoFASection";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const token = await getAccessToken();

  if (!token) {
    redirect({ href: `${Routes.Home}?modal=login`, locale });
    return;
  }

  const claims = decodeAccessToken(token);

  if (!claims) {
    redirect({ href: `${Routes.Home}?modal=login`, locale });
    return;
  }

  const t = await getTranslations("profile");

  return (
    <>
      <PageHeader title={t("title")} />
      <DashboardLayout>
        <DashboardItem span={6}>
          <ProfileAccountInfo email={claims.email} role={claims.role} twoFaEnabled={claims.two_fa_enabled ?? false} />
        </DashboardItem>

        <DashboardItem span={6}>
          <ReferralLinkCard />
        </DashboardItem>

        <DashboardItem span={6}>
          <ChangePasswordSection />
        </DashboardItem>

        <DashboardItem span={6}>
          <TwoFASection initialEnabled={claims.two_fa_enabled ?? false} />
        </DashboardItem>
      </DashboardLayout>
    </>
  );
}
