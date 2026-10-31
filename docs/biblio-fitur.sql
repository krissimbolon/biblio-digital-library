-- Struktur data fitur katalog dan panel admin Biblio. Aman dijalankan ulang.

alter table public.produk add column if not exists stok integer not null default 10;
alter table public.produk add column if not exists harga_diskon integer;
alter table public.produk add column if not exists aktif boolean not null default true;
alter table public.produk add column if not exists urutan integer not null default 0;
alter table public.produk add column if not exists galeri text[] not null default '{}';
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'produk_stok_valid') then
    alter table public.produk add constraint produk_stok_valid check (stok >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'produk_harga_diskon_valid') then
    alter table public.produk add constraint produk_harga_diskon_valid check (harga_diskon is null or harga_diskon >= 0);
  end if;
end $$;
update public.produk set urutan = id where urutan = 0;

create table if not exists public.kategori (
  id bigint generated always as identity primary key,
  nama text not null unique check (char_length(nama) between 1 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  created_at timestamptz not null default now()
);
insert into public.kategori (nama, slug)
select distinct p.kategori, trim(both '-' from lower(regexp_replace(p.kategori, '[^A-Za-z0-9]+', '-', 'g')))
from public.produk p where coalesce(trim(p.kategori), '') <> ''
on conflict do nothing;

create table if not exists public.produk_varian (
  id bigint generated always as identity primary key,
  produk_id bigint not null references public.produk(id) on delete cascade,
  nama text not null check (char_length(nama) between 1 and 60),
  harga integer not null check (harga >= 0),
  urutan integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_produk_varian_produk on public.produk_varian(produk_id, urutan);

create table if not exists public.ulasan (
  id bigint generated always as identity primary key,
  produk_id bigint not null references public.produk(id) on delete cascade,
  nama text not null check (char_length(nama) between 1 and 60),
  rating smallint not null check (rating between 1 and 5),
  komentar text not null check (char_length(komentar) between 1 and 1000),
  tampil boolean not null default true,
  sumber text,
  created_at timestamptz not null default now()
);
create index if not exists idx_ulasan_produk on public.ulasan(produk_id, created_at desc);

create table if not exists public.banner (
  id bigint generated always as identity primary key,
  judul text not null check (char_length(judul) between 1 and 120),
  teks text check (char_length(teks) <= 300),
  gambar_url text,
  tautan text,
  aktif boolean not null default true,
  urutan integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pengaturan_toko (
  id smallint primary key default 1 check (id = 1),
  nama text not null,
  nomor_whatsapp text not null check (nomor_whatsapp ~ '^62[0-9]{8,13}$'),
  jam_buka text not null,
  alamat text not null,
  updated_at timestamptz not null default now()
);
insert into public.pengaturan_toko (id, nama, nomor_whatsapp, jam_buka, alamat)
values (1, 'BIBLIO', '6287897802227', 'Koleksi pilihan · Sastra dan literasi', 'Jakarta, Indonesia')
on conflict (id) do nothing;

create table if not exists public.biblio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  aktif boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.biblio_admins add column if not exists email text;
alter table public.biblio_admins add column if not exists aktif boolean not null default true;

create table if not exists public.admin_log (
  id bigint generated always as identity primary key,
  admin_id uuid,
  admin_email text,
  aksi text not null,
  target text,
  created_at timestamptz not null default now()
);
create index if not exists idx_admin_log_waktu on public.admin_log(created_at desc);

create table if not exists public.batas_kiriman (
  id bigint generated always as identity primary key,
  jenis text not null,
  sumber text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_batas_kiriman on public.batas_kiriman(jenis, sumber, created_at desc);

alter table public.kategori enable row level security;
alter table public.produk_varian enable row level security;
alter table public.ulasan enable row level security;
alter table public.banner enable row level security;
alter table public.pengaturan_toko enable row level security;
alter table public.biblio_admins enable row level security;
alter table public.admin_log enable row level security;
alter table public.batas_kiriman enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('sampul', 'sampul', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
