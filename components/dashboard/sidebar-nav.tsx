'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { NAV_ITEMS } from '@/lib/nav-config';
import { cn } from '@/lib/utils';
import {
  hasRoleAtLeast,
  ROLE_LABEL,
  type UserRole,
} from '@/types/rbac';

interface SidebarNavProps {
  role: UserRole;
  /** Goi khi bam 1 muc (dung de dong mobile sheet) */
  onNavigate?: () => void;
}

/**
 * Danh sach menu sidebar.
 * LOC theo role -> chi hien muc ma user duoc phep truy cap.
 */
export function SidebarNav({ role, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  const visibleItems = NAV_ITEMS.filter((item) =>
    hasRoleAtLeast(role, item.minRole)
  );

  return (
    <nav className="grid gap-1 px-2">
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href || pathname.startsWith(item.href + '/');

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.title}</span>
            {item.minRole === 'admin' && (
              <Badge
                variant="outline"
                className="ml-auto h-5 px-1.5 text-[10px]"
              >
                {ROLE_LABEL.admin}
              </Badge>
            )}
            {item.minRole === 'manager' && (
              <Badge
                variant="outline"
                className="ml-auto h-5 px-1.5 text-[10px]"
              >
                {ROLE_LABEL.manager}+
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
