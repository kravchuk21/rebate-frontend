"use client";

import { memo, useMemo, type ComponentType, type SVGProps } from "react";
import { Chip } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { SidebarButton } from "./SidebarButton";

export interface SidebarNavItem {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  tag?: "new";
}

interface SidebarNavProps {
  items: readonly SidebarNavItem[];
  ariaLabel?: string;
  onNavigate?: () => void;
}

export const SidebarNav = memo(function SidebarNav({
  items,
  ariaLabel,
  onNavigate,
}: SidebarNavProps) {
  const t = useTranslations("common");
  const pathname = usePathname();
  const router = useRouter();

  const activeHref = useMemo(
    () =>
      (
        items
          .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
          .sort((a, b) => b.href.length - a.href.length)[0] ?? items[0]
      )?.href,
    [items, pathname],
  );

  return (
    <nav aria-label={ariaLabel} className="flex w-full flex-col gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.href === activeHref;

        return (
          <SidebarButton
            key={item.href}
            variant={isActive ? "tertiary" : "ghost"}
            onPress={() => {
              if (pathname !== item.href) {
                router.push(item.href);
              }

              onNavigate?.();
            }}
          >
            <Icon />
            <span className="flex-1 text-start">{item.label}</span>
            {item.tag === "new" && (
              <Chip size="sm" color="success" variant="soft">
                {t("tagNew")}
              </Chip>
            )}
          </SidebarButton>
        );
      })}
    </nav>
  );
});
