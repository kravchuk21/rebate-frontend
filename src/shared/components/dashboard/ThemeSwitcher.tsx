"use client";

import { useEffect, useState } from "react";
import { Button, ButtonGroup } from "@heroui/react";
import { Sun, Moon, Display } from "@gravity-ui/icons";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();
  const t = useTranslations("common.theme");

  // The active theme is unknown during SSR, so defer rendering until mount to
  // avoid a hydration mismatch on the highlighted button.
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ButtonGroup variant="outline" size="sm" fullWidth aria-label={t("label")}>
      <Button onPress={() => setTheme("light")} aria-label={t("light")}>
        <Sun />
      </Button>
      <Button onPress={() => setTheme("dark")} aria-label={t("dark")}>
        <ButtonGroup.Separator />
        <Moon />
      </Button>
      <Button onPress={() => setTheme("system")} aria-label={t("system")}>
        <ButtonGroup.Separator />
        <Display />
      </Button>
    </ButtonGroup>
  );
};
