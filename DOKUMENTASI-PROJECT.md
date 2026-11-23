# Dokumentasi Project — MOONITOR Landing Page

Dokumentasi ini menjelaskan fungsi setiap file penting di project **MOONITOR Landing Page** dengan bahasa yang sederhana dan urutan yang runtut: mulai dari saat pengunjung membuka alamat website, bagaimana halaman disusun dari atas ke bawah, bagaimana tampilan (CSS) dan interaksi (JavaScript) bekerja, hingga bagaimana file mentah dikemas menjadi file siap pakai di folder `public/build/`.

---

## Gambaran Besar: Urutan Saat Website Dibuka

1. Pengunjung membuka alamat website (`/`).
2. Server mengarahkan request ke **`public/index.php`**.
3. **`routes/web.php`** menentukan halaman mana yang harus ditampilkan, yaitu **`resources/views/welcome.blade.php`**.
4. **`welcome.blade.php`** memakai kerangka **`resources/views/layouts/landing.blade.php`** dan menyusun bagian-bagian halaman dari atas (`header`) sampai bawah (`footer`).
5. Untuk mempercantik tampilan dan membuat halaman interaktif, layout memuat CSS dan JavaScript melalui Vite:
   - Saat **development**: mengambil langsung dari `resources/css/app.css` dan `resources/js/app.js`.
   - Saat **production (online)**: mengambil file hasil kompilasi di **`public/build/assets/app-BRuZgSmh.css`** dan **`public/build/assets/app-BD9wiJ3C.js`** (dipetakan lewat **`public/build/manifest.json`**).

---

## 1. Titik Masuk Request (`public/` & `routes/`)

File-file ini adalah gerbang pertama yang menerima permintaan dari browser pengunjung:

- **`public/index.php`**
  Pintu masuk utama aplikasi Laravel. File ini menyalakan framework, mengecek apakah website sedang dalam mode maintenance, memuat library PHP dari Composer, lalu memproses request pengunjung.
- **`public/.htaccess`**
  Aturan untuk web server Apache. Tugasnya meneruskan header keamanan/otorisasi, merapikan URL (menghapus tanda `/` berlebih di akhir URL), dan mengarahkan semua request yang bukan file fisik ke `public/index.php`.
- **`public/robots.txt`**
  Memberi tahu mesin pencari (seperti Google) bahwa seluruh halaman website boleh diindeks (`Disallow:` kosong).
- **`routes/web.php`**
  Daftar alamat URL website. Di project ini hanya ada satu rute utama: jika pengunjung membuka `/`, tampilkan view `welcome` (`Route::view('/', 'welcome')->name('home')`).

---

## 2. Kerangka & Isi Halaman Dari Atas ke Bawah (`resources/views/`)

Setelah rute `/` dipanggil, Laravel merender file-file Blade berikut secara berurutan:

### Kerangka Utama
1. **`resources/views/layouts/landing.blade.php`**
   Kerangka HTML utama seluruh halaman (`<html>`, `<head>`, `<body>`). Di sini diatur judul halaman, deskripsi SEO, warna tema browser, pemuatan font Google (`Chakra Petch` & `Oxanium`), ikon tab (`favicon.png`), pemanggilan CSS & JS lewat `@vite`, serta posisi tetap `header` di atas dan `footer` di bawah.
2. **`resources/views/welcome.blade.php`**
   Halaman utama yang mengisi bagian tengah (`@section('content')`) di dalam kerangka `landing.blade.php`. File ini memanggil komponen-komponen section secara berurutan dari atas sampai bawah.

### Bagian-Bagian Halaman (Urut Dari Atas ke Bawah)
Semua file di bawah ini berada di dalam folder **`resources/views/components/landing/`**:

1. **`header.blade.php`** *(Paling Atas)*
   Menampilkan logo **MOONITOR**, tombol menu garis tiga (hamburger) untuk layar HP, dan daftar link navigasi (`Beranda`, `Fitur`, `Dashboard`, `Cara Kerja`, `Testimoni`, `FAQ`).
