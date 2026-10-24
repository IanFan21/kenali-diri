/* Fungsi bantu bersama. Semua teks dari pengguna dipasang lewat textContent, tidak pernah innerHTML. */
(function () {
  var KD = (window.KD = window.KD || {});

  /* Membuat elemen: h("div", {class: "x", text: "..."}, anak1, anak2) */
  KD.h = function (tag, attrs) {
    var el = document.createElement(tag);
    var a = attrs || {};
    Object.keys(a).forEach(function (k) {
      var v = a[k];
      if (v === false || v === null || v === undefined) return;
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    });
    for (var i = 2; i < arguments.length; i++) {
      var kids = [].concat(arguments[i]);
      for (var j = 0; j < kids.length; j++) {
        var kid = kids[j];
        if (kid === null || kid === undefined || kid === false) continue;
        el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
      }
    }
    return el;
  };

  KD.tanggal = function (iso) {
    try {
      return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
    } catch (e) {
      return String(iso);
    }
  };

  /* Kode hasil: 6 karakter tanpa huruf/angka yang mudah tertukar (0, 1, I, O). */
  var ABJAD = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  KD.kode = function () {
    var b = new Uint8Array(6);
    crypto.getRandomValues(b);
    var s = "";
    for (var i = 0; i < 6; i++) s += ABJAD.charAt(b[i] & 31);
    return s;
  };
  KD.kodeSah = function (s) {
    return /^[A-HJ-NP-Z2-9]{6}$/.test(s);
  };

  KD.acakId = function () {
    var b = new Uint8Array(16);
    crypto.getRandomValues(b);
    return Array.prototype.map
      .call(b, function (x) {
        return ("0" + x.toString(16)).slice(-2);
      })
      .join("");
  };

  /* Fisher-Yates dengan angka acak kriptografis. */
  KD.kocok = function (larik) {
    var a = larik.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var r = new Uint32Array(1);
      crypto.getRandomValues(r);
      var j = r[0] % (i + 1);
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  };

  KD.kurangGerak = function () {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };

  /* CSV aman untuk Excel: sel yang diawali = + - @ diberi apostrof agar tidak dibaca sebagai rumus. */
  KD.csv = function (baris, kolom) {
    function sel(v) {
      var s = v === null || v === undefined ? "" : String(v);
      if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
      return '"' + s.replace(/"/g, '""') + '"';
    }
    var out = [kolom.map(function (k) { return sel(k.judul); }).join(",")];
    baris.forEach(function (r) {
      out.push(kolom.map(function (k) { return sel(k.ambil(r)); }).join(","));
    });
    return "﻿" + out.join("\r\n");
  };

  KD.unduh = function (nama, isi) {
    var url = URL.createObjectURL(new Blob([isi], { type: "text/csv;charset=utf-8" }));
    var a = KD.h("a", { href: url, download: nama });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  };

  KD.namaJenis = function (jenisDb) {
    return jenisDb === "gaya_belajar" ? "Gaya belajar" : "Kepribadian";
  };

  /* Baris kosong untuk tabel: apa yang kosong, mengapa, dan satu langkah berikutnya. */
  KD.barisKosong = function (kolom, teks, tautan, href) {
    var isi = [KD.h("p", { text: teks })];
    if (tautan) isi.push(KD.h("p", {}, KD.h("a", { href: href, text: tautan })));
    return KD.h("tr", {}, KD.h("td", { colspan: String(kolom), class: "kosong" }, isi));
  };

  /* Satu baris batang skor. Panjang batang memakai transform (--p), bukan lebar. */
  KD.batang = function (nama, nilai, maks, ket, kelas) {
    var isi = KD.h("span", { class: "batang-isi" });
    isi.style.setProperty("--p", String(Math.max(0, Math.min(1, nilai / maks))));
    return KD.h(
      "div",
      { class: "batang " + (kelas || "") },
      KD.h("span", { class: "batang-nama", text: nama }),
      KD.h("span", { class: "batang-trek", "aria-hidden": "true" }, isi),
      KD.h("span", { class: "batang-nilai", text: ket })
    );
  };

  /* Batang skor lengkap untuk satu baris hasil (dipakai halaman publik dan admin). */
  KD.batangRincian = function (jenisDb, skor) {
    var s = skor || {};
    if (jenisDb === "gaya_belajar") {
      return ["V", "A", "K"].map(function (k) {
        var n = Number(s[k]) || 0;
        return KD.batang(KD.GAYA.tipe[k].nama, n, 30, n + " dari 30", "t-" + k);
      });
    }
    return KD.KEPRIBADIAN.urutanDimensi.map(function (d) {
      var n = Number(s[d]) || 0;
      return KD.batang(KD.KEPRIBADIAN.dimensi[d].nama, n, 30, n + " dari 30");
    });
  };

  /* Logo, nama sekolah, dan pita mode percobaan. Dijalankan di setiap halaman. */
  function mulai() {
    var C = KD.CONFIG || {};
    if (C.LOGO) {
      var merek = document.querySelector(".nav .merek");
      if (merek) {
        var logo = KD.h("img", { class: "logo", src: C.LOGO, alt: "", width: "40", height: "40" });
        merek.prepend(logo);
      }
    }
    var sek = document.getElementById("nama-sekolah");
    if (sek && C.NAMA_SEKOLAH) {
      sek.textContent = C.NAMA_SEKOLAH;
      sek.hidden = false;
    }
    if (KD.data && KD.data.mode === "demo") {
      var pita = KD.h(
        "p",
        { class: "pita-demo", role: "note" },
        "Mode percobaan: Supabase belum diisi di js/config.js, jadi data hanya tersimpan di browser ini."
      );
      var header = document.querySelector("header");
      if (header) header.after(pita);
    }
  }
  /* Skrip defer berjalan sebelum DOMContentLoaded, saat data.js belum dimuat; maka tunggu peristiwa itu. */
  KD.siap = function (fn) {
    if (document.readyState === "complete") fn();
    else document.addEventListener("DOMContentLoaded", fn, { once: true });
  };
  KD.siap(mulai);
})();
