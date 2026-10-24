/*
  Pengaturan situs. Ubah nilai di bawah ini, simpan, lalu unggah ulang ke GitHub.

  SUPABASE_URL dan SUPABASE_ANON_KEY boleh terlihat publik: keduanya memang
  dirancang untuk dipakai di browser. Yang melindungi nama siswa adalah aturan
  akses di database (lihat supabase/schema.sql), bukan kerahasiaan kunci ini.
  JANGAN PERNAH menaruh "service_role key" di berkas ini.

  Jika kedua nilai Supabase dikosongkan, situs berjalan dalam mode percobaan:
  data hanya disimpan di browser perangkat itu sendiri.
*/
window.KD = window.KD || {};
window.KD.CONFIG = {
  SUPABASE_URL: "https://zddipoovclrtlnvamauc.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZGlwb292Y2xydGxudmFtYXVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4MzY5MzMsImV4cCI6MjEwODQxMjkzM30.m5oWaRLE07y5bw0KY8NkANY-dDgVDbGXOYATvBV7xho",

  /* Opsional. Tampil di footer. Contoh: "SMK Negeri 1 Contoh" */
  NAMA_SEKOLAH: "",

  /* Opsional. Alamat berkas logo, misalnya "img/logo.png". Kosongkan jika tidak ada. */
  LOGO: ""
};
