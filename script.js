/* ==========================================================
   UTILITAS
   ========================================================== */
var kurangGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function bacaStorage(kunci) {
  try {
    return window.localStorage.getItem(kunci);
  } catch (err) {
    return null;
  }
}

function tulisStorage(kunci, nilai) {
  try {
    window.localStorage.setItem(kunci, nilai);
  } catch (err) {}
}

function dua(n) {
  return n < 10 ? '0' + n : '' + n;
}

/* ==========================================================
   1. MENU HAMBURGER
   ========================================================== */
var tombolMenu = document.getElementById('tombol-menu');
var menuUtama = document.getElementById('menu-utama');

function setMenu(buka) {
  menuUtama.classList.toggle('buka', buka);
  tombolMenu.classList.toggle('aktif', buka);
  tombolMenu.setAttribute('aria-expanded', buka ? 'true' : 'false');
  tombolMenu.setAttribute('aria-label', buka ? 'Tutup menu' : 'Buka menu');
}

tombolMenu.addEventListener('click', function () {
  setMenu(!menuUtama.classList.contains('buka'));
});

menuUtama.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    setMenu(false);
  });
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    setMenu(false);
  }
});

window.addEventListener('resize', function () {
  if (window.innerWidth > 768) {
    setMenu(false);
  }
});

/* ==========================================================
   2. DARK MODE / LIGHT MODE (localStorage)
   ========================================================== */
var tombolTema = document.getElementById('tombol-tema');
var ikonTema = document.getElementById('ikon-tema');

function terapkanTema(tema) {
  var gelap = tema === 'dark';
  if (gelap) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  ikonTema.textContent = gelap ? '\u2600\uFE0F' : '\uD83C\uDF19';
  tombolTema.setAttribute('aria-label', gelap ? 'Ganti ke mode terang' : 'Ganti ke mode gelap');
  tombolTema.setAttribute('aria-pressed', gelap ? 'true' : 'false');
}

terapkanTema(bacaStorage('klr_tema') === 'dark' ? 'dark' : 'light');

tombolTema.addEventListener('click', function () {
  var baru = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  terapkanTema(baru);
  tulisStorage('klr_tema', baru);
});

/* ==========================================================
   3. ANIMASI SCROLL
   ========================================================== */
var elemenReveal = document.querySelectorAll(
  '.hero-teks, .hero-gambar, .tentang-gambar, .tentang-teks, .judul-section, .cari-wadah, ' +
  '.kartu, .sub-judul, .galeri-filter, .galeri-area, .faq-item, .kontak-info, .form-kartu'
);

