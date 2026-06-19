import { PageTransition } from "@/shared/components/PageTransition";

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen px-6 py-12 md:py-24 mx-auto w-full max-w-2xl flex flex-col gap-12">
      <PageTransition enter="content-page-in" exit="content-page-out">{children}</PageTransition>
    </div>
  );
}
