'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';

const adminNavItems = [
  { href: '/admin', labelKey: 'overview', icon: '📊' },
  { href: '/admin/users', labelKey: 'users', icon: '👥' },
  { href: '/admin/broker-accounts', labelKey: 'brokerAccounts', icon: '🏦' },
  { href: '/admin/withdrawals', labelKey: 'withdrawals', icon: '💳' },
  { href: '/admin/rebate', labelKey: 'rebate', icon: '💰' },
  { href: '/admin/config', labelKey: 'config', icon: '⚙️' },
  { href: '/admin/audit-log', labelKey: 'auditLog', icon: '📋' },
] as const;

export const AdminSidebar = () => {
  const t = useTranslations('admin.nav');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navList = (
    <nav className="flex flex-col gap-1">
      {adminNavItems.map((item) => {
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

      <div className="my-2 border-t" />

      <Link
        href="/dashboard"
        onClick={() => setIsOpen(false)}
        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-secondary"
      >
        <span aria-hidden="true">⬅️</span>
        {t('backToDashboard')}
      </Link>
    </nav>
  );

  return (
    <>
      <div className="flex items-center border-b p-4 md:hidden">
        <Button variant="ghost" size="sm" onPress={() => setIsOpen((prev) => !prev)}>
          ☰
        </Button>
      </div>

      {isOpen && <div className="border-b p-4 md:hidden">{navList}</div>}

      <aside className="hidden w-60 shrink-0 border-r p-4 md:block">{navList}</aside>
    </>
  );
};
