import { MobileNav } from '@/components/dashboard/mobile-nav';
import { SidebarBrand, SidebarFooter } from '@/components/dashboard/sidebar-brand';
import { SidebarNav } from '@/components/dashboard/sidebar-nav';

import { AppHeader } from '@/components/dashboard/app-header';
import { getCurrentProfile } from '@/lib/auth';
import type { Profile } from '@/types/rbac';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profile = await getCurrentProfile();

  // Middleware da chan, day la lop bao ve thu 2 (defense in depth)
  if (!profile) redirect('/login');

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar co dinh tren desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-background md:flex">
        <SidebarBrand role={profile.role} />
        <div className="flex-1 overflow-y-auto py-3">
          <SidebarNav role={profile.role} />
        </div>
        <SidebarFooter role={profile.role} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          profile={profile}
          mobileTrigger={
            <MobileNav title="Menu">
              <SidebarNav role={profile.role} />
            </MobileNav>
          }
        />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
