/* Halaman hasil publik: tanpa nama siswa. Data berasal dari view hasil_publik. */
(function () {
  const KD = window.KD;
  const h = KD.h;
  const $ = (id) => document.getElementById(id);

  let semua = [];
  const params = new URLSearchParams(location.search);
  const kodeAwal = (params.get("kode") || "").toUpperCase().replace(/[^A-Z2-9]/g, "").slice(0, 6);
  const jenisAwal = { "gaya-belajar": "gaya_belajar", kepribadian: "kepribadian" }[params.get("jenis")];

  if (jenisAwal) $("f-jenis").value = jenisAwal;
  $("f-kode").value = kodeAwal;

  const urutKelas = (a, b) => a.localeCompare(b, "id", { numeric: true, sensitivity: "base" });

  function isiPilihanKelas() {
    const jenis = $("f-jenis").value;
    const dipilih = $("f-kelas").value;
    const daftar = Array.from(new Set(semua.filter((r) => r.jenis === jenis).map((r) => r.kelas))).sort(urutKelas);
    const sel = $("f-kelas");
    sel.replaceChildren(h("option", { value: "", text: "Semua kelas" }));
    daftar.forEach((k) => sel.append(h("option", { value: k, text: k })));
    sel.value = daftar.indexOf(dipilih) >= 0 ? dipilih : "";
  }

  function ringkasan(baris, jenis) {
    const wadah = $("ringkasan-batang");
    wadah.replaceChildren();
    const sec = $("ringkasan");
    if (!baris.length) {
      sec.hidden = true;
      return;
    }
    sec.hidden = false;

    if (jenis === "gaya_belajar") {
      $("ringkasan-ket").textContent = "Jumlah siswa menurut hasil gaya belajar. Total " + baris.length + " siswa.";
      const hitung = {};
      baris.forEach((r) => (hitung[r.hasil] = (hitung[r.hasil] || 0) + 1));
      const kunci = Object.keys(hitung).sort((a, b) => hitung[b] - hitung[a] || a.localeCompare(b, "id"));
      const maks = hitung[kunci[0]];
      const warna = { Visual: "t-V", Auditori: "t-A", Kinestetik: "t-K" };
      kunci.forEach((k) => wadah.append(KD.batang(k, hitung[k], maks, hitung[k] + " siswa", warna[k] || "")));
    } else {
      $("ringkasan-ket").textContent = "Rata-rata skor tiap sisi kepribadian dari " + baris.length + " siswa, skala 6 sampai 30.";
      KD.KEPRIBADIAN.urutanDimensi.forEach((d) => {
        const rata = baris.reduce((t, r) => t + (Number((r.skor || {})[d]) || 0), 0) / baris.length;
        wadah.append(KD.batang(KD.KEPRIBADIAN.dimensi[d].nama, rata, 30, rata.toFixed(1).replace(".", ",") + " dari 30"));
      });
    }
  }

  function bukaRincian(r) {
    $("rincian-judul").textContent = "Hasil " + r.kode;
    $("rincian-ket").textContent = KD.namaJenis(r.jenis) + ", kelas " + r.kelas + ". " + r.hasil + ".";
    const w = $("rincian-batang");
    w.replaceChildren();
    KD.batangRincian(r.jenis, r.skor).forEach((b) => w.append(b));
    const dlg = $("rincian");
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "");
  }

  function render() {
    const jenis = $("f-jenis").value;
    const kelas = $("f-kelas").value;
    const kode = $("f-kode").value.trim().toUpperCase();

    const sejenis = semua.filter((r) => r.jenis === jenis);
    const terpilih = sejenis.filter((r) => (!kelas || r.kelas === kelas) && (!kode || r.kode.indexOf(kode) === 0));

    ringkasan(kode ? terpilih : sejenis.filter((r) => !kelas || r.kelas === kelas), jenis);

    const tbody = $("tbody");
    tbody.replaceChildren();
    const status = $("status");
    const daftar = $("daftar");

    if (!terpilih.length) {
      daftar.hidden = false;
      status.className = "status";
      status.textContent = kode
        ? "Tidak ada hasil dengan kode itu."
        : semua.length
        ? "Belum ada hasil untuk pilihan ini."
        : "Belum ada hasil yang tersimpan.";
      tbody.append(
        kode
          ? KD.barisKosong(5, "Kodenya terdiri dari enam huruf atau angka, tanpa O, I, 0, dan 1. Periksa lagi, atau hapus kolom kode untuk melihat semua hasil.")
          : KD.barisKosong(5, "Hasil muncul di sini setelah siswa menyelesaikan tes.", "Ikuti tes", "tes.html")
      );
      return;
    }

    daftar.hidden = false;
    status.className = "status";
    status.textContent = terpilih.length + " hasil ditampilkan.";

    terpilih.forEach((r) => {
      const tr = h("tr", { class: kodeAwal && r.kode === kodeAwal ? "sorot" : "" });
      tr.append(
        h("td", { class: "kode", "data-label": "Kode", text: r.kode }),
        h("td", { "data-label": "Kelas", text: r.kelas }),
        h("td", { "data-label": "Hasil", text: r.hasil }),
        h("td", { "data-label": "Tanggal", text: KD.tanggal(r.dibuat) }),
        h("td", {}, h("button", { class: "btn btn--garis btn--kecil", type: "button", onclick: () => bukaRincian(r) }, "Rincian", h("span", { class: "sr-only", text: " " + r.kode })))
      );
      tbody.append(tr);
    });
  }

  ["f-jenis", "f-kelas", "f-kode"].forEach((id) =>
    $(id).addEventListener("input", () => {
      if (id === "f-jenis") isiPilihanKelas();
      if (id === "f-kode") $("f-kode").value = $("f-kode").value.toUpperCase().replace(/[^A-Z2-9]/g, "");
      render();
    })
  );

  KD.data.ambilPublik().then(
    (baris) => {
      semua = baris;
      if (kodeAwal && !jenisAwal) {
        const ketemu = semua.find((r) => r.kode === kodeAwal);
        if (ketemu) $("f-jenis").value = ketemu.jenis;
      }
      isiPilihanKelas();
      render();
      if (kodeAwal) {
        const r = semua.find((x) => x.kode === kodeAwal && x.jenis === $("f-jenis").value);
        if (r) bukaRincian(r);
      }
    },
    () => {
      $("status").className = "status status--gagal";
      $("status").textContent = "Daftar hasil gagal dimuat. Periksa koneksi internet, lalu muat ulang halaman.";
    }
  );
})();
