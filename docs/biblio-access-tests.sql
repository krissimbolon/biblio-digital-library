-- Pemeriksaan baca untuk peran nonadministrator dan administrator aktif.
-- Tidak mengubah baris produk dan tidak menyimpan identitas uji.

do $$
declare
  observed integer;
  valid_uid text;
begin
  select user_id::text into valid_uid from public.biblio_admins where aktif=true limit 1;
  if valid_uid is null then raise exception 'Tidak ada administrator aktif'; end if;
  execute 'set local role authenticated';
  perform set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
  select count(*) into observed from public.produk;
  if observed<>0 then raise exception 'Akses akun biasa tidak ditolak: %',observed; end if;
  perform set_config('request.jwt.claim.sub',valid_uid,true);
  select count(*) into observed from public.produk;
  if observed<1 then raise exception 'Administrator aktif tidak dapat membaca katalog'; end if;
end $$;

do $$
begin
  if has_function_privilege('anon','public.biblio_consume_limit(text,text,integer,integer)','execute') then
    raise exception 'Pemanggil anonim dapat menggunakan fungsi batas';
  end if;
  if has_function_privilege('authenticated','public.biblio_consume_limit(text,text,integer,integer)','execute') then
    raise exception 'Pemanggil biasa dapat menggunakan fungsi batas';
  end if;
  if not has_function_privilege('service_role','public.biblio_consume_limit(text,text,integer,integer)','execute') then
    raise exception 'Layanan tidak dapat menggunakan fungsi batas';
  end if;
end $$;
