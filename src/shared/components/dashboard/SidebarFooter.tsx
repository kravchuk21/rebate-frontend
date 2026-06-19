"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { ArrowRightFromSquare, CircleQuestion } from "@gravity-ui/icons";

import { LocaleSwitcher } from "@/shared/components/LocaleSwitcher";
import { ThemeSwitcher } from "@/shared/components/dashboard/ThemeSwitcher";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useRouter } from "@/i18n/navigation";
import { Routes } from "@/shared/lib/routes";
import { SidebarButton } from "./SidebarButton";

export const SidebarFooter = memo(function SidebarFooter() {
  const t = useTranslations("common");
  const logout = useLogout();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-1">
      <SidebarButton onPress={() => router.push(Routes.Faq)}>
        <CircleQuestion />
        {t("help")}
      </SidebarButton>
      <SidebarButton onPress={() => logout.mutate()} isDisabled={logout.isPending}>
        <ArrowRightFromSquare />
        {t("logout")}
      </SidebarButton>
      <LocaleSwitcher />
      <ThemeSwitcher />
    </div>
  );
});
