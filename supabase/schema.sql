-- Skema database Kenali Diri (Supabase / PostgreSQL).
-- Jalankan sekali: Supabase > SQL Editor > New query > tempel seluruh isi berkas ini > Run.
--
-- Rancangan privasi:
--   * Siswa (anon) hanya boleh MENAMBAH baris. Mereka tidak bisa membaca tabel hasil_tes.
--   * Halaman publik membaca view hasil_publik, yang TIDAK memuat kolom nama.
--   * Hanya akun yang emailnya terdaftar di admin_email yang bisa membaca nama dan menghapus.

-- 1. Daftar email admin ------------------------------------------------------

create table if not exists public.admin_email (
  email text primary key check (email = lower(email))
);
alter table public.admin_email enable row level security;
revoke all on public.admin_email from anon, authenticated;
-- Sengaja tanpa policy: tidak ada klien yang bisa membaca atau mengubah tabel ini.

create or replace function public.saya_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_email
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.saya_admin() from public, anon;
grant execute on function public.saya_admin() to authenticated;

-- 2. Tabel hasil -------------------------------------------------------------

create table if not exists public.hasil_tes (
  id     uuid primary key default gen_random_uuid(),
  kode   text not null unique check (kode ~ '^[A-HJ-NP-Z2-9]{6}$'),
  jenis  text not null check (jenis in ('gaya_belajar', 'kepribadian')),
  nama   text not null check (char_length(nama) between 2 and 80),
  kelas  text not null check (char_length(kelas) between 1 and 30),
  skor   jsonb not null check (jsonb_typeof(skor) = 'object' and length(skor::text) < 200),
  hasil  text not null check (char_length(hasil) between 1 and 60),
  dibuat timestamptz not null default now(),
  constraint skor_sesuai_jenis check (
    (jenis = 'gaya_belajar' and skor ?& array['V', 'A', 'K'])
    or (jenis = 'kepribadian' and skor ?& array['E', 'A', 'C', 'S', 'O'])
  )
);
create index if not exists hasil_tes_dibuat_idx on public.hasil_tes (dibuat desc);

alter table public.hasil_tes enable row level security;

-- Cabut semua hak bawaan, lalu beri hanya yang diperlukan.
revoke all on public.hasil_tes from anon, authenticated;
grant insert (kode, jenis, nama, kelas, skor, hasil) on public.hasil_tes to anon, authenticated;
grant select, delete on public.hasil_tes to authenticated;

drop policy if exists siswa_kirim on public.hasil_tes;
drop policy if exists admin_baca  on public.hasil_tes;
drop policy if exists admin_hapus on public.hasil_tes;

create policy siswa_kirim on public.hasil_tes
  for insert to anon, authenticated
  with check (true);

create policy admin_baca on public.hasil_tes
  for select to authenticated
  using (public.saya_admin());

create policy admin_hapus on public.hasil_tes
  for delete to authenticated
  using (public.saya_admin());

-- 3. View publik tanpa nama --------------------------------------------------
-- View berjalan dengan hak pemiliknya, jadi bisa membaca tabel meski anon tidak bisa.
-- Karena kolom nama tidak ikut dipilih, nama tidak mungkin bocor lewat view ini.

create or replace view public.hasil_publik
  with (security_invoker = false)
as
  select kode, jenis, kelas, skor, hasil, dibuat
  from public.hasil_tes;

revoke all on public.hasil_publik from anon, authenticated;
grant select on public.hasil_publik to anon, authenticated;

-- 4. Daftarkan email admin ---------------------------------------------------
-- Hapus tanda "--" di depan baris di bawah, ganti dengan email admin (huruf kecil), lalu jalankan.
-- Email ini harus sama dengan akun yang Anda buat di Authentication > Users.
-- Jika langkah ini terlewat, tidak ada yang bisa membuka halaman admin (aman, tetapi belum berfungsi).
--
-- insert into public.admin_email (email) values ('emailanda@contoh.com');

-- 5. Pemeriksaan (opsional) --------------------------------------------------
-- select email from public.admin_email;        -- harus berisi email Anda saja
-- select * from public.hasil_publik limit 5;   -- tidak boleh ada kolom nama
