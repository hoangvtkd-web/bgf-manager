import { NextResponse, type NextRequest } from 'next/server';

import {
  hasRoleAtLeast,
  PUBLIC_ROUTES,
  requiredRoleFor,
  type UserRole,
} from '@/types/rbac';
import { createMiddlewareClient } from '@/utils/supabase/middleware-client';

/**
 * Middleware chay truoc MOI request.
 *
 * Nhiem vu:
 *  1. Refresh session Supabase (giu cookie token luon moi).
 *  2. Chan truy cap khi chua dang nhap -> redirect /login.
 *  3. Doc ROLE cua user tu bang `profiles` va so khop voi cau hinh
 *     PROTECTED_ROUTES (types/rbac.ts) -> chan neu khong du quyen.
 *  4. Da dang nhap ma vao /login hay /register -> day ve /dashboard.
 */
export async function middleware(request: NextRequest) {
  const { supabase, getResponse } = createMiddlewareClient(request);
  const { pathname } = request.nextUrl;

  // 1) Bat buoc: refresh session truoc khi doc user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublicRoute = PUBLIC_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

  // 2) Chua dang nhap
  if (!user) {
    if (isPublicRoute) return getResponse();

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3) Da dang nhap: lay role tu bang profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: UserRole }>();

  const role: UserRole = profile?.role ?? 'employee';

  // 4) Da dang nhap ma vao trang auth -> ve dashboard
  if (isPublicRoute) {
    const dashUrl = request.nextUrl.clone();
    dashUrl.pathname = '/dashboard';
    dashUrl.search = '';
    return NextResponse.redirect(dashUrl);
  }

  // 5) Kiem tra phan quyen theo route
  const minRole = requiredRoleFor(pathname);
  if (minRole && !hasRoleAtLeast(role, minRole)) {
    const deniedUrl = request.nextUrl.clone();
    deniedUrl.pathname = '/dashboard';
    deniedUrl.searchParams.set('denied', pathname);
    return NextResponse.redirect(deniedUrl);
  }

  return getResponse();
}

export const config = {
  /**
   * Bo qua: static files, anh toi uu, favicon.
   * Van chay tren moi route dong (ke ca /api) tru khi nam trong danh sach loai tru.
   */
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
