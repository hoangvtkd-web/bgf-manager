'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/utils/supabase/client';

export function RegisterForm() {
  const router = useRouter();

  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Mat khau qua ngan', {
        description: 'Mat khau phai co it nhat 6 ky tu.',
      });
      return;
    }
    if (password !== confirm) {
      toast.error('Mat khau khong khop');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Trigger trong SQL se doc full_name nay de tao dong profiles
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      toast.error('Dang ky that bai', { description: error.message });
      setLoading(false);
      return;
    }

    // Neu bat "Confirm email" trong Supabase thi chua co session ngay
    if (!data.session) {
      toast.success('Da gui email xac nhan', {
        description: 'Vui long kiem tra hop thu de kich hoat tai khoan.',
      });
      setLoading(false);
      router.push('/login');
      return;
    }

    toast.success('Dang ky thanh cong');
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Dang ky</CardTitle>
        <CardDescription>
          Tao tai khoan moi. Mac dinh ban se co quyen Nhan vien.
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Ho va ten</Label>
            <Input
              id="fullName"
              placeholder="Nguyen Van A"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="ten@bagiafood.vn"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mat khau</Label>
            <Input
              id="password"
              type="password"
              placeholder="Toi thieu 6 ky tu"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Xac nhan mat khau</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="Nhap lai mat khau"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            Tao tai khoan
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Da co tai khoan?{' '}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Dang nhap
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
