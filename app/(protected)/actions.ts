'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { signOut as doSignOut } from '@/lib/auth';

/** Server Action: dang xuat va quay ve trang login */
export async function signOutAction() {
  await doSignOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