if ('IntersectionObserver' in window && !kurangGerak) {
  var pengamat = new IntersectionObserver(function (entri) {
    entri.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('muncul');
        pengamat.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elemenReveal.forEach(function (el) {
    el.classList.add('reveal');
    pengamat.observe(el);
  });
}

/* ==========================================================
   4. JAM DIGITAL + SAPAAN DINAMIS + TOAST
   ========================================================== */
var elJam = document.getElementById('jam');
var elSapaan = document.getElementById('sapaan');
var toast = document.getElementById('toast');
var toastTeks = document.getElementById('toast-teks');
var timerToast;

function sapaanWaktu(jam) {
  if (jam >= 4 && jam < 11) return 'Selamat Pagi';
  if (jam >= 11 && jam < 15) return 'Selamat Siang';
  if (jam >= 15 && jam < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}

function perbaruiJam() {
  var sekarang = new Date();
  elJam.textContent = dua(sekarang.getHours()) + ':' + dua(sekarang.getMinutes()) + ':' + dua(sekarang.getSeconds());
  elSapaan.textContent = sapaanWaktu(sekarang.getHours()) + ', sedulur! Selamat datang di Klaten Rasa.';
}

function tutupToast() {
  toast.classList.remove('tampil');
}

function tampilToast(pesan) {
  toastTeks.textContent = pesan;
  toast.classList.add('tampil');
  clearTimeout(timerToast);
  timerToast = setTimeout(tutupToast, 5000);
}

document.getElementById('toast-tutup').addEventListener('click', tutupToast);

perbaruiJam();
setInterval(perbaruiJam, 1000);
tampilToast(sapaanWaktu(new Date().getHours()) + '! Selamat datang di Klaten Rasa_Reza.');

/* ==========================================================
   5. PENGHITUNG PENGUNJUNG SIMULASI (localStorage)
   ========================================================== */
var elPengunjung = document.getElementById('pengunjung');
var dasarPengunjung = 1200;
var jumlahPengunjung = parseInt(bacaStorage('klr_pengunjung'), 10);

if (isNaN(jumlahPengunjung) || jumlahPengunjung < dasarPengunjung) {
  jumlahPengunjung = dasarPengunjung;
}
jumlahPengunjung += 1;
tulisStorage('klr_pengunjung', String(jumlahPengunjung));
elPengunjung.textContent = jumlahPengunjung.toLocaleString('id-ID');

/* ==========================================================
   6. TOMBOL PESAN (kode lama)
   ========================================================== */
document.querySelectorAll('[data-produk]').forEach(function (tombol) {
  tombol.addEventListener('click', function () {
    document.getElementById('pilihan').value = tombol.dataset.produk;
  });
});

/* ==========================================================
   7. PENCARIAN PRODUK
   ========================================================== */
var inputCari = document.getElementById('cari-produk');
var pesanKosong = document.getElementById('cari-kosong');
var grupUnggulan = document.querySelector('.unggulan');
var grupGem = document.querySelector('.gem-geser');
var judulGem = document.getElementById('judul-gem');
var kartuProduk = document.querySelectorAll('#produk .kartu');

function hitungTampil(grup) {
  return grup.querySelectorAll('.kartu:not([hidden])').length;
}

function cariProduk() {
  var kata = inputCari.value.trim().toLowerCase();

  kartuProduk.forEach(function (kartu) {
    var teks = (kartu.querySelector('h3').textContent + ' ' + kartu.querySelector('p').textContent).toLowerCase();
    kartu.hidden = teks.indexOf(kata) === -1;
  });

  var jumlahUnggulan = hitungTampil(grupUnggulan);
  var jumlahGem = hitungTampil(grupGem);

  grupUnggulan.hidden = jumlahUnggulan === 0;
  grupGem.hidden = jumlahGem === 0;
  judulGem.hidden = jumlahGem === 0;

  if (jumlahUnggulan + jumlahGem === 0) {
    pesanKosong.textContent = 'Produk "' + inputCari.value.trim() + '" tidak ditemukan. Coba kata kunci lain.';
    pesanKosong.hidden = false;
  } else {
    pesanKosong.hidden = true;
  }
}

inputCari.addEventListener('input', cariProduk);

/* ==========================================================
   8. GALERI: slider (kode lama) + filter + lightbox
   ========================================================== */
var galeri = document.getElementById('galeri-geser');
var semuaFoto = galeri.querySelectorAll('img');
var fotos = Array.prototype.slice.call(semuaFoto);
var nama = document.getElementById('galeri-nama');
var wadahTitik = document.getElementById('galeri-titik');
var titik = [];

function bangunTitik() {
  wadahTitik.innerHTML = '';
  titik = [];
  fotos.forEach(function (foto, i) {
    var t = document.createElement('button');
    t.type = 'button';
    t.setAttribute('aria-label', 'Foto ' + (i + 1));
    t.addEventListener('click', function () {
      foto.scrollIntoView({behavior: 'smooth', inline: 'center', block: 'nearest'});
    });
    wadahTitik.appendChild(t);
    titik.push(t);
  });
}

function ukur() {
  if (fotos.length === 0) {
    return;
  }
  var tengah = galeri.getBoundingClientRect().left + galeri.clientWidth / 2;
  var terdekat = 0;
  var jarakMin = Infinity;
  fotos.forEach(function (foto, i) {
    var r = foto.getBoundingClientRect();
    var selisih = Math.abs(r.left + r.width / 2 - tengah);
    var j = Math.min(selisih / r.width, 1);
    foto.style.transform = 'scale(' + (1.05 - j * 0.4) + ')';
    foto.style.opacity = 1 - j * 0.45;
    if (selisih < jarakMin) {
      jarakMin = selisih;
      terdekat = i;
    }
  });
  nama.textContent = fotos[terdekat].alt;
  titik.forEach(function (t, i) {
    t.classList.toggle('aktif', i === terdekat);
  });
}

bangunTitik();

galeri.addEventListener('scroll', ukur);
window.addEventListener('resize', ukur);
window.addEventListener('load', ukur);

document.querySelector('.panah-kiri').addEventListener('click', function () {
  galeri.scrollBy({left: -260, behavior: 'smooth'});
});
document.querySelector('.panah-kanan').addEventListener('click', function () {
  galeri.scrollBy({left: 260, behavior: 'smooth'});
});

/* --- filter kategori --- */
var tombolFilter = document.querySelectorAll('.filter-btn');

function terapkanFilter(kategori) {
  semuaFoto.forEach(function (foto) {
    var daftar = (foto.dataset.kategori || '').split(' ');
    foto.hidden = !(kategori === 'semua' || daftar.indexOf(kategori) !== -1);
  });
  fotos = Array.prototype.filter.call(semuaFoto, function (foto) {
    return !foto.hidden;
  });
  bangunTitik();
  galeri.scrollLeft = 0;
  ukur();
}

tombolFilter.forEach(function (tombol) {
  tombol.addEventListener('click', function () {
    tombolFilter.forEach(function (t) {
      var aktif = t === tombol;
      t.classList.toggle('aktif', aktif);
      t.setAttribute('aria-pressed', aktif ? 'true' : 'false');
    });
    terapkanFilter(tombol.dataset.filter);
  });
});

/* --- lightbox --- */
var lightbox = document.getElementById('lightbox');
var lightboxGambar = document.getElementById('lightbox-img');
var lightboxTeks = document.getElementById('lightbox-teks');
var lightboxTutup = document.getElementById('lightbox-tutup');
var pemicuLightbox = null;

function bukaLightbox(foto) {
  pemicuLightbox = foto;
  lightboxGambar.src = foto.src;
  lightboxGambar.alt = foto.alt;
  lightboxTeks.textContent = foto.alt;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  lightboxTutup.focus();
}

function tutupLightbox() {
  lightbox.hidden = true;
  lightboxGambar.removeAttribute('src');
  document.body.style.overflow = '';
  if (pemicuLightbox) {
    pemicuLightbox.focus();
  }
}

semuaFoto.forEach(function (foto) {
  foto.tabIndex = 0;
  foto.setAttribute('role', 'button');
  foto.setAttribute('aria-label', 'Perbesar foto ' + foto.alt);
  foto.addEventListener('click', function () {
    bukaLightbox(foto);
  });
  foto.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      bukaLightbox(foto);
    }
  });
});

