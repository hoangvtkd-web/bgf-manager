import { Check, Minus } from 'lucide-react';

import { NAV_ITEMS } from '@/lib/nav-config';
import { cn } from '@/lib/utils';
import { hasRoleAtLeast, ROLE_LABEL, type UserRole } from '@/types/rbac';

const ROLES: UserRole[] = ['employee', 'manager', 'admin'];

/**
 * Bang so sanh quyen giua cac role (ma tran Role x Route).
 * O nao co dau tick = role do duoc vao route tuong ung.
 */
export function RoleOverview({ currentRole }: { currentRole: UserRole }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2 pr-3 font-medium text-muted-foreground">
              Route
            </th>
            {ROLES.map((r) => (
              <th
                key={r}
                className={cn(
                  'px-3 py-2 text-center font-medium',
                  r === currentRole
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {ROLE_LABEL[r]}
                {r === currentRole && (
                  <span className="ml-1 text-[10px]">(ban)</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {NAV_ITEMS.map((item) => (
            <tr key={item.href} className="border-b last:border-0">
              <td className="py-2 pr-3">
                <span className="font-medium">{item.title}</span>
                <code className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                  {item.href}
                </code>
              </td>
              {ROLES.map((r) => {
                const allowed = hasRoleAtLeast(r, item.minRole);
                return (
                  <td key={r} className="px-3 py-2 text-center">
                    {allowed ? (
                      <Check className="mx-auto h-4 w-4 text-emerald-500" />
                    ) : (
                      <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
