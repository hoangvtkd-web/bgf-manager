# BGF Manager - Huong dan Deploy len Web

## Thong tin da san sang

| Muc | Gia tri |
|---|---|
| Supabase URL | `https://zkocihthcdzxoahatjhe.supabase.co` |
| Supabase Anon Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (da co trong .env.local) |
| GitHub username | `hoangvtkd-web` |
| Git commit | `4eef9b9` (63 files, 10.582 dong code) |
| App test local | `/login` = HTTP 200, middleware redirect dung |
| Supabase Auth | Da test signup thanh cong (user ID: 0152cc11...) |

---

## BUOC 1: Nap SQL Schema vao Supabase (BAT BUOC TRUOC)

> App se KHONG chay dung neu chua nap schema!

1. Mo: https://supabase.com/dashboard/project/zkocihthcdzxoahatjhe/sql/new
2. Mo file `supabase/schema.sql` trong thu muc bgf-manager
3. Copy toan bo noi dung file -> dan vao SQL Editor
4. Bam **Run** (hoac Ctrl+Enter)
5. Xac nhan: thay "Success. No rows returned"

**Kiem tra:** Mo https://supabase.com/dashboard/project/zkocihthcdzxoahatjhe/editor → bang `profiles` phai xuat hien (rong).

---

## BUOC 2: Tao GitHub Repository

1. Mo: https://github.com/new
2. **Repository name:** `bgf-manager`
3. **Description:** `Next.js 14 + Supabase + RBAC boilerplate for Ba Gia Food`
4. Chon **Private** (hoac Public)
5. KHONG tick "Add a README file"
6. KHONG tick ".gitignore" hay "license"
7. Bam **Create repository**

Sau khi tao xong, repo se nam tai: `https://github.com/hoangvtkd-web/bgf-manager`

---

## BUOC 3: Push code len GitHub

Mo **Git Bash** (hoac terminal) va chay:

```bash
cd "C:/Users/admin/WorkBuddy AI/2026-10-15-15-52-25/bgf-manager"

# Remote da duoc them san, chi can push:
git push -u origin main
```

> Neu git hoi username/password:
> - Username: `hoangvtkd-web`
> - Password: Dung **Personal Access Token** (khong dung password thuong)
>   - Tao PAT tai: https://github.com/settings/tokens → Generate new token (classic) → tick "repo" → Copy token
>   - Dan token vao lam password khi git hoi

Hoac cai GitHub CLI:
```bash
# Windows: winget install GitHub.cli
gh auth login
gh repo create hoangvtkd-web/bgf-manager --source=. --push
```

---

## BUOC 4: Deploy len Vercel

1. Mo: https://vercel.com/new
2. Dang nhap bang GitHub
3. Bam **Import** chon repo `bgf-manager`
4. Vercel tu phat hien Next.js → khong can doi gi
5. Mo muc **Environment Variables** → them 2 bien:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://zkocihthcdzxoahatjhe.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inprb2NpaHRoY2R6eG9haGF0amhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMjE5NTcsImV4cCI6MjEwNzY5Nzk1N30.R-ulQAMgnmI7eHW8VaFCAgN15IQo3GlG8jpCAvWeaPk` |

6. Bam **Deploy**
7. Cho ~2-3 phut → nhan link: `https://bgf-manager-xxx.vercel.app`

---

## BUOC 5: Cau hinh Supabase Auth Redirect URLs

1. Mo: https://supabase.com/dashboard/project/zkocihthcdzxoahatjhe/auth/url-configuration
2. **Site URL:** doi thanh link Vercel (vd: `https://bgf-manager-xxx.vercel.app`)
3. **Redirect URLs:** them `https://bgf-manager-xxx.vercel.app/**`
4. Bam **Save**

---

## BUOC 6: Test app da deploy

1. Mo link Vercel → trang login hien ra
2. Dang ky tai khoan moi (email that de xac nhan)
3. Mo email confirm → bam link xac nhan
4. Dang nhap → vao Dashboard (role mac dinh: employee → sidebar hien 2/4 menu)
5. De nang len Admin:
   - Mo Supabase → SQL Editor → chay:
   ```sql
   update public.profiles set role = 'admin' where email = 'YOUR_EMAIL@gmail.com';
   ```
   - Dang xuat → dang nhap lai → sidebar hien 4/4 menu

---

## Tai khoan da tao (test)

| Email | Password | User ID |
|---|---|---|
| hoangvtkd.web@gmail.com | BenZoey@2026 | 0152cc11-4b3d-44bd-a36c-db736c1fbfbb |

> Can xac nhan email truoc khi dang nhap duoc (Supabase Auth yeu cau email confirmation)
> Hoac tat "Confirm email" tai: Supabase Dashboard → Authentication → Providers → Email → Disable "Confirm email"
