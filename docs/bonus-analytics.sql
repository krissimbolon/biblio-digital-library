create table if not exists public.wa_clicks (
  id bigint generated always as identity primary key,
  produk_id bigint not null references public.produk(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists idx_biblio_wa_clicks_produk on public.wa_clicks(produk_id,created_at);
alter table public.wa_clicks enable row level security;
