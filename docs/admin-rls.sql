-- Hak akses administrator Biblio.
-- Tabel biblio_admins dan kolom aktif tersedia melalui docs/biblio-fitur.sql.

create schema if not exists private;
revoke all on schema private from public,anon;
grant usage on schema private to authenticated;

create or replace function private.biblio_has_access()
returns boolean language sql stable security definer set search_path=''
as $$
  select exists (
    select 1 from public.biblio_admins
    where user_id=(select auth.uid()) and aktif=true
  )
$$;
revoke all on function private.biblio_has_access() from public,anon;
grant execute on function private.biblio_has_access() to authenticated;

alter table public.produk enable row level security;
drop policy if exists admin_baca_produk on public.produk;
drop policy if exists admin_tambah_produk on public.produk;
drop policy if exists admin_ubah_produk on public.produk;
drop policy if exists admin_hapus_produk on public.produk;
create policy admin_baca_produk on public.produk
for select to authenticated using ((select private.biblio_has_access()));
create policy admin_tambah_produk on public.produk
for insert to authenticated with check ((select private.biblio_has_access()));
create policy admin_ubah_produk on public.produk
for update to authenticated using ((select private.biblio_has_access()))
with check ((select private.biblio_has_access()));
create policy admin_hapus_produk on public.produk
for delete to authenticated using ((select private.biblio_has_access()));
