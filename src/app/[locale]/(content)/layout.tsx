import { ScrollShadow } from "@heroui/react";

import { PageTransition } from "@/shared/components/PageTransition";
import { LandingFooter } from "@/features/landing/components/sections/LandingFooter";

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ScrollShadow size={80} className="h-screen w-full">
      <div className="px-6 py-12 md:py-24 mx-auto w-full max-w-2xl flex flex-col gap-12">
        <PageTransition enter="content-page-in" exit="content-page-out">
          {children}
          <LandingFooter />
        </PageTransition>
      </div>
    </ScrollShadow>
  );
}