2. **`hero.blade.php`** *(Bagian Pembuka)*
   Bagian pertama yang dilihat pengunjung. Berisi judul `"Cerdas Pantau Sapi"`, teks pengantar (yang bisa menyesuaikan gaya bahasa tergantung perilaku pengunjung), foto kandang sapi (`cow-barn.jpg`), animasi loading skeleton, dan label `LIVE`.
3. **`promo.blade.php`** *(Pengenalan Singkat)*
   Bagian ajakan singkat untuk mengenal platform MOONITOR, dilengkapi tombol menuju bagian Cara Kerja (`#teknologi`) dan hiasan visual lingkaran berdenyut.
4. **`features.blade.php`** *(Fitur Utama)*
   Menampilkan 3 kartu fitur utama: **Suhu & Kelembapan**, **Kualitas Udara**, dan **Status Kandang**. Tiap kartu punya penanda `data-persona-highlight` agar bisa disorot otomatis sesuai minat pengunjung.
5. **`about.blade.php`** *(Tentang MOONITOR)*
   Bagian informasi dengan **4 tab interaktif**: *Tentang MOONITOR*, *Tujuan Pembuatan Website*, *Manfaat untuk Peternak*, dan *Cara Kerja Sistem*. Isi masing-masing tab disimpan dalam `<template>` agar bisa berganti tanpa memuat ulang halaman.
6. **`dashboard.blade.php`** *(Pratinjau Dashboard)*
   Menampilkan gambar contoh tampilan dashboard (`dashobard-dummy.png`). Jika gambar diklik, akan muncul jendela pop-up (`<dialog id="imageModal">`) untuk memperbesar gambar.
7. **`technology.blade.php`** *(Cara Kerja & Teknologi)*
   Menjelaskan alur kerja MOONITOR dalam **4 langkah** (mulai dari sensor membaca kondisi kandang, data diproses sistem, hingga tampil di dashboard) lengkap dengan gambar kandang dan ilustrasi diagram SVG.
8. **`testimonials.blade.php`** *(Testimoni)*
   Menampilkan contoh ulasan dan rating dari peternak (`4.8 dari 5`), topik pengalaman pengguna, dan kartu-kartu kutipan testimoni.
9. **`faq.blade.php`** *(Pertanyaan Umum)*
   Daftar pertanyaan yang sering ditanyakan beserta jawabannya menggunakan elemen `<details>` dan `<summary>` (bisa diklik untuk buka-tutup).
10. **`cta.blade.php`** *(Ajakan Penutup)*
    Bagian ajakan terakhir sebelum footer agar pengunjung menghubungi tim MOONITOR, ditemani logo MOONITOR dengan efek skeleton loading.
11. **`footer.blade.php`** *(Paling Bawah)*
    Berisi logo, ringkasan singkat, kolom tautan cepat (*Produk*, *Perusahaan*, *Kontak* ke WhatsApp/email/telepon), tahun hak cipta otomatis (`now()->year`), dan tombol `"Kembali ke atas"`.

---

## 3. Aset Gambar & Ikon (`public/`)

Gambar dan ikon yang dipanggil oleh file Blade di atas disimpan langsung di `public/` agar bisa diakses browser:

- **`public/favicon.ico`** & **`public/favicon.png`**
  Ikon kecil di tab browser. `favicon.png` juga dipakai sebagai gambar logo di header, footer, dan ikon pada bagian CTA.
- **`public/images/cow-barn.jpg`**
  Foto kandang sapi yang tampil di bagian Hero (`hero.blade.php`) dan Langkah 01 bagian Teknologi (`technology.blade.php`).
- **`public/images/dashobard-dummy.png`**
  Gambar pratinjau dashboard yang tampil di bagian Dashboard (`dashboard.blade.php`) dan di dalam pop-up zoom. *(Catatan: nama filenya tertulis `dashobard-dummy.png`)*.

---

## 4. Tampilan & Gaya Halaman (`resources/css/`)

CSS disusun secara modular (terpisah per fungsi dan per bagian halaman) agar mudah dirapikan:

