-- Kebijakan akses dan pembatasan kiriman Biblio.

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.biblio_has_access()
returns boolean language sql stable security definer set search_path=''
as $$
  select exists (
    select 1 from public.biblio_admins
    where user_id=(select auth.uid()) and aktif=true
  )
$$;
revoke all on function private.biblio_has_access() from public, anon;
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
drop function if exists public.is_biblio_admin();

create or replace function public.biblio_consume_limit(
  p_kind text,p_source text,p_window_seconds integer,p_max integer
) returns boolean language plpgsql security invoker set search_path=''
as $$
declare
  n bigint;
begin
  if p_kind is null or length(p_kind)>40 or length(p_kind)<1
    or p_source is null or length(p_source)>128 or length(p_source)<1
    or p_window_seconds not between 1 and 86400
    or p_max not between 1 and 100 then
    return false;
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_kind||':'||p_source,0));
  select count(*) into n from public.batas_kiriman
    where jenis=p_kind and sumber=p_source
      and created_at>pg_catalog.now()-pg_catalog.make_interval(secs=>p_window_seconds);
  if n>=p_max then return false; end if;
  insert into public.batas_kiriman(jenis,sumber) values(p_kind,p_source);
  return true;
end;
$$;
revoke all on function public.biblio_consume_limit(text,text,integer,integer) from public,anon,authenticated;
grant execute on function public.biblio_consume_limit(text,text,integer,integer) to service_role;

revoke execute on function public.rls_auto_enable() from public,anon,authenticated;
