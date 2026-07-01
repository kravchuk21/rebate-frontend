import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/shared/components/dashboard/PageHeader";
import { ReferralLinkCard } from "@/features/referral/components/ReferralLinkCard";
import { getAccessToken } from "@/shared/lib/cookies";
import { decodeAccessToken } from "@/shared/lib/decodeToken";
import { ChangePasswordSection } from "@/features/auth/components/profile/ChangePasswordSection";
import { ProfileAccountInfo } from "@/features/auth/components/profile/ProfileAccountInfo";
import { TwoFASection } from "@/features/auth/components/profile/TwoFASection";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";

export default async function ProfilePage() {
  // The `(dashboard)` layout already gates on a valid token and redirects
  // otherwise, so claims are expected to be present here. Fall back to a 404
  // instead of throwing on the non-null assertion if that invariant ever breaks.
  const token = await getAccessToken();
  const claims = token ? decodeAccessToken(token) : null;

  if (!claims) {
    notFound();
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
