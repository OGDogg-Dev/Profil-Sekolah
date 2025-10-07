# Profil Sekolah

Platform **profil sekolah** berbasis **Laravel + Inertia (React + TS)** untuk menampilkan informasi publik (beranda, profil, visi–misi, program, berita, agenda, galeri, kontak) sekaligus **dashboard admin** untuk mengelola seluruh konten dan media.

---

## Daftar Isi

* [Fitur Utama](#fitur-utama)
* [Teknologi](#teknologi)
* [Arsitektur Aplikasi](#arsitektur-aplikasi)
* [Persyaratan Sistem](#persyaratan-sistem)
* [Instalasi & Menjalankan (Development)](#instalasi--menjalankan-development)
* [Konfigurasi Lingkungan (`.env`)](#konfigurasi-lingkungan-env)
* [Data Demo & Kredensial](#data-demo--kredensial)
* [Struktur Direktori](#struktur-direktori)
* [Pengelolaan Halaman Publik (Admin-Driven)](#pengelolaan-halaman-publik-admin-driven)
* [Media Pipeline (Upload Gambar/Video)](#media-pipeline-upload-gambarvideo)
* [Aksesibilitas, SEO & Performa](#aksesibilitas-seo--performa)
* [Testing](#testing)
* [Build & Deploy Produksi](#build--deploy-produksi)
* [Troubleshooting](#troubleshooting)
* [Roadmap Singkat](#roadmap-singkat)
* [Lisensi](#lisensi)

---

## Fitur Utama

* **Portal publik**: Beranda, Profil Sekolah, Visi–Misi, Direktori Program Vokasional, Berita, Agenda, Galeri, Hubungi Kami.
* **Dashboard Admin**: kelola halaman statis, berita, agenda, program, album galeri, dan pesan pengunjung.
* **Manajemen Media**: upload **logo/hero/cover/galeri** (rasio & ukuran tervalidasi), album foto, alt text.
* **Kotak Masuk**: pesan dari “Hubungi Kami” dengan status baca & catatan tindak lanjut.
* **Pengaturan Situs**: nama sekolah, tagline, logo, kontak, jam layanan, sosial, OG image (fallback SEO).
* **Autentikasi**: Laravel Fortify (email verification, reset password, 2FA).
* **Inertia Shared Settings**: header/footer konsisten di semua halaman via `PublicLayout`.

---

## Teknologi

**Backend**: Laravel 12 (PHP 8.2+), Inertia.js, Fortify, Wayfinder
**Frontend**: React 19 (TypeScript), Tailwind CSS 4, Radix UI, Vite
**Database**: SQLite (default) / MySQL / PostgreSQL
**Storage**: Filesystem `public` (symlink `storage`)
**Queue**: Database driver (default)

---

## Arsitektur Aplikasi

### Backend (Laravel)

* Rute publik & admin: `routes/web.php` (middleware `admin` untuk dashboard).
* Controller: `app/Http/Controllers/Public/*` dan `app/Http/Controllers/Admin/*`.
* Model: `app/Models/*`, Migrasi: `database/migrations`, Seeder: `database/seeders`.
* Middleware `AdminOnly` memastikan hanya `is_admin=true` yang bisa mengelola konten.

### Frontend (React + Inertia)

* Halaman Inertia: `resources/js/pages/*` (publik: `public`, `news`, `vocational`; admin: `admin/*`).
* Layout admin: `resources/js/pages/admin/_layout/*`.
* **Layout publik tunggal**: `PublicLayout.tsx` (header, footer, meta) — **pastikan semua halaman publik memakainya** (lihat tips di bawah).
* Rute sisi-klien dihasilkan oleh **Laravel Wayfinder** ke `resources/js/routes`.

> **Tips**: Set “default layout” di `resources/js/app.tsx` agar semua halaman publik otomatis memakai `PublicLayout` dan admin memakai `AdminLayout` jika halaman belum mendeklarasikan `.layout`.

---

## Persyaratan Sistem

* **PHP** 8.2+ dengan ekstensi: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML
* **Composer** 2.x
* **Node.js** 20.x dan **npm** 10.x
* **Database**: SQLite 3 (default) / MySQL / PostgreSQL

---

## Instalasi & Menjalankan (Development)

```bash
# 1) Clone
git clone https://github.com/OGDogg-Dev/Profil-Sekolah.git
cd Profil-Sekolah

# 2) Install dependencies
composer install
npm install

# 3) Konfigurasi .env
cp .env.example .env
# - Set APP_NAME, APP_URL
# - Pilih DB (SQLite/MySQL/Postgres)
# - Mailer (untuk reset/verify email di Fortify)

# 4) Siapkan database
# SQLite (default)
touch database/database.sqlite

# 5) Kunci aplikasi & migrasi + seeder demo
php artisan key:generate
php artisan migrate --seed

# 6) Symlink storage (untuk akses file upload)
php artisan storage:link

# 7) Jalankan dev server
php artisan serve         # http://127.0.0.1:8000
npm run dev               # Vite dev server
# atau sekali jalan:
composer run dev
```

**Login Admin (default demo):**

* Email: `admin@example.com`
* Password: `password`

---

## Konfigurasi Lingkungan (`.env`)

Contoh pengaturan penting:

```dotenv
APP_NAME="Profil Sekolah"
APP_ENV=local
APP_URL=http://127.0.0.1:8000
APP_KEY=base64:... # dihasilkan oleh artisan key:generate

LOG_CHANNEL=stack
LOG_LEVEL=debug

# Database (SQLite default)
DB_CONNECTION=sqlite
DB_DATABASE=/full/path/ke/database/database.sqlite

# Jika MySQL
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=profil_sekolah
# DB_USERNAME=root
# DB_PASSWORD=secret

# Queue & cache
QUEUE_CONNECTION=database
CACHE_DRIVER=file
SESSION_DRIVER=file

# Filesystem
FILESYSTEM_DISK=public

# Mail (untuk Fortify)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=xxxx
MAIL_PASSWORD=xxxx
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=no-reply@example.com
MAIL_FROM_NAME="${APP_NAME}"
```

---

## Data Demo & Kredensial

Seeder akan membuat:

* **Akun Admin**: `admin@example.com` / `password`
* **Konten demo**: profil, visi–misi, program vokasional, berita, agenda, album galeri, media contoh.

Jalankan ulang kapan saja:

```bash
php artisan migrate:fresh --seed
php artisan storage:link
```

---

## Struktur Direktori

```
app/
  Http/
    Controllers/
      Admin/        # CRUD admin
      Public/       # Rute publik
  Models/           # Post, Event, Album, VocationalProgram, SiteSetting, dll.

resources/
  js/
    pages/
      public/       # Halaman publik
      news/         # Berita (list/detail)
      vocational/   # Program vokasional (list/detail)
      admin/        # Dashboard, form konten, media
    components/     # Komponen UI
    routes/         # Generated by Wayfinder
  css/              # Tailwind entry

database/
  migrations/       # Skema DB
  seeders/          # AdminUserSeeder, DemoContentSeeder
```

---

## Pengelolaan Halaman Publik (Admin-Driven)

Semua halaman publik **dikelola dari admin**. Matriks ringkas:

| Halaman               | Konten                                                                                                                                      | Media                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **Beranda**           | Hero (judul/subjudul/CTA/overlay), Highlights (4), Berita (auto/manual pin), Agenda limit, Galeri/Prestasi (album/manual), Stats, Testimoni | `hero`, ikon highlight (SVG/PNG), avatar testimoni   |
| **Profil**            | Body (rich text), tautan & unduhan                                                                                                          | `hero`, PDF (brosur/struktur)                        |
| **Visi–Misi**         | Visi (teks), Misi (array drag–drop), Nilai/Tagline                                                                                          | `hero`                                               |
| **Direktori Program** | Filter/featured order                                                                                                                       | — (ambil dari program)                               |
| **Program Detail**    | Ringkasan, Kurikulum[], Fasilitas[], CP/CTA, SEO                                                                                            | `cover`, `gallery[]` (alt wajib), dokumen            |
| **Berita**            | Kategori, Tags, Excerpt, Body, Related (auto/manual), Sticky, SEO, `published_at`                                                           | `cover` (+ OG override opsional)                     |
| **Agenda**            | Start/End+TZ, Lokasi, Recurrence, Deskripsi, CTA, SEO                                                                                       | `cover` (opsional), ICS                              |
| **Galeri**            | Album (judul, deskripsi, status) + items                                                                                                    | `cover` album, `items[]` (gambar/video; alt/caption) |
| **Hubungi Kami**      | Alamat, WA/Telepon, Email, Jam layanan, Map embed, Auto-reply, Inbox label/status                                                           | Logo (global), foto kantor (opsional)                |

> **Konsistensi Layout**: Pastikan semua halaman publik **dibungkus `PublicLayout.tsx`**. Cara cepat: set **default layout** di bootstrap Inertia (`resources/js/app.tsx`) sehingga halaman publik otomatis memakai `PublicLayout` jika belum mendeklarasikan `.layout`.

---

## Media Pipeline (Upload Gambar/Video)

**Koleksi Media** per entitas:

* `logo` (global), `hero` (halaman), `cover` (post/event/program/album), `gallery` (multi), `og` (override).

**Rasio & Ukuran Rekomendasi**

* **Hero**: 16:9, minimal **1600×900**, ≤ **3 MB** (jpg/png/webp).
* **Cover**: 16:9 (list/detail), minimal **1200×675**, ≤ **3 MB**.
* **Galeri**: gambar jpg/png/webp ≤ **3 MB**; video **mp4** ≤ **5 MB**.
* **Avatar**: 1:1, minimal 256×256.

**Best Practice**

* Simpan **alt text** untuk semua gambar non-dekoratif.
* Jika tersedia, simpan **focal point** (x,y) agar cropping tidak memotong objek penting.
* Hapus file lama untuk koleksi “singleton” (logo/hero/cover) saat diganti.
* Generate varian (opsional): `hero`/`card`/`thumb` + **WebP/AVIF**, gunakan `srcset` di FE.

---

## Aksesibilitas, SEO & Performa

* **A11y**: kontras WCAG AA, fokus ring tampak, landmark ARIA (`header/nav/main/footer`), heading berurutan, semua tombol/link dapat dijangkau keyboard.
* **SEO**: `<Head>` dinamis (title/description), OpenGraph/Twitter Card, **JSON-LD**:

  * Home → `School`, Post → `Article`, Event → `Event`, Detail → `BreadcrumbList`
  * **OG fallback** dari pengaturan global.
* **Performa**: lazy-load gambar, gunakan `srcset`, prefetch daftar→detail, kompresi WebP/AVIF, split chunk Vite, HTTP caching untuk aset.
* **Keamanan**: sanitasi WYSIWYG, rate-limit + honeypot/Recaptcha pada form publik.

---

## Testing

Jalankan semua pengujian:

```bash
composer test
```

Tips:

* Gunakan **database in-memory**/SQLite khusus test.
* Tambahkan pengujian untuk: upload media, validasi dimensi, schedule publish, redirect slug, JSON-LD hadir di detail.

---

## Build & Deploy Produksi

**Build aset & optimasi:**

```bash
npm run build
php artisan optimize
```

**Storage & cache:**

```bash
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Queue (opsional):**

```bash
php artisan queue:table
php artisan migrate
php artisan queue:work --tries=3
```

**Nginx (contoh ringkas):**

```nginx
server {
  server_name example.com;
  root /var/www/profil-sekolah/public;

  index index.php;
  location / {
    try_files $uri $uri/ /index.php?$query_string;
  }

  location ~ \.php$ {
    include fastcgi_params;
    fastcgi_pass unix:/run/php/php8.2-fpm.sock;
    fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
  }

  client_max_body_size 10M; # untuk upload
}
```

**Env Produksi**: set `APP_ENV=production`, `APP_DEBUG=false`, konfigurasi mailer, database, storage (S3/CDN jika diperlukan).

---

## Troubleshooting

* **Gambar tidak tampil** → pastikan `php artisan storage:link` & path filesystem `public`.
* **Slug lama 404** → aktifkan fitur redirect (from→to) saat slug diubah.
* **Email tidak terkirim** → cek `MAIL_*` & log mailer.
* **Ukuran gambar ditolak** → cek validator dimensi & MIME; ikuti panduan rasio/ukuran.
* **Layout publik tidak konsisten** → pastikan default `PublicLayout` diterapkan di `app.tsx` dan `settings` dibagikan via Inertia share.

---

## Roadmap Singkat

* **Home Builder** (reorder/toggle sections, pin konten)
* **Redirects** saat slug berubah (301/302)
* **ICS Export** untuk Agenda + tombol “Tambah ke Google Calendar”
* **Focal point** & varian gambar otomatis (hero/card/thumb)
* **Page versioning** & rollback di admin
* **Pencarian global** (Cmd/Ctrl+K) & analitik pencarian internal

---

## Lisensi

Lihat berkas **`LICENSE`** (jika ada) di repositori ini.
© 2025 — Profil Sekolah Inklusif. Gunakan sesuai kebutuhan dan perbarui lisensi bila diperlukan.

---
