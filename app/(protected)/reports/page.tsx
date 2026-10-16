import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { RequireRole } from '@/components/dashboard/require-role';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentProfile } from '@/lib/auth';
import { hasRoleAtLeast } from '@/types/rbac';

export const metadata: Metadata = { title: 'Bao cao' };

export default async function ReportsPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');

  // Bao ve cap trang (ngoai middleware)
  if (!hasRoleAtLeast(profile.role, 'manager')) {
    return <RequireRole minRole="manager" currentRole={profile.role} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bao cao</h1>
        <p className="text-sm text-muted-foreground">
          Danh cho Quan ly va Quan tri vien (minRole = manager).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { t: 'Doanh thu theo thang', d: 'Bieu do cot doanh thu 12 thang gan nhat.' },
          { t: 'Xuat - Nhap - Ton', d: 'Bang tong hop xuat nhap ton theo san pham.' },
          { t: 'Thue GTGT', d: 'Bang ke VAT dau vao / dau ra theo thue suat.' },
          { t: 'Top khach hang', d: 'Xep hang khach hang theo gia tri don hang.' },
        ].map((c) => (
          <Card key={c.t}>
            <CardHeader>
              <CardTitle className="text-base">{c.t}</CardTitle>
              <CardDescription>{c.d}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
                Cho tich hop bieu do (Recharts / Chart.js)
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
