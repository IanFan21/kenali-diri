/*
  Lapisan data. Dua mode:
  - "supabase": data disimpan di database; nama hanya terbaca oleh admin (aturan ada di supabase/schema.sql).
  - "demo": data disimpan di localStorage browser itu saja. Hanya untuk mencoba tampilan.
*/
(function () {
  var KD = (window.KD = window.KD || {});
  var C = KD.CONFIG || {};
  var pakaiSupabase = !!(C.SUPABASE_URL && C.SUPABASE_ANON_KEY);
  var KUNCI_DEMO = "kenali-diri-demo-v1";
  var PUSTAKA = "js/vendor/supabase-2.118.0.js";
  var klienJanji = null;

  function muatKlien() {
    if (klienJanji) return klienJanji;
    klienJanji = new Promise(function (ok, gagal) {
      function buat() {
        ok(window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY));
      }
      if (window.supabase && window.supabase.createClient) return buat();
      var s = document.createElement("script");
      s.src = PUSTAKA;
      s.onload = buat;
      s.onerror = function () {
        klienJanji = null;
        gagal(new Error("Pustaka Supabase gagal dimuat."));
      };
      document.head.append(s);
    });
    return klienJanji;
  }

  function bacaDemo() {
    try {
      var d = JSON.parse(localStorage.getItem(KUNCI_DEMO) || "[]");
      return Array.isArray(d) ? d : [];
    } catch (e) {
      return [];
    }
  }
  function tulisDemo(d) {
    try {
      localStorage.setItem(KUNCI_DEMO, JSON.stringify(d));
    } catch (e) {
      throw new Error("Browser menolak menyimpan data percobaan.");
    }
  }

  /* Nama kolom sama dengan tabel hasil_tes. */
  var data = {
    mode: pakaiSupabase ? "supabase" : "demo",

    /* baris: {kode, jenis, nama, kelas, skor, hasil}. Melempar galat dengan .kode = "23505" jika kode kembar. */
    simpan: function (baris) {
      if (!pakaiSupabase) {
        var semua = bacaDemo();
        if (
          semua.some(function (r) {
            return r.kode === baris.kode;
          })
        ) {
          var e = new Error("Kode kembar");
          e.kode = "23505";
          return Promise.reject(e);
        }
        semua.push(Object.assign({ id: KD.acakId(), dibuat: new Date().toISOString() }, baris));
        tulisDemo(semua);
        return Promise.resolve();
      }
      return muatKlien().then(function (k) {
        return k.from("hasil_tes").insert(baris).then(function (res) {
          if (res.error) {
            var e = new Error(res.error.message);
            e.kode = res.error.code;
            throw e;
          }
        });
      });
    },

    /* Tanpa nama. Di mode supabase membaca view hasil_publik. */
    ambilPublik: function () {
      if (!pakaiSupabase) {
        return Promise.resolve(
          bacaDemo()
            .map(function (r) {
              return { kode: r.kode, jenis: r.jenis, kelas: r.kelas, skor: r.skor, hasil: r.hasil, dibuat: r.dibuat };
            })
            .sort(function (a, b) {
              return a.dibuat < b.dibuat ? 1 : -1;
            })
        );
      }
      return muatKlien().then(function (k) {
        return k
          .from("hasil_publik")
          .select("kode,jenis,kelas,skor,hasil,dibuat")
          .order("dibuat", { ascending: false })
          .limit(1000)
          .then(function (res) {
            if (res.error) throw new Error(res.error.message);
            return res.data || [];
          });
      });
    },

    /* ---- Khusus admin ---- */

    /* Mengembalikan {masuk: boolean, email?, demo?: true} */
    sesi: function () {
      if (!pakaiSupabase) return Promise.resolve({ masuk: true, demo: true });
      return muatKlien().then(function (k) {
        return k.auth.getSession().then(function (r) {
          var s = r.data && r.data.session;
          if (!s) return { masuk: false };
          return k.rpc("saya_admin").then(function (a) {
            if (a.error || a.data !== true) {
              return k.auth.signOut().then(function () {
                return { masuk: false, bukanAdmin: true };
              });
            }
            return { masuk: true, email: s.user.email };
          });
        });
      });
    },

    masuk: function (email, sandi) {
      if (!pakaiSupabase) return Promise.resolve({ masuk: true, demo: true });
      return muatKlien().then(function (k) {
        return k.auth.signInWithPassword({ email: email, password: sandi }).then(function (r) {
          if (r.error) throw new Error("Email atau kata sandi tidak cocok.");
          return data.sesi();
        });
      });
    },

    keluar: function () {
      if (!pakaiSupabase) return Promise.resolve();
      return muatKlien().then(function (k) {
        return k.auth.signOut();
      });
    },

    ambilSemua: function () {
      if (!pakaiSupabase) {
        return Promise.resolve(
          bacaDemo().sort(function (a, b) {
            return a.dibuat < b.dibuat ? 1 : -1;
          })
        );
      }
      return muatKlien().then(function (k) {
        return k
          .from("hasil_tes")
          .select("id,kode,jenis,nama,kelas,skor,hasil,dibuat")
          .order("dibuat", { ascending: false })
          .limit(1000)
          .then(function (res) {
            if (res.error) throw new Error(res.error.message);
            return res.data || [];
          });
      });
    },

    hapus: function (id) {
      if (!pakaiSupabase) {
        tulisDemo(
          bacaDemo().filter(function (r) {
            return r.id !== id;
          })
        );
        return Promise.resolve();
      }
      return muatKlien().then(function (k) {
        return k
          .from("hasil_tes")
          .delete()
          .eq("id", id)
          .then(function (res) {
            if (res.error) throw new Error(res.error.message);
          });
      });
    }
  };

  KD.data = data;
})();
