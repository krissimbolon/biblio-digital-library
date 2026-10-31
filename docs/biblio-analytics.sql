-- Ringkasan minat buku pada katalog Biblio.
create or replace view public.biblio_click_totals
with (security_invoker=true) as
select produk_id,count(*)::bigint as total
from public.wa_clicks
group by produk_id;
revoke all on public.biblio_click_totals from anon,authenticated;
grant select on public.biblio_click_totals to service_role;
