import Link from 'next/link';

import { ThemeToggle } from '@/components/theme-toggle';
import { UserMenu } from '@/components/dashboard/user-menu';
import { Badge } from '@/components/ui/badge';
import { ROLE_LABEL, type Profile } from '@/types/rbac';

interface AppHeaderProps {
  profile: Profile;
  /** Nut mo menu tren mobile (se duoc truyen tu layout) */
  mobileTrigger?: React.ReactNode;
}

export function AppHeader({ profile, mobileTrigger }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {mobileTrigger}

      <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
        <span className="text-sm font-bold tracking-tight">BGF</span>
      </Link>

      <div className="hidden items-center gap-2 md:flex">
        <Badge variant="secondary" className="font-normal">
          {ROLE_LABEL[profile.role]}
        </Badge>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <UserMenu profile={profile} />
      </div>
    </header>
  );
}
