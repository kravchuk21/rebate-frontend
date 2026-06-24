"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Persons,
  CreditCard,
  Briefcase,
  ArrowUpFromLine,
  ListCheck,
  Gear,
  ListCheckLock,
} from "@gravity-ui/icons";

import { SidebarShell } from "@/shared/components/dashboard/SidebarShell";
import { Routes } from "@/shared/lib/routes";

const ADMIN_NAV_KEYS = [
  { href: Routes.AdminUsers, labelKey: "users", icon: Persons },
  { href: Routes.AdminBrokerAccounts, labelKey: "brokerAccounts", icon: CreditCard },
  { href: Routes.AdminBrokers, labelKey: "brokers", icon: Briefcase },
  { href: Routes.AdminWithdrawals, labelKey: "withdrawals", icon: ArrowUpFromLine },
  { href: Routes.AdminRebate, labelKey: "rebate", icon: ListCheck },
  { href: Routes.AdminConfig, labelKey: "config", icon: Gear },
  { href: Routes.AdminAuditLog, labelKey: "auditLog", icon: ListCheckLock },
] as const;

interface AdminSidebarProps {
  email: string;
  role: string;
}

export const AdminSidebar = ({ email, role }: AdminSidebarProps) => {
  const t = useTranslations("admin.nav");

  const items = useMemo(
    () =>
      ADMIN_NAV_KEYS.map((item) => ({
        href: item.href,
        label: t(item.labelKey),
        icon: item.icon,
      })),
    [t],
  );

  return <SidebarShell email={email} role={role} items={items} ariaLabel={t("ariaLabel")} />;
};
