"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowDownToLine,
  CreditCard,
  House,
  Persons,
  PersonGear,
  ArrowUpFromLine,
} from "@gravity-ui/icons";

import { Routes } from "@/shared/lib/routes";
import { SidebarShell } from "./SidebarShell";

const NAV_KEYS = [
  { href: Routes.Dashboard, labelKey: "dashboard", icon: House },
  { href: Routes.Accounts, labelKey: "accounts", icon: CreditCard },
  { href: Routes.Rebate, labelKey: "rebate", icon: ArrowDownToLine },
  { href: Routes.Withdrawal, labelKey: "withdrawal", icon: ArrowUpFromLine },
  { href: Routes.Referrals, labelKey: "referrals", icon: Persons, tag: "new" },
  { href: Routes.Profile, labelKey: "profile", icon: PersonGear },
] as const;

interface SidebarProps {
  email: string;
  role: string;
}

export const Sidebar = ({ email, role }: SidebarProps) => {
  const t = useTranslations("nav");

  const items = useMemo(
    () =>
      NAV_KEYS.map((item) => ({
        href: item.href,
        label: t(item.labelKey),
        icon: item.icon,
        tag: "tag" in item ? item.tag : undefined,
      })),
    [t],
  );

  return <SidebarShell email={email} role={role} items={items} ariaLabel={t("ariaLabel")} />;
};