1. **`resources/css/app.css`**
   Pintu masuk CSS. Isinya hanya mengimpor `landing/main.css`.
2. **`resources/css/landing/main.css`**
   Pengatur urutan impor seluruh file CSS agar aturan dasar tidak menimpa aturan komponen. Urutannya:
   - **`variables.css`** — Menyimpan warna brand (seperti `--moon-black`, `--moon-green-bright`), jenis font, jarak antar-bagian, dan ukuran teks standar.
   - **`base.css`** — Mengatur gaya dasar elemen HTML (margin nol, warna latar gelap, warna teks putih, gambar agar tidak melebar keluar layar).
   - **`layout.css`** — Mengatur class pembungkus yang dipakai bersama di banyak bagian, seperti `.moon-container`, `.moon-section`, judul bagian, dan gaya tombol.
   - **`components/*.css`** — Gaya khusus untuk masing-masing bagian halaman (`header.css`, `hero.css`, `promo.css`, `features.css`, `about.css`, `dashboard.css`, `technology.css`, `testimonials.css`, `faq.css`, `cta.css`, `footer.css`), ditambah **`skeleton.css`** untuk animasi kilau abu-abu (*shimmer*) saat gambar/konten sedang dimuat.
   - **`responsive.css`** — Menambahkan aturan aksesibilitas `@media (prefers-reduced-motion: reduce)` untuk mematikan animasi jika perangkat pengunjung memilih mode minim gerakan.

---

## 5. Logika Interaksi & Fitur Pintar (`resources/js/`)

JavaScript membuat halaman bisa merespons klik, scroll, dan perilaku pengunjung.

### Pintu Masuk & Pengelola Utama
1. **`resources/js/app.js`**
   Pintu masuk JavaScript untuk Vite; langsung memanggil `landing/main.js`.
2. **`resources/js/landing/main.js`**
   **Koordinator utama**. Saat halaman selesai dimuat, file ini menyalakan semua fitur interaktif satu per satu dan menyiapkan `AbortController` agar semua event listener bisa dibersihkan dengan rapi saat halaman ditutup atau dibuka ulang dari cache browser (*bfcache*).
3. **`resources/js/landing/navigation.js`**
   Mengatur perilaku header dan menu: menambah efek latar saat halaman di-scroll (`.is-scrolled`), membuka/menutup menu di layar HP, menutup menu saat tombol `Esc` ditekan, dan menandai link menu yang sedang aktif.

### Fitur Interaktif Per Komponen (`resources/js/landing/components/`)
- **`skeleton.js`** — Mengatur loading gambar dan font. Jika gambar sudah tersimpan di cache browser, gambar langsung tampil tanpa berkedip (*zero-flicker*). Jika belum, tampilkan animasi skeleton sampai gambar selesai dimuat.
- **`about-tabs.js`** — Mengatur perpindahan 4 tab di bagian *Tentang MOONITOR* (bisa diklik maupun digeser dengan tombol panah keyboard), sekaligus mengunci tinggi kotak tab agar halaman tidak "lompat" saat isi tab berganti.
- **`preview-dialog.js`** — Membuka jendela pop-up (`#imageModal`) saat gambar dashboard diklik, serta menutupnya saat tombol silang atau area luar gambar diklik.
- **`cta-demo.js`** — Modul opsional untuk simulasi angka sensor live (suhu, kelembapan, NH3, H2S) setiap 2,5 detik jika elemen demo tersebut dipasang di halaman.

### Fitur Adaptif Pengunjung (`resources/js/landing/adaptive.js` & `resources/js/landing/adaptive/`)
Fitur tambahan (*progressive enhancement*) yang mencoba menebak kebutuhan pengunjung (`developer`, `business`, atau `skeptic`) dari cara mereka membaca halaman, lalu menyesuaikan teks tertentu dan menyorot kartu fitur yang paling relevan:

