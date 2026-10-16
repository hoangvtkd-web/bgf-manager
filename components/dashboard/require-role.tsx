import { ShieldAlert } from 'lucide-react';

import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ROLE_LABEL, type UserRole } from '@/types/rbac';

interface RequireRoleProps {
  minRole: UserRole;
  currentRole: UserRole;
}

/**
 * Man hinh "khong du quyen" hien thi ngay trong trang.
 * Day la lop bao ve thu 3 (sau middleware va layout).
 */
export function RequireRole({ minRole, currentRole }: RequireRoleProps) {
  return (
    <div className="space-y-4">
      <Alert variant="destructive" className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-medium">Khong du quyen truy cap</p>
          <p className="text-xs opacity-90">
            Trang nay yeu cau quyen <strong>{ROLE_LABEL[minRole]}</strong> tro
            len. Quyen hien tai cua ban:{' '}
            <strong>{ROLE_LABEL[currentRole]}</strong>.
          </p>
        </div>
      </Alert>
      <div className="text-sm text-muted-foreground">
        <p>Vui long lien he Quan tri vien de duoc cap quyen.</p>
      </div>
      <div className="flex gap-2">
        <Badge variant="outline">Yeu cau: {minRole}</Badge>
        <Badge variant="secondary">Hien tai: {currentRole}</Badge>
      </div>
    </div>
  );
}
