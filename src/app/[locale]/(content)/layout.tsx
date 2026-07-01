import { PageTransition } from "@/shared/components/PageTransition";
import { LandingFooter } from "@/features/landing/components/sections/LandingFooter";

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="px-6 py-12 md:py-24 mx-auto w-full max-w-2xl flex flex-col gap-12">
      <PageTransition enter="content-page-in" exit="content-page-out">
        {children}
        <LandingFooter />
      </PageTransition>
    </main>
  );
}
