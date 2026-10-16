/** Cac vai tro (role) trong he thong */
export type UserRole = 'admin' | 'manager' | 'employee';

/** Ban ghi profile luu trong bang `profiles` cua Supabase */
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

/** Thu tu uu tien quyen: so cang lon quyen cang cao */
export const ROLE_RANK: Record<UserRole, number> = {
  employee: 1,
  manager: 2,
  admin: 3,
};

/** Ten hien thi tieng Viet cua tung role */
export const ROLE_LABEL: Record<UserRole, string> = {
  admin: 'Quan tri vien',
  manager: 'Quan ly',
  employee: 'Nhan vien',
};

/** Kiem tra roleA co quyen >= roleB khong */
export function hasRoleAtLeast(role: UserRole, min: UserRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[min];
}

/** Cac route duoc bao ve, kem role toi thieu de truy cap */
export interface ProtectedRoute {
  /** Tien to duong dan (bat dau bang /) */
  prefix: string;
  /** Role toi thieu duoc phep vao */
  minRole: UserRole;
}

/**
 * Cau hinh phan quyen theo route.
 * Middleware se doc bang nay de chan/cho phep truy cap.
 * Vi du theo yeu cau:
 *  - Chi Admin vao duoc /settings
 *  - Manager + Admin vao duoc /reports
 *  - Employee tro len vao duoc /profile, /dashboard
 */
export const PROTECTED_ROUTES: ProtectedRoute[] = [
  { prefix: '/settings', minRole: 'admin' },
  { prefix: '/reports', minRole: 'manager' },
  { prefix: '/profile', minRole: 'employee' },
  { prefix: '/dashboard', minRole: 'employee' },
];

/** Route cong khai (khong can dang nhap) */
export const PUBLIC_ROUTES = ['/login', '/register', '/auth'];

/** Lay role toi thieu cho 1 duong dan, tra ve null neu khong bi gioi han */
export function requiredRoleFor(pathname: string): UserRole | null {
  const match = PROTECTED_ROUTES.find(
    (r) => pathname === r.prefix || pathname.startsWith(r.prefix + '/')
  );
  return match ? match.minRole : null;
}
