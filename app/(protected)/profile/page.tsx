import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { formatDateVi } from '@/lib/utils';
import { ROLE_LABEL } from '@/types/rbac';

export const metadata: Metadata = { title: 'Ca nhan' };

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');

  const initials = (profile.full_name ?? profile.email)
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Trang ca nhan</h1>

      <Card className="max-w-2xl">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-14 w-14">
            {profile.avatar_url && (
              <AvatarImage src={profile.avatar_url} alt={profile.email} />
            )}
            <AvatarFallback className="text-base">{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle>{profile.full_name ?? 'Chua cap nhat ten'}</CardTitle>
            <CardDescription>{profile.email}</CardDescription>
            <Badge variant="secondary">{ROLE_LABEL[profile.role]}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {[
            ['Ma nguoi dung', profile.id],
            ['Email', profile.email],
            ['Vai tro', ROLE_LABEL[profile.role] + ' (' + profile.role + ')'],
            ['Ngay tham gia', formatDateVi(profile.created_at)],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">{k}</span>
                <span className="max-w-[60%] truncate text-right font-medium">
                  {v}
                </span>
              </div>
              <Separator className="mt-3" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
