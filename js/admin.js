/* Halaman admin: masuk, melihat nama siswa, mengunduh CSV, menghapus. */
(function () {
  const KD = window.KD;
  const h = KD.h;
  const $ = (id) => document.getElementById(id);

  let semua = [];
  let terfilter = [];
  let akanHapus = null;

  const urutKelas = (a, b) => a.localeCompare(b, "id", { numeric: true, sensitivity: "base" });

  function tampil(id) {
    $("memuat").hidden = true;
    ["v-masuk", "v-admin"].forEach((v) => ($(v).hidden = v !== id));
    const j = $(id).querySelector("h1");
    if (j) j.focus({ preventScroll: true });
  }

  /* ---------- Masuk ---------- */

  $("form-masuk").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("email").value.trim();
    const sandi = $("sandi").value;
    const galat = $("galat-masuk");
    galat.textContent = "";
    if (!email || !sandi) {
      galat.textContent = "Isi email dan kata sandi.";
      return;
    }
    const tombol = $("btn-masuk");
    tombol.disabled = true;
    tombol.setAttribute("aria-busy", "true");
    KD.data.masuk(email, sandi).then(
      (s) => {
        $("sandi").value = "";
        if (s.masuk) mulaiAdmin(s);
        else galat.textContent = "Akun ini tidak punya akses admin.";
      },
      (err) => {
        galat.textContent = err.message || "Gagal masuk. Coba lagi.";
      }
    ).then(() => {
      tombol.disabled = false;
      tombol.removeAttribute("aria-busy");
    });
  });

  $("btn-keluar").addEventListener("click", () => {
    KD.data.keluar().then(() => {
      semua = [];
      terfilter = [];
      $("tbody").replaceChildren();
      tampil("v-masuk");
    });
  });

  /* ---------- Daftar ---------- */

  function isiPilihanKelas() {
    const jenis = $("f-jenis").value;
    const dipilih = $("f-kelas").value;
    const daftar = Array.from(new Set(semua.filter((r) => !jenis || r.jenis === jenis).map((r) => r.kelas))).sort(urutKelas);
    const sel = $("f-kelas");
    sel.replaceChildren(h("option", { value: "", text: "Semua kelas" }));
    daftar.forEach((k) => sel.append(h("option", { value: k, text: k })));
    sel.value = daftar.indexOf(dipilih) >= 0 ? dipilih : "";
  }

  function bukaRincian(r) {
    $("rincian-judul").textContent = r.nama;
    $("rincian-ket").textContent = KD.namaJenis(r.jenis) + ", kelas " + r.kelas + ", kode " + r.kode + ". " + r.hasil + ".";
    const w = $("rincian-batang");
    w.replaceChildren();
    KD.batangRincian(r.jenis, r.skor).forEach((b) => w.append(b));
    $("rincian").showModal();
  }

  function mintaHapus(r) {
    akanHapus = r;
    $("hapus-ket").textContent = r.nama + ", kelas " + r.kelas + ", " + KD.namaJenis(r.jenis).toLowerCase() + ", kode " + r.kode + ".";
    $("galat-hapus").textContent = "";
    $("btn-hapus-ya").disabled = false;
    $("hapus").showModal();
  }

  $("btn-hapus-tidak").addEventListener("click", () => {
    akanHapus = null;
    $("hapus").close();
  });
  $("btn-hapus-ya").addEventListener("click", () => {
    if (!akanHapus) return;
    const r = akanHapus;
    const tombol = $("btn-hapus-ya");
    tombol.disabled = true;
    KD.data.hapus(r.id).then(
      () => {
        semua = semua.filter((x) => x.id !== r.id);
        akanHapus = null;
        $("hapus").close();
        isiPilihanKelas();
        render();
        $("status").textContent = "Satu hasil dihapus.";
      },
      (err) => {
        tombol.disabled = false;
        $("galat-hapus").textContent = "Gagal menghapus: " + (err.message || "coba lagi.");
      }
    );
  });

  function render() {
    const jenis = $("f-jenis").value;
    const kelas = $("f-kelas").value;
    const cari = $("f-cari").value.trim().toLowerCase();

    terfilter = semua.filter(
      (r) =>
        (!jenis || r.jenis === jenis) &&
        (!kelas || r.kelas === kelas) &&
        (!cari || r.nama.toLowerCase().indexOf(cari) >= 0 || r.kode.toLowerCase().indexOf(cari) === 0)
    );

    const tbody = $("tbody");
    tbody.replaceChildren();
    $("admin-ket").textContent = semua.length + " hasil tersimpan.";
    $("btn-csv").disabled = !terfilter.length;

    if (!terfilter.length) {
      $("tabel-wrap").hidden = false;
      $("status").textContent = semua.length ? "Tidak ada hasil yang cocok dengan penyaring." : "Belum ada hasil yang tersimpan.";
      tbody.append(
        semua.length
          ? KD.barisKosong(7, "Ubah jenis tes, kelas, atau kata pencarian untuk melihat hasil lain.")
          : KD.barisKosong(7, "Nama dan hasil siswa muncul di sini setelah mereka menyelesaikan tes.", "Buka halaman tes", "tes.html")
      );
      return;
    }
    $("tabel-wrap").hidden = false;
    $("status").textContent = terfilter.length + " hasil ditampilkan.";

    terfilter.forEach((r) => {
      tbody.append(
        h(
          "tr",
          {},
          h("td", { "data-label": "Nama", text: r.nama }),
          h("td", { "data-label": "Kelas", text: r.kelas }),
          h("td", { "data-label": "Jenis", text: KD.namaJenis(r.jenis) }),
          h("td", { "data-label": "Hasil", text: r.hasil }),
          h("td", { class: "kode", "data-label": "Kode", text: r.kode }),
          h("td", { "data-label": "Tanggal", text: KD.tanggal(r.dibuat) }),
          h(
            "td",
            {},
            h(
              "div",
              { class: "baris-aksi" },
              h("button", { class: "btn btn--garis btn--kecil", type: "button", onclick: () => bukaRincian(r) }, "Rincian", h("span", { class: "sr-only", text: " " + r.nama })),
              h("button", { class: "btn btn--bahaya btn--kecil", type: "button", onclick: () => mintaHapus(r) }, "Hapus", h("span", { class: "sr-only", text: " " + r.nama }))
            )
          )
        )
      );
    });
  }

  ["f-jenis", "f-kelas", "f-cari"].forEach((id) =>
    $(id).addEventListener("input", () => {
      if (id === "f-jenis") isiPilihanKelas();
      render();
    })
  );

  /* ---------- CSV ---------- */

  $("btn-csv").addEventListener("click", () => {
    const G = KD.GAYA.tipe;
    const P = KD.KEPRIBADIAN.dimensi;
    const skor = (r, k) => (r.skor && r.skor[k] !== undefined ? r.skor[k] : "");
    const kolom = [
      { judul: "Nama", ambil: (r) => r.nama },
      { judul: "Kelas", ambil: (r) => r.kelas },
      { judul: "Jenis tes", ambil: (r) => KD.namaJenis(r.jenis) },
      { judul: "Hasil", ambil: (r) => r.hasil },
      { judul: "Kode", ambil: (r) => r.kode },
      { judul: "Tanggal", ambil: (r) => new Date(r.dibuat).toLocaleString("id-ID") },
      { judul: "Skor " + G.V.nama, ambil: (r) => (r.jenis === "gaya_belajar" ? skor(r, "V") : "") },
      { judul: "Skor " + G.A.nama, ambil: (r) => (r.jenis === "gaya_belajar" ? skor(r, "A") : "") },
      { judul: "Skor " + G.K.nama, ambil: (r) => (r.jenis === "gaya_belajar" ? skor(r, "K") : "") }
    ].concat(
      KD.KEPRIBADIAN.urutanDimensi.map((d) => ({
        judul: "Skor " + P[d].nama,
        ambil: (r) => (r.jenis === "kepribadian" ? skor(r, d) : "")
      }))
    );
    const tgl = new Date().toISOString().slice(0, 10);
    KD.unduh("hasil-tes-" + tgl + ".csv", KD.csv(terfilter, kolom));
  });

  /* ---------- Mulai ---------- */

  function mulaiAdmin() {
    tampil("v-admin");
    $("status").textContent = "Memuat data…";
    KD.data.ambilSemua().then(
      (baris) => {
        semua = baris;
        isiPilihanKelas();
        render();
      },
      (err) => {
        $("status").className = "status status--gagal";
        $("status").textContent = "Data gagal dimuat: " + (err.message || "coba muat ulang halaman.");
      }
    );
  }

  KD.data.sesi().then(
    (s) => {
      if (s.masuk) mulaiAdmin(s);
      else {
        tampil("v-masuk");
        if (s.bukanAdmin) $("galat-masuk").textContent = "Akun yang tadi masuk tidak punya akses admin, jadi sesinya diakhiri.";
      }
    },
    () => {
      $("memuat").className = "status status--gagal";
      $("memuat").textContent = "Gagal terhubung ke database. Periksa koneksi internet dan pengaturan di js/config.js.";
    }
  );
})();
