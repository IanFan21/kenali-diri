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
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: "",

  /* Opsional. Tampil di footer. Contoh: "SMK Negeri 1 Contoh" */
  NAMA_SEKOLAH: "",

  /* Opsional. Alamat berkas logo, misalnya "img/logo.png". Kosongkan jika tidak ada. */
  LOGO: ""
};
