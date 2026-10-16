import {
  BarChart3,
  LayoutDashboard,
  Settings,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

import type { UserRole } from '@/types/rbac';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Role toi thieu duoc thay muc nay tren sidebar */
  minRole: UserRole;
  /** Nhan mo ta ngan (tuy chon) */
  badge?: string;
}

/**
 * Cau hinh menu sidebar.
 * Sidebar se LOC theo role cua user dang dang nhap -> an/hien tung muc.
 * Phai dong bo voi PROTECTED_ROUTES trong types/rbac.ts.
 */
export const NAV_ITEMS: NavItem[] = [
  {
    title: 'Tong quan',
    href: '/dashboard',
    icon: LayoutDashboard,
    minRole: 'employee',
  },
  {
    title: 'Bao cao',
    href: '/reports',
    icon: BarChart3,
    minRole: 'manager',
  },
  {
    title: 'Cau hinh he thong',
    href: '/settings',
    icon: Settings,
    minRole: 'admin',
  },
  {
    title: 'Ca nhan',
    href: '/profile',
    icon: UserRound,
    minRole: 'employee',
  },
];
