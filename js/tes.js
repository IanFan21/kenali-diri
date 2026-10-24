/* Halaman tes: data diri, soal per halaman, skor, hasil, dan penyimpanan. */
(function () {
  const KD = window.KD;
  const h = KD.h;
  const $ = (id) => document.getElementById(id);
  const PER_HALAMAN = 5;

  const param = new URLSearchParams(location.search).get("jenis");
  const tes = param === "gaya-belajar" ? KD.GAYA : param === "kepribadian" ? KD.KEPRIBADIAN : null;
  if (!tes) return; // tampilan "Pilih tes" yang statis tetap terlihat

  const adalahGaya = tes === KD.GAYA;
  const state = {
    nama: "",
    kelas: "",
    urutan: [], // indeks soal setelah diacak
    urutOpsi: {}, // gaya belajar: urutan huruf V/A/K per soal
    jawab: {}, // indeks soal -> "V"|"A"|"K" atau 1..5
    halaman: 0,
    berjalan: false,
    baris: null,
    gagalSekali: false
  };

  const tampil = (id) => {
    ["v-pilih", "v-identitas", "v-soal", "v-hasil"].forEach((v) => {
      $(v).hidden = v !== id;
    });
    const judul = $(id).querySelector("h1");
    if (judul) judul.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: KD.kurangGerak() ? "auto" : "smooth" });
  };

  /* ---------- Persiapan ---------- */

  document.title = tes.judul + " | Kenali Diri";
  $("h-identitas").textContent = tes.judul;
  $("petunjuk").textContent = tes.petunjuk;
  const linkSaya = $(adalahGaya ? "nav-gaya" : "nav-kep");
  if (linkSaya) linkSaya.setAttribute("aria-current", "page");
  $("v-pilih").hidden = true;
  $("v-identitas").hidden = false;

  window.addEventListener("beforeunload", (e) => {
    if (state.berjalan) {
      e.preventDefault();
      e.returnValue = "";
    }
  });

  /* ---------- 1. Data diri ---------- */

  $("form-identitas").addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = $("nama").value.trim().replace(/\s+/g, " ");
    const kelas = $("kelas").value.trim().replace(/\s+/g, " ");
    let ok = true;

    const periksa = (input, galat, pesan, salah) => {
      input.setAttribute("aria-invalid", salah ? "true" : "false");
      $(galat).textContent = salah ? pesan : "";
      if (salah && ok) {
        input.focus();
        ok = false;
      }
    };
    periksa($("nama"), "galat-nama", "Isi nama lengkap, 2 sampai 80 karakter.", nama.length < 2 || nama.length > 80);
    periksa($("kelas"), "galat-kelas", "Isi kelas, 1 sampai 30 karakter.", kelas.length < 1 || kelas.length > 30);
    if (!ok) return;

    state.nama = nama;
    state.kelas = kelas;
    if (!state.urutan.length) {
      state.urutan = KD.kocok(tes.soal.map((_, i) => i));
      if (adalahGaya) tes.soal.forEach((_, i) => (state.urutOpsi[i] = KD.kocok(["V", "A", "K"])));
    }
    state.berjalan = true;
    $("h-soal").textContent = tes.judul;
    renderHalaman();
    tampil("v-soal");
  });

  /* ---------- 2. Soal ---------- */

  const totalHalaman = () => Math.ceil(tes.soal.length / PER_HALAMAN);
  const jumlahTerjawab = () => Object.keys(state.jawab).length;

  function perbaruiProgres() {
    const n = jumlahTerjawab();
    $("progres-isi").style.setProperty("--p", String(n / tes.soal.length));
    $("progres-teks").textContent =
      "Halaman " + (state.halaman + 1) + " dari " + totalHalaman() + ". Terjawab " + n + " dari " + tes.soal.length + ".";
  }

  function buatSoal(indeks, posisi) {
    const s = tes.soal[indeks];
    const nama = "q" + indeks;
    const daftar = h("div", { class: adalahGaya ? "opsi-daftar" : "opsi-skala-daftar" });

    const tambah = (nilai, teks) => {
      const input = h("input", { type: "radio", name: nama, value: String(nilai), required: true });
      if (String(state.jawab[indeks]) === String(nilai)) input.checked = true;
      input.addEventListener("change", () => {
        state.jawab[indeks] = adalahGaya ? nilai : Number(nilai);
        fs.classList.remove("belum");
        $("galat-soal").textContent = "";
        perbaruiProgres();
      });
      daftar.append(
        h(
          "label",
          { class: "opsi" + (adalahGaya ? "" : " opsi--skala") },
          input,
          h("span", { class: "opsi-teks", text: teks })
        )
      );
    };

    if (adalahGaya) {
      state.urutOpsi[indeks].forEach((huruf) => tambah(huruf, s.o[huruf]));
    } else {
      tes.skala.forEach((teks, i) => tambah(i + 1, teks));
    }

    const fs = h(
      "fieldset",
      { class: "soal", "data-i": String(indeks) },
      h("legend", {}, h("span", { class: "nomor", text: posisi + 1 + ". " }), s.t),
      daftar
    );
    return fs;
  }

  function renderHalaman() {
    const wadah = $("soal-daftar");
    wadah.replaceChildren();
    const mulai = state.halaman * PER_HALAMAN;
    state.urutan.slice(mulai, mulai + PER_HALAMAN).forEach((indeks, k) => {
      wadah.append(buatSoal(indeks, mulai + k));
    });
    const terakhir = state.halaman === totalHalaman() - 1;
    $("btn-lanjut").textContent = terakhir ? "Selesai dan lihat hasil" : "Lanjut";
    $("galat-soal").textContent = "";
    perbaruiProgres();
  }

  $("btn-kembali").addEventListener("click", () => {
    if (state.halaman === 0) {
      tampil("v-identitas");
      return;
    }
    state.halaman -= 1;
    renderHalaman();
    tampil("v-soal");
  });

  $("form-soal").addEventListener("submit", (e) => {
    e.preventDefault();
    const belum = Array.from($("soal-daftar").querySelectorAll("fieldset")).filter(
      (fs) => state.jawab[fs.getAttribute("data-i")] === undefined
    );
    if (belum.length) {
      belum.forEach((fs) => fs.classList.add("belum"));
      $("galat-soal").textContent =
        belum.length === 1 ? "Satu soal di halaman ini belum dijawab." : belum.length + " soal di halaman ini belum dijawab.";
      const pertama = belum[0].querySelector("input");
      if (pertama) pertama.focus();
      return;
    }
    if (state.halaman < totalHalaman() - 1) {
      state.halaman += 1;
      renderHalaman();
      tampil("v-soal");
      return;
    }
    selesai();
  });

  /* ---------- 3. Hasil ---------- */

  function selesai() {
    state.berjalan = false;
    const urutJawab = tes.soal.map((_, i) => state.jawab[i]);
    const skor = adalahGaya ? KD.skorGaya(urutJawab) : KD.skorKepribadian(urutJawab);

    state.baris = {
      kode: KD.kode(),
      jenis: tes.jenisDb,
      nama: state.nama,
      kelas: state.kelas,
      skor: skor.skor,
      hasil: skor.hasil
    };

    renderHasil(skor);
    $("hasil-kode").textContent = state.baris.kode;
    aturTautan();
    tampil("v-hasil");
    simpan();
  }

  function aturTautan() {
    $("tes-lain").href = "tes.html?jenis=" + (adalahGaya ? "kepribadian" : "gaya-belajar");
    $("lihat-publik").href = "hasil.html?jenis=" + tes.slug + "&kode=" + encodeURIComponent(state.baris.kode);
  }

  const batang = KD.batang;

  function daftarUl(butir) {
    return h("ul", {}, butir.map((b) => h("li", { text: b })));
  }

  function renderHasil(skor) {
    const batangWadah = $("hasil-batang");
    const uraian = $("hasil-uraian");
    batangWadah.replaceChildren();
    uraian.replaceChildren();

    if (adalahGaya) {
      const G = KD.GAYA;
      const n = skor.teratas.length;
      $("h-hasil").textContent =
        n === 3 ? "Gaya belajarmu seimbang" : "Gaya belajarmu: " + skor.teratas.map((k) => G.tipe[k].nama).join(" dan ");
      $("hasil-ringkas").textContent =
        n === 1
          ? G.tipe[skor.teratas[0]].ringkas
          : n === 2
          ? "Kamu punya dua kecenderungan yang sama kuat."
          : "Ketiga gaya belajar muncul sama kuat, jadi kamu luwes memakai ketiganya.";
      ["V", "A", "K"].forEach((k) => {
        batangWadah.append(batang(G.tipe[k].nama, skor.skor[k], tes.soal.length, skor.skor[k] + " dari " + tes.soal.length, "t-" + k));
      });
      (n === 3 ? ["V", "A", "K"] : skor.teratas).forEach((k) => {
        const t = G.tipe[k];
        uraian.append(
          h(
            "div",
            {},
            h("h3", { text: t.nama }),
            h("p", { text: t.ringkas }),
            h(
              "div",
              { class: "dua-kolom" },
              h("div", {}, h("p", { class: "label", style: "font-weight:600", text: "Ciri-cirinya" }), daftarUl(t.ciri)),
              h("div", {}, h("p", { class: "label", style: "font-weight:600", text: "Tips belajar" }), daftarUl(t.tips))
            )
          )
        );
      });
    } else {
      const K = KD.KEPRIBADIAN;
      $("h-hasil").textContent = "Profil kepribadianmu";
      $("hasil-ringkas").textContent =
        skor.hasil === "Seimbang di kelima sisi"
          ? "Kelima sisi kepribadianmu cukup seimbang."
          : "Sisi yang paling menonjol: " + K.dimensi[skor.urut[0]].nama + " dan " + K.dimensi[skor.urut[1]].nama + ".";
      K.urutanDimensi.forEach((d) => {
        batangWadah.append(batang(K.dimensi[d].nama, skor.skor[d], 30, skor.skor[d] + " dari 30"));
      });
      K.urutanDimensi.forEach((d) => {
        const lv = KD.levelKep(skor.skor[d]);
        uraian.append(
          h(
            "div",
            {},
            h("h3", { text: K.dimensi[d].nama + ": " + lv }),
            h("p", { class: "muted", text: K.dimensi[d].ringkas }),
            h("p", { text: K.dimensi[d][lv] })
          )
        );
      });
    }
  }

  /* ---------- Penyimpanan ---------- */

  function setStatus(teks, jenis) {
    const el = $("status-simpan");
    el.textContent = teks;
    el.className = "status" + (jenis ? " status--" + jenis : "");
  }

  function kirim(percobaan) {
    return KD.data.simpan(state.baris).catch((e) => {
      if (e.kode === "23505") {
        // Setelah kegagalan jaringan, kode kembar berarti hasil ini kemungkinan sudah masuk.
        if (state.gagalSekali) return;
        if (percobaan < 3) {
          state.baris.kode = KD.kode();
          $("hasil-kode").textContent = state.baris.kode;
          aturTautan();
          return kirim(percobaan + 1);
        }
      }
      throw e;
    });
  }

  function simpan() {
    const ulang = $("btn-simpan-ulang");
    ulang.hidden = true;
    ulang.disabled = true;
    setStatus("Menyimpan hasil…", "");
    kirim(0).then(
      () => {
        setStatus("Tersimpan. Guru dapat melihat hasil ini.", "ok");
      },
      () => {
        state.gagalSekali = true;
        setStatus("Hasil belum tersimpan. Periksa koneksi internet, lalu coba lagi. Hasil di layar ini tetap bisa kamu foto.", "gagal");
        ulang.hidden = false;
        ulang.disabled = false;
      }
    );
  }

  $("btn-simpan-ulang").addEventListener("click", simpan);

  $("btn-cetak").addEventListener("click", () => window.print());

  $("btn-salin").addEventListener("click", () => {
    const tombol = $("btn-salin");
    const kode = state.baris ? state.baris.kode : "";
    const selesaiSalin = (ok) => {
      tombol.textContent = ok ? "Kode disalin" : "Salin manual dari layar";
      setTimeout(() => (tombol.textContent = "Salin kode"), 2500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(kode).then(
        () => selesaiSalin(true),
        () => selesaiSalin(false)
      );
    } else {
      selesaiSalin(false);
    }
  });
})();
