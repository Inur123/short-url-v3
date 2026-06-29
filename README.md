# Short URL v3 🚀

Aplikasi penyingkat URL (URL Shortener) premium, minimalis, dan aman yang dibangun dengan ekosistem modern Laravel, React, Inertia.js, dan Tailwind CSS.

---

## ✨ Fitur Utama

- Sistem masuk admin yang sangat cepat, murni hanya membutuhkan input **Password** tanpa input email sama sekali karena sistem didesain khusus untuk kepemilikan admin tunggal.
- Desain antarmuka Login premium dengan toggle view password yang halus.

### 2. ⚡ Keamanan Berlapis (Anti-SQLi & Anti-Spam)

- **Input Sanitizer Real-time**: Input password secara otomatis mendeteksi dan menghapus karakter berbahaya (`'`, `"`, `;`, `\`, `-`) secara instan saat pengguna mengetik untuk mencegah serangan SQL Injection dan karakter aneh.
- **Anti-Spam Rate Limiting**: Membatasi percobaan login sebanyak maksimal 5 kali per menit.
- **Custom 429 Redirection**: Menghindari halaman error default Laravel yang mengganggu. Pengguna yang terkena limitasi rate-limit akan tetap berada di halaman login dengan notifikasi hitung mundur (countdown) menit dan detik serta status tombol dinonaktifkan (disabled).

### 3. 📊 Dashboard Kontrol Premium

- **Statistik Ringkas**: Pemantauan langsung (real-time) total link yang dibuat, akumulasi jumlah klik, dan jumlah link aktif.
- **CRUD Link Cepat**: Membuat short link baru dengan opsional judul kustom, alias custom slug (custom alias), tanggal kedaluwarsa, dan status aktif.
- **Pemberitahuan Sonner Toast**: Toast notifikasi yang elegan di pojok kanan atas lengkap dengan tombol close `X` untuk aksi salin link, logout, hapus link, simpan baru, dan ubah status.
- **Pointer Interaktif**: Seluruh tombol, switch toggle, card, dan link di dashboard didesain dengan kursor pointer (`cursor-pointer`) untuk pengalaman navigasi yang intuitif.

### 4. 🖼️ QR Code Generator & Downloader HD dengan Logo

- **Visual QR Code**: Menampilkan popup modal QR Code dinamis saat tombol QR diklik.
- **Transparansi Logo**: Logo kustom `/logo.png` transparan ditempatkan secara presisi di tengah-tengah QR Code dengan white margin box pelindung yang cantik.
- **Error Correction Level H (High)**: QR Code dijamin 100% tetap mudah dipindai oleh kamera HP meskipun ditumpuk logo di tengahnya.
- **Unduh HD Kualitas Tinggi**: Men-download QR Code dalam format PNG resolusi tinggi (**1160x1160 px**) dengan margin luar putih selebar 80px agar rapi, tajam, dan siap dicetak/disebarkan.
- **Loading Animate**: Animasi memutar (spin loader) yang halus saat gambar QR Code pertama kali dimuat.

---

## 🛠️ Tech Stack

- **Framework**: Laravel (v13.x)
- **Frontend**: React + Inertia.js
- **Database**: MySQL
- **Environment**: Developed locally on macOS

---

## 📦 Panduan Instalasi Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi di komputer lokal Anda:

### 1. Klon Repositori & Masuk ke Direktori

```bash
git clone <repository-url>
cd short-url-v3
```

### 2. Instalasi Dependensi PHP

```bash
composer install
```

### 3. Instalasi Dependensi Node.js

```bash
npm install
```

### 4. Konfigurasi Environment File

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Sesuaikan konfigurasi database Anda di dalam file `.env` (SQLite secara default atau MySQL).

### 5. Generate Application Key

```bash
php artisan key:generate
```

### 6. Jalankan Migrasi Database & Seeder

Buat tabel-tabel database beserta akun admin default:

```bash
php artisan migrate --seed
```

> Kredensial Masuk Admin:
>
> - **Password Default**: `password` (Silakan langsung masuk dan ubah di menu Pengaturan Keamanan)

### 7. Jalankan Server Development

Jalankan server PHP Laravel:

```bash
php artisan serve
```

Di terminal terpisah, jalankan bundel Vite untuk memantau perubahan frontend:

```bash
npm run dev
```

Aplikasi kini dapat diakses melalui browser Anda di alamat: `http://localhost:8000`.

---

## 🚀 Membangun untuk Produksi (Production Build)

Untuk melakukan kompilasi aset frontend menjadi berkas statis siap pakai di server produksi:

```bash
npm run build
```

Aset yang terkompilasi akan disimpan di direktori `public/build/`.

---

## 📄 Lisensi

Proyek ini bersifat open-source dan berada di bawah naungan lisensi [MIT License](LICENSE).
