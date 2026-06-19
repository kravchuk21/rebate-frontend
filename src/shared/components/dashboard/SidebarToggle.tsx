"use client";

import { memo } from "react";
import { ButtonRoot } from "@heroui/react";
import { useTranslations } from "next-intl";
import { LayoutSideContent } from "@gravity-ui/icons";

import { useSidebar } from "./SidebarContext";

export const SidebarToggle = memo(function SidebarToggle() {
  const t = useTranslations("common");
  const { toggle } = useSidebar();

  return (
    <ButtonRoot isIconOnly variant="ghost" aria-label={t("openMenu")} onPress={toggle}>
      <LayoutSideContent />
    </ButtonRoot>
  );
});
