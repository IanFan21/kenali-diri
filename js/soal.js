/*
  Butir soal, deskripsi hasil, dan aturan skor untuk dua tes.
  Semua butir ditulis khusus untuk situs ini. Mengubah teks soal aman;
  mengubah jumlah atau urutan dimensi harus diikuti perubahan di fungsi skor.
*/
(function () {
  var KD = (window.KD = window.KD || {});

  /* ---------- Tes 1: Gaya belajar (Visual, Auditori, Kinestetik) ---------- */

  var gayaSoal = [
    ["Saat mempelajari materi baru, aku paling cepat paham jika…", "melihat bagan, gambar, atau diagram penjelasannya", "mendengarkan guru atau teman menjelaskannya", "langsung mencoba mengerjakan contohnya"],
    ["Untuk mengingat nomor telepon, aku biasanya…", "membayangkan angka-angkanya tertulis", "mengucapkannya berulang-ulang", "menuliskan atau mengetikkannya beberapa kali"],
    ["Ketika menanyakan arah ke suatu tempat, aku lebih suka…", "melihat peta atau denah", "mendengar penjelasan lisan", "diantar atau berjalan langsung ke sana"],
    ["Saat merakit sesuatu, aku…", "mengikuti gambar langkah demi langkah", "meminta seseorang membacakan langkah-langkahnya", "mencoba merakit dulu sambil menebak-nebak"],
    ["Di kelas, hal yang paling mengganggu konsentrasiku adalah…", "tulisan di papan yang berantakan atau tidak jelas", "suara bising di sekitarku", "harus duduk diam terlalu lama"],
    ["Saat membaca teks, aku…", "membayangkan adegan atau gambarnya", "seperti mendengar suara di kepala, atau membacanya bersuara", "sering bergerak atau memainkan pulpen"],
    ["Aku lebih mudah mengingat seseorang lewat…", "wajah dan penampilannya", "nama dan suaranya", "hal yang pernah kami lakukan bersama"],
    ["Ketika guru menjelaskan, aku cenderung…", "mencatat dan membuat coretan atau gambar", "menyimak tanpa banyak mencatat", "gelisah dan ingin segera praktik"],
    ["Untuk belajar kosakata bahasa asing, cara terbaikku adalah…", "kartu bergambar atau tulisan berwarna", "mendengarkan rekaman lalu menirukannya", "memperagakan atau menempelkan label pada benda"],
    ["Saat menjelaskan sesuatu kepada teman, aku…", "menggambar atau menunjukkan gambar", "menjelaskannya dengan kata-kata", "memperagakannya dengan gerakan atau contoh nyata"],
    ["Saat menunggu, aku biasanya…", "mengamati keadaan sekitar", "bersenandung atau mengobrol", "mengetuk-ngetukkan jari atau berjalan-jalan"],
    ["Untuk menghafal materi, aku…", "menandainya dengan warna dan membuat peta pikiran", "membacanya keras-keras atau merekam suara", "berjalan mondar-mandir sambil mengulangnya"],
    ["Aku paling senang mengerjakan tugas berupa…", "poster atau infografis", "diskusi atau presentasi lisan", "praktik atau pembuatan model"],
    ["Sebelum membeli barang baru, aku…", "melihat foto dan membaca ulasannya", "menanyakan pendapat orang lain", "memegang dan mencobanya langsung"],
    ["Aku paling mengingat pelajaran lewat…", "tampilan slide dan gambar", "penjelasan dan cerita guru", "pengalaman praktik"],
    ["Saat bingung dengan sebuah soal, aku…", "menggambar ilustrasi dari soalnya", "membaca soal keras-keras atau bergumam", "mencoba berbagai cara sambil mencoret-coret"],
    ["Suasana belajar yang paling nyaman bagiku adalah…", "ruangan rapi dan terang", "tempat yang tenang, atau diiringi musik pelan", "tempat yang bebas berpindah posisi, boleh berdiri atau duduk di lantai"],
    ["Saat mendengarkan musik, aku…", "membayangkan gambar atau adegan", "memperhatikan lirik dan nadanya", "ikut bergoyang atau mengetukkan irama"],
    ["Untuk memahami cara kerja sebuah alat, aku…", "melihat diagram atau video cara kerjanya", "mendengarkan penjelasan orang yang paham", "membongkar dan mencobanya sendiri"],
    ["Ketika menjawab pertanyaan di depan kelas, aku…", "membayangkan catatanku di kepala", "lancar karena terbiasa berbicara", "lebih tenang jika boleh bergerak atau memperagakan"],
    ["Aku paling sulit mengikuti pelajaran jika…", "tidak ada tulisan atau gambar sebagai pegangan", "tidak ada penjelasan lisan, hanya bahan bacaan", "hanya mendengar dan melihat tanpa praktik"],
    ["Saat berlibur, aku paling menikmati…", "pemandangan dan berfoto", "mengobrol dan mendengar cerita warga setempat", "melakukan kegiatan seperti mendaki atau mencoba kuliner"],
    ["Untuk mengingat isi catatan, aku…", "membayangkan halamannya di kepala", "mengulangnya dengan suara", "menulis ulang atau menyusunnya menjadi kartu"],
    ["Saat mengikuti resep atau tutorial, aku…", "melihat gambar atau video tiap langkah", "mendengarkan narasinya", "langsung praktik sambil membaca"],
    ["Perhatianku paling mudah teralih oleh…", "gerakan atau pemandangan di luar kelas", "percakapan di sekitarku", "rasa tidak nyaman karena terlalu lama duduk"],
    ["Dalam kerja kelompok, aku suka berperan sebagai…", "pembuat bagan atau slide", "pembicara atau penjelas", "pelaksana praktik atau pembuat model"],
    ["Aku lebih mudah mengerti penjelasan jika…", "ada contoh gambar atau warna", "ada cerita atau perumpamaan lisan", "ada benda nyata yang bisa kupegang"],
    ["Saat menceritakan pengalamanku, aku…", "menggambarkan penampilan dan warna-warnanya", "memperhatikan percakapan dan nada suara", "banyak memakai gerakan tangan dan badan"],
    ["Waktu belajarku paling efektif ketika boleh…", "membuat catatan berwarna atau bergambar", "berdiskusi atau menjelaskan ulang", "berpraktik atau membuat sesuatu"],
    ["Aku merasa benar-benar paham ketika aku bisa…", "menggambarkannya dalam bentuk ringkasan visual", "menjelaskannya dengan kata-kataku sendiri", "mempraktikkannya sendiri"]
  ];

  KD.GAYA = {
    slug: "gaya-belajar",
    jenisDb: "gaya_belajar",
    judul: "Tes gaya belajar",
    petunjuk:
      "Untuk setiap soal, pilih satu pernyataan yang paling mirip denganmu. Tidak ada jawaban benar atau salah.",
    jenisSoal: "pilihan",
    tipe: {
      V: {
        nama: "Visual",
        ringkas: "Kamu paling mudah memahami sesuatu lewat apa yang kamu lihat.",
        ciri: [
          "Cepat menangkap materi dari gambar, bagan, warna, dan peta.",
          "Sering mengingat letak atau tampilan sesuatu.",
          "Catatan yang rapi dan berwarna membantumu fokus."
        ],
        tips: [
          "Ubah catatan menjadi peta pikiran, diagram, atau tabel.",
          "Pakai warna berbeda untuk istilah, rumus, dan contoh.",
          "Lihat gambar atau video proses sebelum membaca teks yang panjang.",
          "Bayangkan materi sebagai gambar saat menghafal."
        ]
      },
      A: {
        nama: "Auditori",
        ringkas: "Kamu paling mudah memahami sesuatu lewat apa yang kamu dengar dan ucapkan.",
        ciri: [
          "Menyimak penjelasan guru dengan baik.",
          "Terbantu saat berdiskusi atau menjelaskan ulang.",
          "Mengingat percakapan, nada suara, dan cerita."
        ],
        tips: [
          "Baca catatan dengan suara keras, atau rekam ringkasanmu lalu dengarkan lagi.",
          "Belajar berkelompok dan bergantian saling menjelaskan.",
          "Ubah materi menjadi cerita atau singkatan yang enak diucapkan.",
          "Pilih tempat belajar yang tidak bising."
        ]
      },
      K: {
        nama: "Kinestetik",
        ringkas: "Kamu paling mudah memahami sesuatu lewat gerak, praktik, dan pengalaman langsung.",
        ciri: [
          "Cepat paham saat langsung mencoba.",
          "Sulit duduk diam terlalu lama.",
          "Mengingat apa yang pernah kamu lakukan sendiri."
        ],
        tips: [
          "Praktikkan materi, jangan hanya membacanya.",
          "Belajar dalam sesi pendek dengan jeda untuk bergerak.",
          "Pakai benda nyata, model, atau peragaan.",
          "Tulis ulang dan susun kartu belajar dengan tanganmu sendiri."
        ]
      }
    },
    soal: gayaSoal.map(function (r) {
      return { t: r[0], o: { V: r[1], A: r[2], K: r[3] } };
    })
  };

  /* Jawaban: larik huruf "V" | "A" | "K", satu per soal. */
  KD.skorGaya = function (jawaban) {
    var skor = { V: 0, A: 0, K: 0 };
    jawaban.forEach(function (j) {
      if (skor[j] !== undefined) skor[j] += 1;
    });
    var maks = Math.max(skor.V, skor.A, skor.K);
    var teratas = ["V", "A", "K"].filter(function (k) {
      return skor[k] === maks;
    });
    var hasil =
      teratas.length === 3
        ? "Seimbang (visual, auditori, kinestetik)"
        : teratas
            .map(function (k) {
              return KD.GAYA.tipe[k].nama;
            })
            .join(" + ");
    return { skor: skor, teratas: teratas, hasil: hasil };
  };

  /* ---------- Tes 2: Inventori kepribadian (lima dimensi) ---------- */

  /* d = dimensi, r = true jika butir dibalik (jawaban 5 dihitung 1). */
  var kepSoal = [
    { d: "E", r: false, t: "Aku mudah bergaul dan cepat akrab dengan orang baru." },
    { d: "E", r: false, t: "Aku merasa bersemangat saat berada di tengah keramaian." },
    { d: "E", r: false, t: "Aku suka menjadi orang yang memulai percakapan." },
    { d: "E", r: true, t: "Aku lebih nyaman menyendiri daripada bergabung dalam kelompok besar." },
    { d: "E", r: true, t: "Aku jarang berbicara kecuali diminta." },
    { d: "E", r: false, t: "Aku senang berbicara di depan teman-teman." },

    { d: "A", r: false, t: "Aku peduli ketika temanku sedang kesulitan." },
    { d: "A", r: false, t: "Aku bersedia mengalah demi menjaga hubungan baik." },
    { d: "A", r: false, t: "Aku mudah percaya bahwa orang lain punya niat baik." },
    { d: "A", r: true, t: "Aku sulit memaafkan orang yang pernah mengecewakanku." },
    { d: "A", r: true, t: "Aku sering lebih mementingkan keinginanku sendiri." },
    { d: "A", r: false, t: "Aku senang membantu tanpa perlu diminta." },

    { d: "C", r: false, t: "Aku menyelesaikan tugas sebelum tenggat waktu." },
    { d: "C", r: false, t: "Aku merapikan barang dan catatanku dengan teratur." },
    { d: "C", r: false, t: "Aku membuat rencana sebelum mulai mengerjakan sesuatu." },
    { d: "C", r: true, t: "Aku sering menunda pekerjaan sampai menit terakhir." },
    { d: "C", r: true, t: "Aku mudah lupa membawa barang atau mengerjakan tugas." },
    { d: "C", r: false, t: "Aku memeriksa pekerjaanku dengan teliti sebelum dikumpulkan." },

    { d: "S", r: false, t: "Aku tetap tenang ketika menghadapi tekanan." },
    { d: "S", r: false, t: "Aku cepat pulih setelah mengalami kekecewaan." },
    { d: "S", r: false, t: "Aku jarang merasa cemas berlebihan." },
    { d: "S", r: true, t: "Suasana hatiku mudah naik turun." },
    { d: "S", r: true, t: "Aku mudah tersinggung oleh hal kecil." },
    { d: "S", r: true, t: "Aku sering mengkhawatirkan hal yang belum terjadi." },

    { d: "O", r: false, t: "Aku senang mencoba cara baru dalam mengerjakan sesuatu." },
    { d: "O", r: false, t: "Aku penasaran dan suka mencari tahu hal-hal baru." },
    { d: "O", r: false, t: "Aku menikmati karya seni, musik, atau desain." },
    { d: "O", r: true, t: "Aku lebih suka cara yang sudah biasa dan terbukti." },
    { d: "O", r: true, t: "Aku jarang memikirkan ide-ide yang abstrak." },
    { d: "O", r: false, t: "Aku mudah menemukan ide kreatif saat menghadapi masalah." }
  ];

  KD.KEPRIBADIAN = {
    slug: "kepribadian",
    jenisDb: "kepribadian",
    judul: "Inventori kepribadian",
    petunjuk:
      "Nilai seberapa sesuai setiap pernyataan dengan dirimu yang sebenarnya, bukan dirimu yang kamu inginkan.",
    jenisSoal: "skala",
    skala: ["Sangat tidak sesuai", "Tidak sesuai", "Netral", "Sesuai", "Sangat sesuai"],
    urutanDimensi: ["E", "A", "C", "S", "O"],
    dimensi: {
      E: {
        nama: "Ekstraversi",
        ringkas: "Seberapa besar energimu datang dari berinteraksi dengan banyak orang.",
        tinggi: "Kamu bersemangat di tengah orang banyak dan mudah memulai percakapan.",
        sedang: "Kamu luwes: bisa aktif bersama orang lain, juga menikmati waktu sendiri.",
        rendah: "Kamu cenderung tenang dan lebih nyaman dalam lingkaran kecil atau saat sendiri."
      },
      A: {
        nama: "Keramahan",
        ringkas: "Seberapa kuat kamu memedulikan dan menjaga hubungan dengan orang lain.",
        tinggi: "Kamu peduli, mudah bekerja sama, dan senang membantu.",
        sedang: "Kamu bisa bekerja sama, tetapi tetap menyuarakan pendapatmu.",
        rendah: "Kamu cenderung lugas dan kritis, dan tidak mudah mengalah hanya demi menyenangkan orang."
      },
      C: {
        nama: "Kehati-hatian",
        ringkas: "Seberapa teratur, terencana, dan tekun caramu bekerja.",
        tinggi: "Kamu terencana, teliti, dan biasanya menuntaskan tugas tepat waktu.",
        sedang: "Kamu cukup teratur, dengan ruang untuk bersikap fleksibel.",
        rendah: "Kamu cenderung spontan dan santai. Jadwal dan pengingat bisa membantumu menuntaskan tugas."
      },
      S: {
        nama: "Kestabilan emosi",
        ringkas: "Seberapa tenang kamu menghadapi tekanan dan perubahan suasana hati.",
        tinggi: "Kamu cenderung tenang dan cepat pulih dari kekecewaan.",
        sedang: "Perasaanmu naik turun sewajarnya, tergantung situasi.",
        rendah: "Kamu peka terhadap tekanan dan perasaan. Menenangkan diri dan bercerita kepada orang yang kamu percaya dapat membantu."
      },
      O: {
        nama: "Keterbukaan",
        ringkas: "Seberapa besar rasa ingin tahu dan minatmu pada hal baru dan kreatif.",
        tinggi: "Kamu penasaran, kreatif, dan senang mencoba cara baru.",
        sedang: "Kamu menyeimbangkan hal baru dengan cara yang sudah terbukti.",
        rendah: "Kamu menyukai hal yang jelas, praktis, dan sudah terbukti."
      }
    },
    soal: kepSoal.map(function (s) {
      return { t: s.t, d: s.d, r: s.r };
    })
  };

  /* Level dari jumlah enam butir (rentang 6 sampai 30). Batasnya heuristik
     untuk keperluan kelas, bukan norma baku. */
  KD.levelKep = function (skor) {
    if (skor >= 22) return "tinggi";
    if (skor >= 15) return "sedang";
    return "rendah";
  };

  /* Jawaban: larik angka 1..5 sejajar dengan KD.KEPRIBADIAN.soal. */
  KD.skorKepribadian = function (jawaban) {
    var K = KD.KEPRIBADIAN;
    var skor = { E: 0, A: 0, C: 0, S: 0, O: 0 };
    K.soal.forEach(function (s, i) {
      var v = Number(jawaban[i]);
      skor[s.d] += s.r ? 6 - v : v;
    });
    var urut = K.urutanDimensi.slice().sort(function (a, b) {
      return skor[b] - skor[a];
    });
    var seimbang = skor[urut[0]] - skor[urut[4]] <= 4;
    var hasil = seimbang
      ? "Seimbang di kelima sisi"
      : K.dimensi[urut[0]].nama + " + " + K.dimensi[urut[1]].nama;
    return { skor: skor, urut: urut, hasil: hasil };
  };
})();
