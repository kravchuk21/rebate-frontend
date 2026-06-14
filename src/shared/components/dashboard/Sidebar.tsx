'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';

const navItems = [
  { href: '/dashboard', labelKey: 'dashboard', icon: '📊' },
  { href: '/accounts', labelKey: 'accounts', icon: '🏦' },
  { href: '/rebate', labelKey: 'rebate', icon: '💰' },
  { href: '/withdrawal', labelKey: 'withdrawal', icon: '💸' },
  { href: '/referrals', labelKey: 'referrals', icon: '🔗' },
] as const;

export const Sidebar = () => {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navList = (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-foreground hover:bg-surface-secondary'
            }`}
          >
            <span aria-hidden="true">{item.icon}</span>
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="flex items-center border-b p-4 md:hidden">
        <Button variant="ghost" size="sm" onPress={() => setIsOpen((prev) => !prev)}>
          ☰
        </Button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-b p-4 md:hidden">
          {navList}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r p-4 md:block">{navList}</aside>
    </>
  );
};
