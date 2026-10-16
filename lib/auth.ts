import type { User } from '@supabase/supabase-js';

import type { Profile, UserRole } from '@/types/rbac';

import { createClient } from '@/utils/supabase/server';

/** Lay user dang dang nhap (Server Component) */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}

/** Lay profile (kem role) cua user dang dang nhap */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (data) return data as Profile;

  // Fallback: chua co dong profile (VD: trigger chua chay) -> coi la employee
  return {
    id: user.id,
    email: user.email ?? '',
    full_name: (user.user_metadata?.full_name as string) ?? null,
    role: 'employee' as UserRole,
    avatar_url: null,
    created_at: user.created_at,
    updated_at: user.created_at,
  };
}

/** Dang xuat (Server Action) */
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}
