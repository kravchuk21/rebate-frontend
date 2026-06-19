import { Typography } from "@heroui/react";

import { PageBreadcrumbs, type PageBreadcrumbItem } from "@/shared/components/PageBreadcrumbs";

export interface PageIntroProps {
  breadcrumbs: PageBreadcrumbItem[];
  title?: string;
  description?: string;
}

export function PageIntro({ breadcrumbs, title, description }: PageIntroProps) {
  return (
    <div className="flex flex-col gap-12">
      <PageBreadcrumbs items={breadcrumbs} />
      {title && (
        <div className="flex flex-col items-center gap-2">
          <Typography.Heading className="text-center text-3xl font-extrabold tracking-tight md:text-4xl">
            {title}
          </Typography.Heading>
          {description && <Typography.Paragraph color="muted" className="text-center">{description}</Typography.Paragraph>}
        </div>
      )}
    </div>
  );
}
