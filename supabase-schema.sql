-- TITIwritesRandom production database
-- 1) Create your ONE Supabase Auth user first.
-- 2) Copy that user's UUID into the INSERT below.
-- 3) Run this whole SQL file.
-- 4) Disable public sign-ups in Supabase Auth settings.

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create table if not exists public.writings (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  slug text not null unique,
  date_label text,
  body text not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admins enable row level security;
alter table public.writings enable row level security;

revoke all on public.admins from anon, authenticated;
revoke all on public.writings from anon, authenticated;
grant select on public.writings to anon;
grant select, insert, update, delete on public.writings to authenticated;

drop policy if exists "Public can read published writings" on public.writings;
create policy "Public can read published writings"
on public.writings for select to anon
using (published = true);

drop policy if exists "Admin can read writings" on public.writings;
create policy "Admin can read writings"
on public.writings for select to authenticated
using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "Admin can insert writings" on public.writings;
create policy "Admin can insert writings"
on public.writings for insert to authenticated
with check (
  author_id = auth.uid()
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
);

drop policy if exists "Admin can update writings" on public.writings;
create policy "Admin can update writings"
on public.writings for update to authenticated
using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
with check (
  author_id = auth.uid()
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
);

drop policy if exists "Admin can delete writings" on public.writings;
create policy "Admin can delete writings"
on public.writings for delete to authenticated
using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- IMPORTANT: replace this UUID with YOUR Auth user's UUID.
-- insert into public.admins (user_id) values ('YOUR-AUTH-USER-UUID');

create or replace function public.set_writings_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists writings_updated_at on public.writings;
create trigger writings_updated_at
before update on public.writings
for each row execute function public.set_writings_updated_at();
