'use client';

import { useEffect, useState } from 'react';
import { Button, ButtonGroup } from '@heroui/react';
import { Sun, Moon, Display } from '@gravity-ui/icons';

type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';

function applyTheme(theme: Theme) {
  const resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;
  document.documentElement.setAttribute('data-theme', resolved);
}

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? 'system';
    setTheme(stored);
    applyTheme(stored);
  }, []);

  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const select = (next: Theme) => {
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  return (
    <ButtonGroup variant="tertiary" size="sm" fullWidth>
      <Button
        onPress={() => select('light')}
        variant={theme === 'light' ? 'secondary' : 'tertiary'}
      >
        <Sun />
      </Button>
      <Button
        onPress={() => select('dark')}
        variant={theme === 'dark' ? 'secondary' : 'tertiary'}
      >
        <ButtonGroup.Separator />
        <Moon />
      </Button>
      <Button
        onPress={() => select('system')}
        variant={theme === 'system' ? 'secondary' : 'tertiary'}
      >
        <ButtonGroup.Separator />
        <Display />
      </Button>
    </ButtonGroup>
  );
};
