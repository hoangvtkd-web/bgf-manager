import Link from 'next/link';

import {
  hasRoleAtLeast,
  ROLE_LABEL,
  type UserRole,
} from '@/types/rbac';

interface SidebarBrandProps {
  role: UserRole;
}

/** Phan dau sidebar: logo + ten he thong */
export function SidebarBrand({ role }: SidebarBrandProps) {
  return (
    <div className="flex h-14 items-center gap-2 border-b px-4">
      <Link href="/dashboard" className="flex flex-col leading-tight">
        <span className="text-base font-bold tracking-tight">BA GIA FOOD</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {ROLE_LABEL[role]}
        </span>
      </Link>
    </div>
  );
}

interface SidebarRoleFooterProps {
  role: UserRole;
}

/** Thong tin quyen o cuoi sidebar (giup nguoi dung biet minh duoc lam gi) */
export function SidebarFooter({ role }: SidebarRoleFooterProps) {
  const scopes: string[] = ['Ca nhan', 'Tong quan'];
  if (hasRoleAtLeast(role, 'manager')) scopes.push('Bao cao');
  if (hasRoleAtLeast(role, 'admin')) scopes.push('Cau hinh');

  return (
    <div className="mt-auto border-t px-4 py-3">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
        Pham vi quyen
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{scopes.join(' . ')}</p>
    </div>
  );
}
