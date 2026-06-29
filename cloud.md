# Cloud Deployment Guide - Short URL v3

Dokumen ini berisi panduan untuk mendeploy aplikasi **Short URL v3** ke cloud provider. Karena aplikasi ini menggunakan **Laravel + Inertia + React**, berikut adalah opsi deployment yang direkomendasikan:

## Opsi 1: VPS (Ubuntu / Debian) menggunakan Laravel Forge atau Setup Manual

Jika menggunakan VPS biasa (DigitalOcean Droplet, AWS EC2, Linode, dll.):

### 1. Prasyarat Server
- PHP >= 8.3 dengan ekstensi yang diperlukan (BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML, dll.)
- MySQL atau PostgreSQL Database
- Nginx / Apache
- Node.js & NPM (untuk build React assets)
- Composer

### 2. Langkah Deployment Manual
1. **Clone repositori** ke server:
   ```bash
   git clone <repository-url> /var/www/short-url
   ```
2. **Install dependensi**:
   ```bash
   composer install --no-dev --optimize-autoloader
   npm install
   ```
3. **Konfigurasi Environment**:
   Salin `.env.example` ke `.env` dan sesuaikan konfigurasinya (database, app key, APP_URL, dll.).
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. **Build Assets Frontend**:
   ```bash
   npm run build
   ```
5. **Jalankan Migrasi Database**:
   ```bash
   php artisan migrate --force
   ```
6. **Optimasi Laravel**:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

---

## Opsi 2: Serverless (Laravel Vapor)

Laravel Vapor adalah platform deployment serverless berbasis AWS yang sangat cocok untuk Laravel.

1. Install Vapor CLI secara global atau di proyek:
   ```bash
   composer require laravel/vapor-cli --dev
   ```
2. Inisialisasi Vapor:
   ```bash
   php artisan vapor:init
   ```
3. Sesuaikan konfigurasi di `vapor.yml`.
4. Deploy dengan perintah:
   ```bash
   vapor deploy production
   ```

---

## Opsi 3: PaaS (Fly.io / Render / Railway)

Fly.io atau Railway sangat mudah digunakan untuk mendistribusikan aplikasi berbasis Docker/Laravel.

### Contoh menggunakan Fly.io:
1. Jalankan inisialisasi Fly:
   ```bash
   fly launch
   ```
2. Fly.io akan mendeteksi aplikasi Laravel secara otomatis dan membuat `Dockerfile` serta file `fly.toml`.
3. Jalankan deploy:
   ```bash
   fly deploy
   ```
