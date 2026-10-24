# Kenali Diri

Situs statis berisi dua tes untuk siswa: **tes gaya belajar** (visual, auditori, kinestetik) dan **inventori kepribadian** (lima dimensi: ekstraversi, keramahan, kehati-hatian, kestabilan emosi, keterbukaan). Cocok dihosting di GitHub Pages.

## Cara kerja privasi

GitHub Pages hanya menyajikan berkas statis, jadi data disimpan di database **Supabase** (gratis untuk skala kelas). Perlindungan nama siswa ada di aturan akses database, bukan di kerahasiaan kunci.

| Siapa | Yang bisa dilakukan |
| --- | --- |
| Siswa dan pengunjung | Mengirim hasil tes. Tidak bisa membaca tabel hasil. |
| Halaman publik (`hasil.html`) | Membaca view `hasil_publik`: kode, kelas, jenis tes, skor, hasil, tanggal. **Tanpa nama.** |
| Admin (`admin.html`) | Setelah login dengan akun admin: melihat nama, mengunduh CSV, menghapus baris. |

Setiap siswa menerima **kode hasil** enam karakter setelah selesai. Dengan kode itu mereka bisa mencari hasilnya sendiri di halaman publik tanpa nama mereka tampil.

## Pasang (sekitar 15 menit)

1. **Buat proyek Supabase** di <https://supabase.com> (gratis). Catat password database.
2. **Jalankan skema.** Buka *SQL Editor*, buat query baru, tempel seluruh isi `supabase/schema.sql`, lalu *Run*.
3. **Buat akun admin.** Di *Authentication > Users*, tambahkan pengguna baru dengan email dan kata sandi Anda, dan centang konfirmasi otomatis (nama menu bisa sedikit berbeda antarversi dasbor).
4. **Daftarkan email admin.** Di *SQL Editor*, jalankan:
   ```sql
   insert into public.admin_email (email) values ('emailanda@contoh.com');
   ```
   Pakai huruf kecil, dan emailnya harus sama dengan akun di langkah 3. Tanpa langkah ini, halaman admin menolak semua orang.
5. **Matikan pendaftaran publik.** Di pengaturan *Authentication*, matikan opsi yang mengizinkan pengguna baru mendaftar sendiri. Ini lapisan pengaman tambahan; akses admin tetap dibatasi oleh daftar `admin_email`.
6. **Isi `js/config.js`.** Salin *Project URL* dan kunci *anon / publishable* dari *Project Settings > API*. Isi `SUPABASE_URL` dan `SUPABASE_ANON_KEY`. Kunci ini memang publik. **Jangan pernah** menaruh `service_role` key di situs.
7. **Unggah ke GitHub** dan aktifkan GitHub Pages (*Settings > Pages*, pilih branch utama dan folder root).
8. **Uji.** Kerjakan satu tes, lalu cek: hasil muncul di `hasil.html` **tanpa nama**, dan di `admin.html` setelah login nama terlihat.

Opsional di `js/config.js`: `NAMA_SEKOLAH` (tampil di footer) dan `LOGO` (alamat berkas gambar, misalnya `img/logo.png`).

## Mode percobaan

Jika `SUPABASE_URL` dan `SUPABASE_ANON_KEY` dikosongkan, situs berjalan tanpa database: data hanya tersimpan di browser perangkat itu, dan halaman admin terbuka tanpa login. Pita di bagian atas halaman menandai mode ini. Pakai hanya untuk mencoba tampilan, bukan untuk data siswa sungguhan.

## Menjalankan di komputer sendiri

Tidak butuh instalasi. Buka `index.html` langsung, atau jalankan server lokal:

```
python3 -m http.server 8000
```

lalu buka <http://localhost:8000>.

## Mengubah isi

- **Soal, deskripsi hasil, dan aturan skor:** `js/soal.js`. Jumlah soal bebas diubah, tetapi tampilan "dari 30" di beberapa tempat mengikuti 30 butir (6 butir per dimensi kepribadian).
- **Warna dan huruf:** token di bagian atas `css/style.css`.
- **Pustaka Supabase** disertakan di `js/vendor/supabase-2.118.0.js` (lisensi MIT) agar situs tidak bergantung pada CDN.

## Cara skor dihitung

- **Gaya belajar:** 30 soal, tiap soal tiga pilihan (visual, auditori, kinestetik). Gaya dengan jawaban terbanyak menjadi hasil. Jika seri, hasilnya gabungan.
- **Kepribadian:** 30 pernyataan, skala 1 sampai 5, enam butir per dimensi (sebagian dibalik). Skor dimensi 6 sampai 30. Kategori rendah (6 sampai 14), sedang (15 sampai 21), tinggi (22 sampai 30). Batas ini kesepakatan praktis untuk kelas, **bukan norma baku**. Dua dimensi tertinggi dipakai sebagai ringkasan; jika selisih tertinggi dan terendah 4 poin atau kurang, hasilnya "Seimbang".

Butir soal ditulis khusus untuk situs ini. Keduanya alat bantu pengenalan diri, **bukan alat diagnosis psikologis**, dan situs menyatakan hal itu kepada siswa.

## Batasan yang perlu diketahui

- **Tidak ada pembatas kiriman atau captcha.** Siapa pun yang tahu alamat situs bisa mengirim data palsu. Untuk kelas biasanya cukup; jika perlu, tambahkan Cloudflare Turnstile atau batas laju di sisi Supabase.
- **Kelas tampil di halaman publik.** Dengan kelas kecil, seseorang mungkin menebak pemilik kode. Jika tidak diinginkan, ubah view `hasil_publik` agar tidak memuat kolom `kelas`.
- **Maksimal 1000 baris** dimuat per halaman. Cukup untuk beberapa kelas; untuk sekolah besar tambahkan penomoran halaman.
- **Siswa yang kehilangan kode** tidak bisa menemukan hasilnya sendiri, karena nama sengaja tidak tersedia publik. Guru bisa mencarinya lewat nama di halaman admin.
- Proyek gratis Supabase bisa dijeda otomatis bila lama tidak dipakai. Periksa kebijakan terbaru di situs Supabase.
- Data nama siswa adalah data pribadi. Pastikan penggunaannya sejalan dengan kebijakan sekolah Anda.
