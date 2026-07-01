"use client";

import { useEffect, useState } from "react";
import { Button, ButtonGroup } from "@heroui/react";
import { Sun, Moon, Display } from "@gravity-ui/icons";
import { useTheme } from "next-themes";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // The active theme is unknown during SSR, so defer rendering until mount to
  // avoid a hydration mismatch on the highlighted button.
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ButtonGroup variant="outline" size="sm" fullWidth>
      <Button
        onPress={() => setTheme("light")}
        // variant={theme === "light" ? "secondary" : "tertiary"}
      >
        <Sun />
      </Button>
      <Button
        onPress={() => setTheme("dark")}
        // variant={theme === "dark" ? "secondary" : "tertiary"}
      >
        <ButtonGroup.Separator />
        <Moon />
      </Button>
      <Button
        onPress={() => setTheme("system")}
        // variant={theme === "system" ? "secondary" : "tertiary"}
      >
        <ButtonGroup.Separator />
        <Display />
      </Button>
    </ButtonGroup>
  );
};
