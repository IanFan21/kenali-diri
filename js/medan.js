/*
  Medan huruf di belakang hero beranda.
  Sisi kiri: huruf acak dari yang dihitung tes (V A K E C S O) di antara karakter kerapatan.
  Sisi kanan: tersusun menjadi tiga baris, V di atas, A di tengah, K di bawah, seperti jawaban yang menjadi hasil.
  Warna dibaca dari token CSS. Satu gambar diam; hanya bergerak sebentar mengikuti penunjuk. Tanpa gerak jika diminta.
*/
(function () {
  var cv = document.getElementById("medan");
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext("2d");
  if (!ctx) return;
  var hero = cv.parentElement;
  var root = getComputedStyle(document.documentElement);
  function tok(n) { return root.getPropertyValue(n).trim(); }

  var CW = parseFloat(tok("--cell-w")) || 8;
  var CH = parseFloat(tok("--cell-h")) || 16;
  var WARNA = [null, tok("--color-glyph-1"), tok("--color-glyph-2"), tok("--color-glyph-3"), tok("--color-glyph-4")];
  var MONO = tok("--font-outlier") || "ui-monospace, monospace";
  var RAMP = [".", ":", "-", "+", "#"];
  var ACAK = "VAKEACSO";
  var BAND = ["V", "A", "K"];
  var kurangGerak = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Pastikan peramban memahami warna oklch di kanvas; jika tidak, biarkan kisi titik CSS. */
  ctx.fillStyle = "#000000";
  ctx.fillStyle = WARNA[2];
  if (ctx.fillStyle === "#000000") return;

  function hash(x, y) {
    var h = (x * 374761393 + y * 668265263) | 0;
    h = (h ^ (h >>> 13)) * 1274126177;
    h = h ^ (h >>> 16);
    return (h >>> 0) / 4294967295;
  }
  function halus(t) { return t * t * (3 - 2 * t); }
  function noise(x, y) {
    var x0 = Math.floor(x), y0 = Math.floor(y);
    var fx = halus(x - x0), fy = halus(y - y0);
    var a = hash(x0, y0), b = hash(x0 + 1, y0), c = hash(x0, y0 + 1), d = hash(x0 + 1, y0 + 1);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  }
  function langkah(a, b, v) {
    var t = Math.min(1, Math.max(0, (v - a) / (b - a)));
    return halus(t);
  }

  var kolom = 0, baris = 0, dpr = 1;
  var lensa = { x: -9999, y: -9999, r: 0 };
  var jalan = false;

  function ukur() {
    var w = hero.clientWidth, h = hero.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    kolom = Math.ceil(w / CW);
    baris = Math.ceil(h / CH);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function gambar() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.font = Math.round(CH * 0.82) + "px " + MONO;
    ctx.textBaseline = "top";
    for (var cy = 0; cy < baris; cy++) {
      var pita = BAND[Math.min(2, Math.floor((cy / baris) * 3))];
      for (var cx = 0; cx < kolom; cx++) {
        var u = cx / kolom;
        var o = langkah(0.32, 0.86, u);
        var blob = noise(cx * 0.06, cy * 0.15);
        var alur = noise(cx * 0.03 + 7, cy * 0.85 + 3);
        var d = blob + (alur - blob) * o;
        d = d * 0.95 + 0.04 * hash(cx, cy);
        if (lensa.r > 0) {
          var dx = cx * CW + CW / 2 - lensa.x, dy = cy * CH + CH / 2 - lensa.y;
          var jarak = Math.sqrt(dx * dx + dy * dy);
          if (jarak < lensa.r) d += (1 - jarak / lensa.r) * 0.45;
        }
        var tier = d < 0.5 ? 0 : d < 0.58 ? 1 : d < 0.66 ? 2 : d < 0.76 ? 3 : 4;
        if (!tier) continue;
        var ch;
        if (o > 0.55 && tier >= 3) ch = pita;
        else if (o <= 0.55 && hash(cx + 91, cy + 17) < 0.07 * tier) ch = ACAK.charAt(Math.floor(hash(cx, cy + 5) * ACAK.length));
        else ch = RAMP[tier];
        ctx.fillStyle = WARNA[tier];
        ctx.fillText(ch, cx * CW, cy * CH);
      }
    }
  }

  function putaran() {
    if (!jalan) return;
    lensa.r *= 0.94;
    if (lensa.r < 8) { lensa.r = 0; jalan = false; }
    gambar();
    if (jalan) requestAnimationFrame(putaran);
  }

  function mulai() {
    ukur();
    gambar();
    hero.classList.add("siap");
    if (kurangGerak) return;
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      lensa.x = e.clientX - r.left;
      lensa.y = e.clientY - r.top;
      lensa.r = 120;
      if (!jalan) { jalan = true; requestAnimationFrame(putaran); }
    });
  }

  var ulang = null;
  if (window.ResizeObserver) {
    new ResizeObserver(function () {
      if (ulang) cancelAnimationFrame(ulang);
      ulang = requestAnimationFrame(function () { ukur(); gambar(); });
    }).observe(hero);
  }

  if (document.fonts && document.fonts.load) {
    document.fonts.load("12px " + MONO.split(",")[0]).then(mulai, mulai);
  } else {
    mulai();
  }
})();
