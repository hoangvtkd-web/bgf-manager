/**
 * Test: kiem tra logic RBAC + cau truc project boilerplate
 * Chay: node tests/rbac.test.js
 */
const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; console.log('  PASS  ' + name); }
  else { fail++; console.log('  FAIL  ' + name); }
}

const base = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(base, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(base, p));

console.log('Test suite: RBAC logic + cau truc project');

/* ---------- 1. Cau truc thu muc bat buoc ---------- */
const REQUIRED_FILES = [
  'middleware.ts',
  '.env.local.example',
  'package.json',
  'tsconfig.json',
  'tailwind.config.ts',
  'next.config.mjs',
  'components.json',
  'README.md',
  'supabase/schema.sql',
  'utils/supabase/client.ts',
  'utils/supabase/server.ts',
  'utils/supabase/middleware-client.ts',
  'types/rbac.ts',
  'types/database.ts',
  'lib/auth.ts',
  'lib/nav-config.ts',
  'lib/utils.ts',
  'app/layout.tsx',
  'app/globals.css',
  'app/(auth)/layout.tsx',
  'app/(auth)/login/page.tsx',
  'app/(auth)/register/page.tsx',
  'app/(protected)/layout.tsx',
  'app/(protected)/dashboard/page.tsx',
  'app/(protected)/reports/page.tsx',
  'app/(protected)/settings/page.tsx',
  'app/(protected)/profile/page.tsx',
  'app/api/auth/callback/route.ts',
  'components/ui/button.tsx',
  'components/ui/input.tsx',
  'components/ui/label.tsx',
  'components/ui/card.tsx',
  'components/ui/avatar.tsx',
  'components/ui/badge.tsx',
  'components/ui/dropdown-menu.tsx',
  'components/ui/separator.tsx',
  'components/ui/alert.tsx',
  'components/ui/sonner.tsx',
  'components/theme-provider.tsx',
  'components/theme-toggle.tsx',
  'components/auth/login-form.tsx',
  'components/auth/register-form.tsx',
  'components/dashboard/sidebar-nav.tsx',
  'components/dashboard/user-menu.tsx',
  'components/dashboard/app-header.tsx',
  'components/dashboard/mobile-nav.tsx',
  'components/dashboard/role-overview.tsx',
  'components/dashboard/require-role.tsx',
  'components/dashboard/protected-banner.tsx',
  'components/dashboard/sidebar-brand.tsx',
];
REQUIRED_FILES.forEach((f) => ok('Co file: ' + f, exists(f)));

/* ---------- 2. Logic RBAC (types/rbac.ts) ---------- */
const rbac = read('types/rbac.ts');
ok('rbac dinh nghia 3 role', /'admin' \| 'manager' \| 'employee'/.test(rbac));
ok('rbac co ROLE_RANK', /ROLE_RANK/.test(rbac));
ok('rbac co hasRoleAtLeast', /export function hasRoleAtLeast/.test(rbac));
ok('rbac co requiredRoleFor', /export function requiredRoleFor/.test(rbac));
ok('rbac co PROTECTED_ROUTES', /export const PROTECTED_ROUTES/.test(rbac));
ok('/settings yeu cau admin', /prefix: '\/settings', minRole: 'admin'/.test(rbac));
ok('/reports yeu cau manager', /prefix: '\/reports', minRole: 'manager'/.test(rbac));
ok('/profile yeu cau employee', /prefix: '\/profile', minRole: 'employee'/.test(rbac));
ok('/dashboard yeu cau employee', /prefix: '\/dashboard', minRole: 'employee'/.test(rbac));
ok('rank: employee=1', /employee: 1/.test(rbac));
ok('rank: manager=2', /manager: 2/.test(rbac));
ok('rank: admin=3', /admin: 3/.test(rbac));

