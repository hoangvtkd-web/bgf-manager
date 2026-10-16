import Link from 'next/link';

import { ThemeToggle } from '@/components/theme-toggle';

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-10">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <Link
        href="/"
        className="mb-8 flex flex-col items-center gap-1 text-center"
      >
        <span className="text-2xl font-bold tracking-tight">
          BA GIA FOOD
        </span>
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          He thong quan ly
        </span>
      </Link>

      <div className="w-full max-w-md">{children}</div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Ba Gia Food. Next.js 14 &middot;
        Supabase Auth
      </p>
    </div>
  );
}
