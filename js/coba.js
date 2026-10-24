/* Beranda: satu soal contoh per tes, dihitung dengan aturan skor yang sama seperti tes sungguhan. Tidak ada yang dikirim. */
(function () {
  var panelG = document.getElementById("p-gaya");
  var panelK = document.getElementById("p-kep");
  var seg = document.getElementById("seg-coba");
  if (!panelG || !panelK || !seg) return;
  var KD = window.KD;

  function isi(wadah, nilai, ket) {
    wadah.querySelector(".hitung-nilai").textContent = nilai;
    wadah.querySelector(".hitung-ket").textContent = ket;
  }

  /* Gaya belajar: satu poin untuk huruf yang dipilih. */
  panelG.addEventListener("change", function (e) {
    if (e.target.name !== "cg") return;
    var k = e.target.value;
    var nama = KD.GAYA.tipe[k].nama;
    isi(
      document.getElementById("hitung-gaya"),
      nama + " +1",
      "Jawaban ini menambah satu poin untuk " + nama.toLowerCase() + ". Dari 30 soal, gaya dengan poin terbanyak menjadi hasilmu."
    );
  });

  /* Kepribadian: butir ini dibalik, jadi nilai = 6 dikurangi jawaban. */
  panelK.addEventListener("change", function (e) {
    if (e.target.name !== "ck") return;
    var v = Number(e.target.value);
    var hitung = 6 - v;
    isi(
      document.getElementById("hitung-kep"),
      "Ekstraversi +" + hitung,
      "Pernyataan ini dibalik: jawaban " + v + " dihitung " + hitung + ". Skor tiap sisi adalah jumlah enam butirnya, dari 6 sampai 30."
    );
  });

  /* Tab. Tanpa skrip, kedua panel tampil berurutan. */
  var tabs = Array.prototype.slice.call(seg.querySelectorAll("[role=tab]"));
  var panel = { "t-gaya": panelG, "t-kep": panelK };

  function pilih(tab, fokus) {
    tabs.forEach(function (t) {
      var aktif = t === tab;
      t.setAttribute("aria-selected", aktif ? "true" : "false");
      t.tabIndex = aktif ? 0 : -1;
      panel[t.id].hidden = !aktif;
    });
    if (fokus) tab.focus();
  }

  seg.hidden = false;
  pilih(tabs[0], false);
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { pilih(t, false); });
    t.addEventListener("keydown", function (e) {
      var j = null;
      if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft") j = (i + tabs.length - 1) % tabs.length;
      else if (e.key === "Home") j = 0;
      else if (e.key === "End") j = tabs.length - 1;
      if (j !== null) {
        e.preventDefault();
        pilih(tabs[j], true);
      }
    });
  });
})();
