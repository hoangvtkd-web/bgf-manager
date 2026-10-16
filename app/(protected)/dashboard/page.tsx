import type { Metadata } from 'next';
import {
  BarChart3,
  Package,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react';

import { ProtectedBanner } from '@/components/dashboard/protected-banner';
import { RoleOverview } from '@/components/dashboard/role-overview';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCurrentProfile } from '@/lib/auth';
import { formatVnd } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/nav-config';
import { hasRoleAtLeast } from '@/types/rbac';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Tong quan' };

const STATS = [
  { label: 'Doanh thu thang', value: formatVnd(186_420_000), icon: TrendingUp, tone: 'text-emerald-500' },
  { label: 'Don hang', value: '128', icon: Package, tone: 'text-sky-500' },
  { label: 'Khach hang', value: '42', icon: Users, tone: 'text-violet-500' },
  { label: 'Gia tri ton kho', value: formatVnd(24_101_000), icon: BarChart3, tone: 'text-amber-500' },
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { denied?: string };
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');

  const allowedMenus = NAV_ITEMS.filter((i) =>
    hasRoleAtLeast(profile.role, i.minRole)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Xin chao, {profile.full_name ?? profile.email}
        </h1>
        <p className="text-sm text-muted-foreground">
          Ban dang truy cap voi quyen <strong>{profile.role}</strong>. Menu
          sidebar chi hien thi {allowedMenus.length}/{NAV_ITEMS.length} muc phu
          hop voi quyen cua ban.
        </p>
      </div>

      {searchParams.denied && (
        <ProtectedBanner deniedPath={searchParams.denied} />
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {s.label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${s.tone}`} />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{s.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Du lieu minh hoa (boilerplate)
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Phan quyen theo vai tro</CardTitle>
            <CardDescription>
              Cau truc RBAC duoc ap dung o middleware + sidebar + trang.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RoleOverview currentRole={profile.role} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Quyen cua ban
            </CardTitle>
            <CardDescription>
              Danh sach route ban duoc phep truy cap.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {NAV_ITEMS.map((item) => {
              const allowed = hasRoleAtLeast(profile.role, item.minRole);
              const Icon = item.icon;
              return (
                <div
                  key={item.href}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {item.title}
                  </span>
                  <Badge variant={allowed ? 'success' : 'secondary'}>
                    {allowed ? 'Cho phep' : 'Bi chan'}
                  </Badge>
                </div>
              );
            })}
            <div className="flex items-center justify-between gap-3 border-t pt-3 text-sm">
              <span className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                Cau hinh he thong
              </span>
              <Badge
                variant={
                  profile.role === 'admin' ? 'success' : 'destructive'
                }
              >
                {profile.role === 'admin' ? 'Cho phep' : 'Chi Admin'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