- **`adaptive.js`** — Pintu pintas (*facade*) yang meneruskan fungsi dari folder `adaptive/`.
- **`adaptive/index.js`** — Pengendali hidup/mati fitur adaptif; membaca pengaturan dari atribut HTML atau environment variable.
- **`adaptive/constants.js`** — Daftar nama persona, daftar section halaman, daftar sinyal perilaku yang dihitung, serta bobot nilai awal.
- **`adaptive/config.js`** — Memastikan semua angka pengaturan dan URL model aman dan berada dalam batas wajar.
- **`adaptive/state.js`** — Penyimpan status sementara saat fitur adaptif sedang berjalan.
- **`adaptive/tracker.js`** — Mencatat aktivitas pengunjung di halaman (berapa lama melihat tiap bagian, kecepatan scroll, scroll balik ke atas, membuka FAQ, klik tab, atau membuka pratinjau dashboard).
- **`adaptive/features.js`** — Mengubah catatan aktivitas mentah menjadi angka rasio `0` sampai `1` yang siap dihitung.
- **`adaptive/classifier.js`** — Menghitung skor kecocokan persona menggunakan rumus bobot (*heuristic*) atau model TensorFlow.js jika tersedia.
- **`adaptive/tensorflow.js`** — Memuat library TensorFlow.js secara opsional dari CDN (hanya jika alamat model dikonfigurasi) dan memvalidasi keamanannya.
- **`adaptive/dom.js`** — Menukar isi teks `<template>` yang sesuai dengan persona pengunjung (menunggu sampai teks tersebut tidak sedang dilihat agar tidak mengganggu pembaca) dan memberi sorotan pada kartu fitur yang cocok.
- **`adaptive/engine.js`** — Pengambil keputusan berkala: memastikan hasil tebakan sudah cukup yakin dan melewati masa jeda (*cooldown*) sebelum mengubah tampilan.

---

## 6. Proses Build & File Hasil Jadi (`vite.config.js` & `public/build/`)

Browser tidak membaca file CSS dan JS yang terpecah-pecah di folder `resources/` secara langsung saat website sudah online. Di sinilah **Vite** bekerja:

1. **`vite.config.js`**
   File pengaturan Vite. Menetapkan dua file sumber utama untuk dikemas: `resources/css/app.css` dan `resources/js/app.js`.
2. **`public/build/assets/app-BRuZgSmh.css`**
   **Hasil jadi CSS** setelah seluruh file di `resources/css/` digabungkan dan diperkecil (*minified*) oleh Vite saat menjalankan `npm run build`. Kode acak `BRuZgSmh` di nama file berguna untuk *cache busting* (agar browser langsung mengunduh versi terbaru setiap kali ada perubahan CSS).
3. **`public/build/assets/app-BD9wiJ3C.js`**
   **Hasil jadi JavaScript** di folder `public/build/assets/` dari penggabungan dan minifikasi modul-modul di `resources/js/` saat proses build Vite. Sama seperti CSS, kode acak di belakang `app-` menandakan versi build tertentu agar browser tidak memakai cache lama.
4. **`public/build/manifest.json`**
   Daftar indeks otomatis yang dibuat Vite agar Laravel (`@vite(...)` di `landing.blade.php`) tahu file CSS dan JS hasil build mana yang harus dimuat di halaman. *(Jika kamu baru saja mengedit `resources/css/` atau `resources/js/` dan menjalankan `npm run build`, nama hash di `public/build/assets/` dan `manifest.json` akan ikut diperbarui).*

---

## 7. File Pengaturan Project di Root

- **`composer.json`** — Mengatur dependensi PHP/Laravel (`php ^8.4`, `laravel/framework ^13.17`) serta perintah praktis seperti `composer dev` dan `composer test`.
- **`package.json`** — Mengatur dependensi frontend (`vite`, `laravel-vite-plugin`, `concurrently`) serta perintah `npm run dev` (mode pengembangan) dan `npm run build` (membuat file jadi di `public/build/`).
- **`Procfile`** — Perintah standar untuk menjalankan server PHP saat project di-deploy ke layanan hosting tertentu (`web: php artisan serve --host=0.0.0.0 --port=$PORT`).
