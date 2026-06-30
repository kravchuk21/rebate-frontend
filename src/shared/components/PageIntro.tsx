import Image from "next/image";
import { Typography } from "@heroui/react";

import { PageBreadcrumbs, type PageBreadcrumbItem } from "@/shared/components/PageBreadcrumbs";

export interface PageIntroProps {
  breadcrumbs: PageBreadcrumbItem[];
  title?: string;
  description?: string;
  /** Dark logo — visible on light backgrounds. */
  logoSrc?: string;
  /** White logo — visible on dark backgrounds (data-theme="dark"). Falls back to logoSrc. */
  logoWhiteSrc?: string;
  /** Accessible alt text for the logo. Defaults to title. */
  logoAlt?: string;
}

export function PageIntro({ breadcrumbs, title, description, logoSrc, logoWhiteSrc, logoAlt }: PageIntroProps) {
  const hasLogo = logoSrc || logoWhiteSrc;
  const alt = logoAlt ?? title ?? "";

  return (
    <div className="flex flex-col gap-12">
      <PageBreadcrumbs items={breadcrumbs} />
      {title && (
        <div className="flex flex-col items-center gap-2">
          {hasLogo && (
            <div className="mb-2 flex h-12 items-center">
              {/* Dark logo — shown on light theme; hidden on dark when a white variant exists. */}
              {logoSrc && (
                <Image
                  src={logoSrc}
                  alt={alt}
                  width={160}
                  height={48}
                  priority
                  className={`h-12 w-auto ${logoWhiteSrc ? "dark:hidden" : ""}`}
                />
              )}
              {/* White logo — shown on dark theme; hidden on light when a dark variant exists. */}
              {logoWhiteSrc && (
                <Image
                  src={logoWhiteSrc}
                  alt={alt}
                  width={160}
                  height={48}
                  priority
                  className={`h-12 w-auto ${logoSrc ? "hidden dark:block" : ""}`}
                />
              )}
            </div>
          )}
          <Typography.Heading className={hasLogo ? "sr-only" : "text-center text-3xl font-extrabold tracking-tight md:text-4xl"}>
            {title}
          </Typography.Heading>
          {description && <Typography.Paragraph color="muted" className="text-center">{description}</Typography.Paragraph>}
        </div>
      )}
    </div>
  );
}