/* ---------- 3. Middleware phan quyen ---------- */
const mw = read('middleware.ts');
ok('middleware goi auth.getUser()', /supabase\.auth\.getUser\(\)/.test(mw));
ok('middleware doc role tu bang profiles', /from\('profiles'\)[\s\S]{0,60}select\('role'\)/.test(mw));
ok('middleware dung requiredRoleFor', /requiredRoleFor\(pathname\)/.test(mw));
ok('middleware dung hasRoleAtLeast', /hasRoleAtLeast\(role, minRole\)/.test(mw));
ok('middleware redirect /login khi chua dang nhap', /pathname = '\/login'/.test(mw));
ok('middleware gan redirectTo', /searchParams\.set\('redirectTo'/.test(mw));
ok('middleware redirect /dashboard khi thieu quyen', /set\('denied', pathname\)/.test(mw));
ok('middleware co matcher', /export const config[\s\S]*matcher/.test(mw));

/* ---------- 4. Nav config dong bo role ---------- */
const nav = read('lib/nav-config.ts');
ok('nav co NAV_ITEMS', /export const NAV_ITEMS/.test(nav));
ok('nav: Bao cao minRole manager', /title: 'Bao cao'[\s\S]{0,200}minRole: 'manager'/.test(nav));
ok('nav: Cau hinh he thong minRole admin', /title: 'Cau hinh he thong'[\s\S]{0,200}minRole: 'admin'/.test(nav));
ok('nav: Tong quan minRole employee', /title: 'Tong quan'[\s\S]{0,200}minRole: 'employee'/.test(nav));

/* ---------- 5. Sidebar an/hien theo role ---------- */
const sidebar = read('components/dashboard/sidebar-nav.tsx');
ok('sidebar loc menu theo hasRoleAtLeast', /hasRoleAtLeast\(role, item\.minRole\)/.test(sidebar));

/* ---------- 6. Trang bao ve 2 lop ---------- */
const reports = read('app/(protected)/reports/page.tsx');
const settings = read('app/(protected)/settings/page.tsx');
ok('reports guard bang hasRoleAtLeast', /hasRoleAtLeast\(profile\.role, 'manager'\)/.test(reports));
ok('reports dung RequireRole', /RequireRole/.test(reports));
ok('settings guard bang hasRoleAtLeast', /hasRoleAtLeast\(profile\.role, 'admin'\)/.test(settings));
ok('settings dung RequireRole', /RequireRole/.test(settings));

/* ---------- 7. Supabase clients ---------- */
const client = read('utils/supabase/client.ts');
const server = read('utils/supabase/server.ts');
const mwc = read('utils/supabase/middleware-client.ts');
ok('browser client dung createBrowserClient', /createBrowserClient/.test(client));
ok('server client dung createServerClient', /createServerClient/.test(server));
ok('server client doc cookies()', /cookies\(\)/.test(server));
ok('middleware client dong bo cookie', /response\.cookies\.set/.test(mwc));
ok('middleware client tra ve getResponse', /getResponse/.test(mwc));

/* ---------- 8. SQL schema ---------- */
const sql = read('supabase/schema.sql');
ok('SQL tao enum user_role', /create type public\.user_role as enum/.test(sql));
ok('SQL enum co 3 gia tri', /'admin', 'manager', 'employee'/.test(sql));
ok('SQL tao bang profiles', /create table if not exists public\.profiles/.test(sql));
ok('SQL profiles tham chieu auth.users', /references auth\.users/.test(sql));
ok('SQL co trigger handle_new_user', /handle_new_user/.test(sql));
ok('SQL trigger default employee', /'employee'\s*\n?\s*\)/.test(sql) || /role\s*\)\s*values[\s\S]{0,120}'employee'/.test(sql));
ok('SQL bat RLS', /alter table public\.profiles enable row level security/.test(sql));
ok('SQL co policy select_own', /profiles_select_own/.test(sql));
ok('SQL co policy select_admin', /profiles_select_admin/.test(sql));
ok('SQL co ham is_admin()', /create or replace function public\.is_admin\(\)/.test(sql));

/* ---------- 9. Env example ---------- */
const env = read('.env.local.example');
ok('env mau co NEXT_PUBLIC_SUPABASE_URL', /NEXT_PUBLIC_SUPABASE_URL/.test(env));
ok('env mau co NEXT_PUBLIC_SUPABASE_ANON_KEY', /NEXT_PUBLIC_SUPABASE_ANON_KEY/.test(env));

/* ---------- 10. Dark mode ---------- */
const globals = read('app/globals.css');
const tailwind = read('tailwind.config.ts');
ok('globals.css co class .dark', /\.dark \{/.test(globals));
ok('globals.css co --primary', /--primary:/.test(globals));
ok('tailwind darkMode class', /darkMode: \['class'\]/.test(tailwind));

/* ---------- 11. Auth forms dung Supabase ---------- */
const login = read('components/auth/login-form.tsx');
const register = read('components/auth/register-form.tsx');
ok('login dung signInWithPassword', /signInWithPassword/.test(login));
ok('register dung auth.signUp', /auth\.signUp/.test(register));
ok('register gui full_name trong metadata', /full_name: fullName/.test(register));

/* ---------- 12. TypeScript strict ---------- */
const tsconfig = JSON.parse(read('tsconfig.json'));
ok('tsconfig bat strict', tsconfig.compilerOptions.strict === true);
ok('tsconfig co path alias @/*', tsconfig.compilerOptions.paths['@/*'][0] === './*');

/* ---------- 13. package.json ---------- */
const pkg = JSON.parse(read('package.json'));
ok('co dependency next 14', /^14\./.test(pkg.dependencies.next));
ok('co @supabase/ssr', !!pkg.dependencies['@supabase/ssr']);
ok('co @supabase/supabase-js', !!pkg.dependencies['@supabase/supabase-js']);
ok('co tailwindcss', !!pkg.devDependencies.tailwindcss);
ok('co typescript', !!pkg.devDependencies.typescript);
ok('co script typecheck', !!pkg.scripts.typecheck);

console.log(`\nKet qua: ${pass} PASS / ${fail} FAIL`);
process.exit(fail ? 1 : 0);