lightbox.addEventListener('click', function (e) {
  if (e.target === lightbox || e.target === lightboxTutup) {
    tutupLightbox();
  }
});

document.addEventListener('keydown', function (e) {
  if (lightbox.hidden) {
    return;
  }
  if (e.key === 'Escape') {
    tutupLightbox();
  } else if (e.key === 'Tab') {
    e.preventDefault();
    lightboxTutup.focus();
  }
});

/* ==========================================================
   9. FAQ AKORDEON
   ========================================================== */
document.querySelectorAll('.faq-tanya').forEach(function (tombol) {
  tombol.addEventListener('click', function () {
    var item = tombol.parentElement;
    var buka = !item.classList.contains('buka');
    item.classList.toggle('buka', buka);
    tombol.setAttribute('aria-expanded', buka ? 'true' : 'false');
  });
});

/* ==========================================================
   10. RATING BINTANG (localStorage)
   ========================================================== */
var bintang = document.querySelectorAll('.bintang');
var wadahRating = document.getElementById('rating');
var infoRating = document.getElementById('rating-info');
var teksRating = ['', 'Kurang puas', 'Cukup', 'Bagus', 'Sangat bagus', 'Luar biasa'];
var ratingTersimpan = parseInt(bacaStorage('klr_rating'), 10);

