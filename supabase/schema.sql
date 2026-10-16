-- ============================================================================
--  BGF Manager - Supabase schema (PostgreSQL)
--  Chay file nay trong: Supabase Dashboard -> SQL Editor -> New query
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1) Enum vai tro (RBAC)
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('admin', 'manager', 'employee');
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2) Bang `profiles` luu role cua tung user (1-1 voi auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  role        public.user_role not null default 'employee',
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'Ho so nguoi dung + vai tro (RBAC)';

-- Index phu de tra cuu nhanh theo role / email
create index if not exists profiles_role_idx  on public.profiles (role);
create index if not exists profiles_email_idx on public.profiles (email);

-- ---------------------------------------------------------------------------
-- 3) Tu dong cap nhat `updated_at`
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 4) Trigger: tu dong tao profile khi co user dang ky moi
--    - Doc `full_name` tu raw_user_meta_data
--    - Vai tro mac dinh: 'employee'
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    'employee'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 5) Ham tien ich kiem tra role (dung trong RLS, tranh de quy)
-- ---------------------------------------------------------------------------
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'admin', false);
$$;

-- ---------------------------------------------------------------------------
-- 6) Row Level Security (RLS)
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- Xoa policy cu (neu chay lai file)
drop policy if exists "profiles_select_own"   on public.profiles;
drop policy if exists "profiles_select_admin" on public.profiles;
drop policy if exists "profiles_update_own"   on public.profiles;
drop policy if exists "profiles_update_admin" on public.profiles;

-- User doc duoc profile cua chinh minh
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

-- Admin doc duoc tat ca profile
create policy "profiles_select_admin"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

-- User tu sua full_name / avatar (KHONG duoc doi role cua chinh minh)
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select role from public.profiles where id = auth.uid())
  );

-- Admin sua duoc moi thu (ke ca doi role cua nguoi khac)
create policy "profiles_update_admin"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 7) Du lieu mau: nang quyen cho 1 email thanh Admin (tuy chon)
--    Thay email ben duoi bang email that cua ban roi bo comment.
-- ---------------------------------------------------------------------------
-- update public.profiles
--    set role = 'admin'
--  where email = 'admin@bagiafood.vn';

-- ---------------------------------------------------------------------------
-- 8) Kiem tra ket qua
-- ---------------------------------------------------------------------------
-- select id, email, full_name, role, created_at from public.profiles order by created_at desc;
