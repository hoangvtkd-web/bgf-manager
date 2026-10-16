'use client';

import * as React from 'react';
import Link from 'next/link';
import { LogOut, Settings, UserRound } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROLE_LABEL, type Profile } from '@/types/rbac';

import { signOutAction } from '@/app/(protected)/actions';

interface UserMenuProps {
  profile: Profile;
}

function initials(name: string | null, email: string): string {
  const source = name?.trim() || email;
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  return (parts[0]?.[0] ?? '?').toUpperCase() + (parts[1]?.[0] ?? '').toUpperCase();
}

/** Menu tai khoan goc phai header */
export function UserMenu({ profile }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 gap-2 px-1.5 sm:px-2"
          aria-label="Menu tai khoan"
        >
          <Avatar className="h-7 w-7">
            {profile.avatar_url && (
              <AvatarImage src={profile.avatar_url} alt={profile.email} />
            )}
            <AvatarFallback>
              {initials(profile.full_name, profile.email)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-left sm:block">
            <span className="block text-xs font-medium leading-tight">
              {profile.full_name ?? profile.email}
            </span>
            <span className="block text-[10px] leading-tight text-muted-foreground">
              {ROLE_LABEL[profile.role]}
            </span>
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">
              {profile.full_name ?? 'Nguoi dung'}
            </p>
            <p className="text-xs text-muted-foreground">{profile.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <UserRound />
            Trang ca nhan
          </Link>
        </DropdownMenuItem>
        {profile.role === 'admin' && (
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer">
              <Settings />
              Cau hinh he thong
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <form action={signOutAction}>
          <DropdownMenuItem asChild>
            <button
              type="submit"
              className="w-full cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut />
              Dang xuat
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