if (isNaN(ratingTersimpan) || ratingTersimpan < 1 || ratingTersimpan > 5) {
  ratingTersimpan = 0;
}

function gambarBintang(jumlah) {
  bintang.forEach(function (b, i) {
    b.classList.toggle('aktif', i < jumlah);
    b.setAttribute('aria-pressed', i + 1 === ratingTersimpan ? 'true' : 'false');
  });
}

function perbaruiInfoRating() {
  if (ratingTersimpan) {
    infoRating.textContent = 'Penilaianmu: ' + ratingTersimpan + ' dari 5 bintang (' + teksRating[ratingTersimpan] + '). Terima kasih!';
  } else {
    infoRating.textContent = 'Klik bintang untuk memberi penilaian.';
  }
}

bintang.forEach(function (b, i) {
  b.addEventListener('mouseenter', function () {
    gambarBintang(i + 1);
  });
  b.addEventListener('click', function () {
    ratingTersimpan = i + 1;
    tulisStorage('klr_rating', String(ratingTersimpan));
    gambarBintang(ratingTersimpan);
    perbaruiInfoRating();
  });
});

wadahRating.addEventListener('mouseleave', function () {
  gambarBintang(ratingTersimpan);
});

gambarBintang(ratingTersimpan);
perbaruiInfoRating();

/* ==========================================================
   11. VALIDASI FORMULIR
   ========================================================== */
var form = document.getElementById('form-kontak');
var pesanOk = document.getElementById('pesan-ok');
var pesanGalat = document.getElementById('pesan-galat');

var aturan = {
  nama: function (v) {
    v = v.trim();
    if (!v) return 'Nama wajib diisi.';
    if (v.length < 3) return 'Nama minimal 3 karakter.';
    return '';
  },
  email: function (v) {
    v = v.trim();
    if (!v) return 'Email wajib diisi.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Format email belum benar, contoh: nama@email.com.';
    return '';
  },
  hp: function (v) {
    var angka = v.replace(/[\s-]/g, '');
    if (!angka) return 'Nomor HP wajib diisi.';
    if (!/^(\+62|62|0)8[0-9]{8,11}$/.test(angka)) return 'Nomor HP tidak valid, contoh: 0812-3456-7890.';
    return '';
  }
};

function periksaKolom(id) {
  var input = document.getElementById(id);
  var galat = document.getElementById('galat-' + id);
  var pesan = aturan[id](input.value);
  galat.textContent = pesan;
  input.classList.toggle('tidak-valid', pesan !== '');
  input.setAttribute('aria-invalid', pesan !== '' ? 'true' : 'false');
  return pesan === '';
}

Object.keys(aturan).forEach(function (id) {
  document.getElementById(id).addEventListener('input', function () {
    pesanOk.style.display = 'none';
    if (this.classList.contains('tidak-valid')) {
      periksaKolom(id);
    }
  });
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  var valid = true;
  var kolomPertama = null;

  Object.keys(aturan).forEach(function (id) {
    if (!periksaKolom(id)) {
      valid = false;
      if (!kolomPertama) {
        kolomPertama = document.getElementById(id);
      }
    }
  });

  if (!valid) {
    pesanOk.style.display = 'none';
    pesanGalat.style.display = 'block';
    kolomPertama.focus();
    return;
  }

  pesanGalat.style.display = 'none';
  pesanOk.style.display = 'block';
  form.reset();
});

/* ==========================================================
   12. TOMBOL KEMBALI KE ATAS
   ========================================================== */
var tombolAtas = document.getElementById('ke-atas');

function cekScroll() {
  tombolAtas.classList.toggle('tampil', window.scrollY > 400);
}

window.addEventListener('scroll', cekScroll, {passive: true});
cekScroll();

tombolAtas.addEventListener('click', function () {
  window.scrollTo({top: 0, behavior: kurangGerak ? 'auto' : 'smooth'});
});