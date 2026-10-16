'use client';

import * as React from 'react';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  children: React.ReactNode;
  /** Nut mo drawer (thuong la menu icon o header) */
  trigger?: React.ReactNode;
  title?: string;
}

/**
 * Drawer don gian cho mobile (khong phu thuoc radix-dialog).
 * Duoc dung de hien sidebar tren man hinh nho.
 */
export function MobileNav({ children, trigger, title = 'Menu' }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);

  // Dong khi nhan Esc
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      {trigger ? (
        <span onClick={() => setOpen(true)} className="contents">
          {trigger}
        </span>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Mo menu"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside
            className={cn(
              'absolute left-0 top-0 h-full w-72 border-r bg-background p-4 shadow-xl',
              'animate-in slide-in-from-left duration-200'
            )}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {title}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                aria-label="Dong menu"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div onClick={() => setOpen(false)}>{children}</div>
          </aside>
        </div>
      )}
    </>
  );
}
