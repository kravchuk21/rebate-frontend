"use client";

import { useEffect, useState } from "react";
import { Button, ButtonGroup } from "@heroui/react";
import { Sun, Moon, Display } from "@gravity-ui/icons";

import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  applyTheme,
  type Theme,
} from "@/shared/lib/theme";

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    const stored = (localStorage.getItem(THEME_STORAGE_KEY) as Theme | null) ?? DEFAULT_THEME;
    setTheme(stored);
    applyTheme(stored);
  }, []);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const select = (next: Theme) => {
    setTheme(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
    applyTheme(next);
  };

  return (
    <ButtonGroup variant="outline" size="sm" fullWidth>
      <Button
        onPress={() => select("light")}
        // variant={theme === 'light' ? 'secondary' : 'tertiary'}
      >
        <Sun />
      </Button>
      <Button
        onPress={() => select("dark")}
        // variant={theme === 'dark' ? 'secondary' : 'tertiary'}
      >
        <ButtonGroup.Separator />
        <Moon />
      </Button>
      <Button
        onPress={() => select("system")}
        // variant={theme === 'system' ? 'secondary' : 'tertiary'}
      >
        <ButtonGroup.Separator />
        <Display />
      </Button>
    </ButtonGroup>
  );
};
