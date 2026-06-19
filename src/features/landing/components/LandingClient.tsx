"use client";

import { useTranslations } from "next-intl";
import { AuthModal } from "@/features/auth/components/AuthModal";
import { AuthModalTrigger } from "@/features/auth/components/AuthModalTrigger";
import { Link } from "@/i18n/navigation";
import { Routes } from "@/shared/lib/routes";

interface LandingClientProps {
  defaultReferralCode?: string;
}

export const LandingClient = ({ defaultReferralCode }: LandingClientProps) => {
  const t = useTranslations("landing");

  return (
    <div className="bg-background text-foreground relative flex min-h-screen flex-col justify-between overflow-hidden">
      {/* Background gradients */}
      <div className="bg-primary/10 pointer-events-none absolute top-[-20%] left-[-10%] h-[50%] w-[50%] rounded-full blur-[120px]" />
      <div className="bg-accent/15 pointer-events-none absolute right-[-10%] bottom-[-20%] h-[50%] w-[50%] rounded-full blur-[120px]" />

      {/* Header */}
      <header className="border-border/40 mx-auto flex w-full max-w-7xl items-center justify-between border-b px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="from-primary to-accent bg-gradient-to-r bg-clip-text text-xl font-bold tracking-tight text-transparent">
            Rebate Pro
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href={Routes.Blog} className="text-muted hover:text-foreground text-sm">
            {t("blog")}
          </Link>
          <Link href={Routes.Faq} className="text-muted hover:text-foreground text-sm">
            {t("faq")}
          </Link>
          <AuthModalTrigger />
        </div>
      </header>

      {/* Hero section */}
      <main className="z-10 mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center px-6 py-12 text-center md:py-24">
        <h1 className="from-foreground to-foreground/80 mb-6 bg-gradient-to-b bg-clip-text text-4xl font-extrabold tracking-tight md:text-6xl">
          {t("tagline")}
        </h1>
        <p className="text-muted mb-8 max-w-2xl text-lg md:text-xl">{t("description")}</p>
        <div className="flex gap-4">
          <AuthModalTrigger />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-border/40 text-muted mx-auto flex w-full max-w-7xl items-center justify-between border-t px-6 py-8 text-xs">
        <p>© {new Date().getFullYear()} Rebate Pro. All rights reserved.</p>
      </footer>

      {/* Auth Modal (Controlled by URL query params) */}
      <AuthModal defaultReferralCode={defaultReferralCode} />
    </div>
  );
};
