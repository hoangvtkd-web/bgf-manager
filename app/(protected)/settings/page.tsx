import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { RequireRole } from '@/components/dashboard/require-role';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getCurrentProfile } from '@/lib/auth';
import { hasRoleAtLeast } from '@/types/rbac';

export const metadata: Metadata = { title: 'Cau hinh he thong' };

export default async function SettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');

  // Chi Admin (minRole = admin)
  if (!hasRoleAtLeast(profile.role, 'admin')) {
    return <RequireRole minRole="admin" currentRole={profile.role} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Cau hinh he thong
        </h1>
        <Badge variant="destructive">Chi Admin</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thong tin cong ty</CardTitle>
            <CardDescription>
              Thong tin hien thi tren hoa don / phieu tinh tien.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              ['Thuong hieu', 'BA GIA FOOD'],
              ['Ten cong ty', 'CONG TY TNHH TM THUC PHAM AN HOP TIN'],
              ['Dia chi', '59 Duong so 4, Cu xa Chu Van An, P. Binh Thanh, TP.HCM'],
              ['Dien thoai', '0833.095.938'],
              ['Ma so thue', '0312345678'],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="text-right font-medium">{v}</span>
                </div>
                <Separator className="mt-3" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Phan quyen & Bao mat</CardTitle>
            <CardDescription>
              Cau hinh RBAC va chinh sach truy cap.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md border border-dashed p-4 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Vai tro mac dinh khi dang ky</p>
              <p className="mt-1">
                <code>employee</code> &mdash; thay doi trong trigger SQL
                <code className="ml-1">handle_new_user()</code>.
              </p>
            </div>
            <div className="rounded-md border border-dashed p-4 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Cap quyen cho user</p>
              <p className="mt-1">
                Chay trong Supabase SQL Editor:
              </p>
              <pre className="mt-2 overflow-x-auto rounded bg-muted p-2 text-[11px] text-foreground">
{`update public.profiles
   set role = 'manager'
 where email = 'user@bagiafood.vn';`}
              </pre>
            </div>
            <div className="rounded-md border border-dashed p-4 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Row Level Security</p>
              <p className="mt-1">
                Da bat RLS tren bang <code>profiles</code>: user chi doc duoc
                profile cua chinh minh, Admin doc/sua duoc tat ca.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
