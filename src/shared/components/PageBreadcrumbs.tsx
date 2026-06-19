"use client";

import { Breadcrumbs } from "@heroui/react";

export interface PageBreadcrumbItem {
  label: string;
  href?: string;
}

export function PageBreadcrumbs({ items }: { items: PageBreadcrumbItem[] }) {
  return (
    <Breadcrumbs>
      {items.map((item) =>
        item.href ? (
          <Breadcrumbs.Item key={item.label} href={item.href}>
            {item.label}
          </Breadcrumbs.Item>
        ) : (
          <Breadcrumbs.Item key={item.label}>{item.label}</Breadcrumbs.Item>
        ),
      )}
    </Breadcrumbs>
  );
}
