create table if not exists public.biblio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.biblio_admins enable row level security;

create or replace function public.is_biblio_admin()
returns boolean language sql stable security definer set search_path=''
as $$
  select exists(select 1 from public.biblio_admins a where a.user_id=auth.uid())
$$;

do $
begin
  if not exists (select 1 from public.biblio_admins) then
    raise exception 'Daftarkan administrator lebih dulu.';
  end if;
end $;

drop policy if exists "admin_baca_produk" on public.produk;
drop policy if exists "admin_tambah_produk" on public.produk;
drop policy if exists "admin_ubah_produk" on public.produk;
drop policy if exists "admin_hapus_produk" on public.produk;

create policy "admin_baca_produk" on public.produk
for select to authenticated using (public.is_biblio_admin());
create policy "admin_tambah_produk" on public.produk
for insert to authenticated with check (public.is_biblio_admin());
create policy "admin_ubah_produk" on public.produk
for update to authenticated using (public.is_biblio_admin())
with check (public.is_biblio_admin());
create policy "admin_hapus_produk" on public.produk
for delete to authenticated using (public.is_biblio_admin());

-- Hak tulis katalog berlaku untuk UID yang tercatat di public.biblio_admins.
