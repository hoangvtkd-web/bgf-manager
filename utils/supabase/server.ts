import { cookies } from 'next/headers';

import { createServerClient, type CookieOptions } from '@supabase/ssr';

import type { Database } from '@/types/database';

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Supabase client cho Server Components, Server Actions va Route Handlers.
 * Doc/ghi session qua cookie cua Next.js.
 *
 * Luu y: `cookies()` tra ve ReadonlyRequestCookies. Trong Server Component
 * (read-only) thi khong the ghi cookie -> catch de bo qua an toan.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Bo qua: duoc goi tu Server Component (khong the set cookie).
            // Viec refresh session da duoc middleware dam nhiem.
          }
        },
      },
    }
  );
}
