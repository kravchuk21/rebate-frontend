import { AuthModal } from "@/features/auth/components/AuthModal";
import { LandingHero } from "./sections/LandingHero";
import { LandingStats } from "./sections/LandingStats";
import { LandingHowItWorks } from "./sections/LandingHowItWorks";
import { LandingFeatures } from "./sections/LandingFeatures";
import { LandingFaqPreview } from "./sections/LandingFaqPreview";
import { LandingCta } from "./sections/LandingCta";

interface LandingClientProps {
  defaultReferralCode?: string;
}

export const LandingClient = ({ defaultReferralCode }: LandingClientProps) => (
  <>
    <LandingHero />
    <LandingStats />
    <LandingHowItWorks />
    <LandingFeatures />
    <LandingFaqPreview />
    <LandingCta />

    {/* Auth Modal (controlled by URL query params) */}
    <AuthModal defaultReferralCode={defaultReferralCode} />
  </>
);
