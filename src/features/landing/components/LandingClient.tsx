'use client';

import { useTranslations } from 'next-intl';
import { AuthModal } from '@/features/auth/components/AuthModal';
import { AuthModalTrigger } from '@/features/auth/components/AuthModalTrigger';
import { Link } from '@/i18n/navigation';

interface LandingClientProps {
  defaultReferralCode?: string;
}

export const LandingClient = ({ defaultReferralCode }: LandingClientProps) => {
  const t = useTranslations('landing');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/15 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-border/40">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Rebate Pro
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/blog" className="text-sm text-muted hover:text-foreground">
            {t('blog')}
          </Link>
          <Link href="/faq" className="text-sm text-muted hover:text-foreground">
            {t('faq')}
          </Link>
          <AuthModalTrigger />
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 md:py-24 max-w-4xl mx-auto z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text">
          {t('tagline')}
        </h1>
        <p className="text-lg md:text-xl text-muted mb-8 max-w-2xl">
          {t('description')}
        </p>
        <div className="flex gap-4">
          <AuthModalTrigger />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between border-t border-border/40 text-xs text-muted">
        <p>© {new Date().getFullYear()} Rebate Pro. All rights reserved.</p>
      </footer>

      {/* Auth Modal (Controlled by URL query params) */}
      <AuthModal defaultReferralCode={defaultReferralCode} />
    </div>
  );
};
