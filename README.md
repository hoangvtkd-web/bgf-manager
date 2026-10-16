# BGF Manager

Boilerplate quan ly **Ba Gia Food** xay dung tren **Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Supabase (PostgreSQL + Auth)** voi he thong **phan quyen RBAC** (Admin / Manager / Employee) o tang middleware.

---

## Tinh nang

| Nhom | Chi tiet |
|---|---|
| **Auth** | Dang nhap / Dang ky bang Email & Password qua Supabase Auth; callback route cho email confirmation |
| **RBAC** | 3 vai tro: `admin`, `manager`, `employee`; bang `profiles` luu role, RLS bao ve |
| **Middleware** | Chan/cho phep theo route, tu dong refresh session, redirect khi chua dang nhap |
| **UI** | shadcn/ui + Tailwind, ho tro **Dark / Light / System** mode (next-themes) |
| **Sidebar** | Menu tu dong **an/hien theo quyen** cua user dang dang nhap |
| **Server + Client** | Supabase client rieng cho Server Components va Client Components (`@supabase/ssr`) |
| **San sang Vercel** | Cau hinh toi uu, chi can them Environment Variables |

---

## Ma tran phan quyen

| Route | Employee | Manager | Admin |
|---|:---:|:---:|:---:|
| `/dashboard` | ✅ | ✅ | ✅ |
| `/profile` | ✅ | ✅ | ✅ |
| `/reports` | ❌ | ✅ | ✅ |
| `/settings` | ❌ | ❌ | ✅ |

> Cau hinh tap trung tai `types/rbac.ts` (`PROTECTED_ROUTES`) va `lib/nav-config.ts` (`NAV_ITEMS`).

---

## Cau truc thu muc

```
bgf-manager/
├── app/
│   ├── (auth)/                     # Route group cong khai
│   │   ├── layout.tsx              # Khung trang dang nhap / dang ky
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (protected)/                # Route group YEU CAU DANG NHAP
│   │   ├── layout.tsx              # Sidebar + Header (server-side guard)
│   │   ├── actions.ts              # Server Action: dang xuat
│   │   ├── dashboard/page.tsx      # employee+
│   │   ├── profile/page.tsx        # employee+
│   │   ├── reports/page.tsx        # manager+
│   │   └── settings/page.tsx       # admin only
│   ├── api/auth/callback/route.ts  # Doi code -> session
│   ├── globals.css                 # Theme shadcn (light/dark)
│   ├── layout.tsx                  # Root layout + ThemeProvider
│   └── page.tsx                    # Redirect theo trang thai dang nhap
├── components/
│   ├── auth/                       # login-form, register-form
│   ├── dashboard/                  # sidebar, header, user-menu, role-overview...
│   ├── ui/                         # shadcn/ui primitives
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── lib/
│   ├── auth.ts                     # getCurrentUser / getCurrentProfile / signOut
│   ├── nav-config.ts               # Menu sidebar + minRole
│   └── utils.ts                    # cn(), formatVnd(), formatDateVi()
├── types/
│   ├── database.ts                 # Kieu du lieu Supabase
│   └── rbac.ts                     # UserRole, PROTECTED_ROUTES, hasRoleAtLeast
├── utils/supabase/
│   ├── client.ts                   # Browser client
│   ├── server.ts                   # Server client (cookies)
│   └── middleware-client.ts        # Client rieng cho middleware
├── supabase/schema.sql             # Bang profiles + RLS + trigger
├── middleware.ts                   # PHAN QUYEN THEO ROLE
├── .env.local.example
└── package.json
```

---

## Cai dat

### 1. Cai dependencies

```bash
npm install
```

### 2. Tao project Supabase

1. Vao [supabase.com](https://supabase.com) -> **New project**.
2. Vao **Project Settings -> API**, copy:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Nap schema

Mo **SQL Editor** trong Supabase, dan toan bo noi dung file
[`supabase/schema.sql`](supabase/schema.sql) va bam **Run**.

File nay se tao:
- Enum `user_role` (`admin` / `manager` / `employee`)
- Bang `profiles` (1-1 voi `auth.users`)
- Trigger `handle_new_user()` &mdash; tu tao profile khi co nguoi dang ky (mac dinh `employee`)
- Ham `current_user_role()` / `is_admin()`
- **RLS policies**: user xem/sua profile cua minh, Admin xem/sua tat ca

### 4. Cau hinh bien moi truong

```bash
cp .env.local.example .env.local
```

Dien `NEXT_PUBLIC_SUPABASE_URL` va `NEXT_PUBLIC_SUPABASE_ANON_KEY` vua lay.

### 5. Chay dev

```bash
npm run dev
```

Mo [http://localhost:3000](http://localhost:3000) -> tu dong ve `/login`.

---

## Cap quyen (nang len Manager / Admin)

Sau khi dang ky, user mac dinh la `employee`. Vao **Supabase SQL Editor** chay:

```sql
-- Nang len Quan ly
update public.profiles set role = 'manager' where email = 'quanly@bagiafood.vn';

-- Nang len Quan tri vien
update public.profiles set role = 'admin'   where email = 'admin@bagiafood.vn';
```

Hoac sua truc tiep trong **Table Editor -> profiles -> cot role**.
Sau khi doi role, dang xuat roi dang nhap lai de menu cap nhat.

---

## Trien khai len Vercel

1. Push code len GitHub.
2. Vao [vercel.com/new](https://vercel.com/new) -> **Import** repo.
3. Them **Environment Variables** (Production + Preview + Development):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy**.
5. Trong Supabase -> **Authentication -> URL Configuration**, them domain Vercel
   vao `Site URL` va `Redirect URLs` (dang `https://<app>.vercel.app/**`).

---

## Ghi chu ky thuat

- **Middleware** (`middleware.ts`) chay tren moi request: refresh session -> doc
  `role` tu bang `profiles` -> so khop `PROTECTED_ROUTES` -> redirect neu khong du quyen.
- **3 lop bao ve** (defense in depth):
  1. `middleware.ts` &mdash; chan truoc khi vao app
  2. `app/(protected)/layout.tsx` &mdash; guard server-side
  3. Tung trang (`reports`, `settings`) &mdash; `hasRoleAtLeast()` + component `RequireRole`
- **Sidebar** loc menu bang `hasRoleAtLeast(role, item.minRole)` &mdash; user chi thay muc minh duoc vao.
- **RLS** bao ve du lieu o tang database ke ca khi client bi loi dung.
