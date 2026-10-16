import { ShieldAlert } from 'lucide-react';

import { Alert } from '@/components/ui/alert';

/** Banner hien khi middleware chan truy cap va day ve dashboard */
export function ProtectedBanner({ deniedPath }: { deniedPath: string }) {
  return (
    <Alert variant="destructive" className="flex items-start gap-3">
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="space-y-1">
        <p className="text-sm font-medium">Khong du quyen truy cap</p>
        <p className="text-xs opacity-90">
          Ban khong co quyen vao <code>{deniedPath}</code>. Vui long lien he
          Quan tri vien neu can cap them quyen.
        </p>
      </div>
    </Alert>
  );
}
