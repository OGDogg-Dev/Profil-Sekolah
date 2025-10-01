# Profil Sekolah Inklusif

## Gambaran Umum
Profil-Sekolah adalah platform profil sekolah vokasional berbasis Laravel dan Inertia. Aplikasi ini menampilkan informasi publik mengenai program vokasi inklusif sekaligus menyediakan panel admin untuk mengelola konten seperti halaman profil, berita, agenda, galeri, dan pesan pengunjung.

## Fitur Utama
- Portal publik dengan halaman beranda, profil sekolah, visi misi, daftar program vokasional, berita, agenda, galeri foto, dan formulir kontak.
- Pengelolaan konten dinamis untuk halaman statis, berita, agenda, album galeri, dan program vokasional melalui dashboard admin.
- Manajemen media untuk mengunggah sampul dan item galeri menggunakan modul `media` dan `album media`.
- Kotak masuk pesan dari formulir hubungi kami lengkap dengan status baca dan catatan tindak lanjut.
- Pengaturan identitas situs (nama sekolah, tagline, logo) langsung dari panel admin.
- Autentikasi Laravel Fortify dengan fitur verifikasi email, reset password, dan dukungan two-factor authentication.

## Teknologi
- Backend: Laravel 12, PHP 8.2+, Inertia.js, Laravel Fortify, Laravel Wayfinder.
- Frontend: React 19 dengan TypeScript, Tailwind CSS 4, Radix UI, Vite, dan komponen aksesibilitas kustom.
- Database: SQLite secara bawaan (dapat diganti MySQL/PostgreSQL), queue driver database, storage lokal untuk media.

## Arsitektur Aplikasi
### Backend (Laravel)
Routing publik dan admin berada di `routes/web.php` dengan middleware `admin` untuk membatasi akses dashboard. Setiap entitas utama memiliki controller di `app/Http/Controllers`, model Eloquent di `app/Models`, migrasi skema pada `database/migrations`, serta seeder konten demo di `database/seeders`. Middleware `AdminOnly` memastikan hanya pengguna dengan atribut `is_admin` yang dapat mengelola konten.

### Frontend (React + Inertia)
Halaman dirender melalui Inertia dan tersimpan di `resources/js/pages`. Halaman publik (`public`, `news`, `vocational`) memanfaatkan komponen antarmuka di `resources/js/components` untuk hero, grid program, daftar berita, agenda, dan galeri. Panel admin (`resources/js/pages/admin`) menggunakan layout modular (`admin/_layout`) lengkap dengan sidebar, breadcrumbs, dan form pengelolaan data. File `resources/js/routes` dihasilkan oleh Laravel Wayfinder untuk memetakankan rute sisi klien.

## Persyaratan Sistem
- PHP 8.2 atau lebih baru dengan ekstensi BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML.
- Composer 2.x.
- Node.js 20.x dan npm 10.x.
- SQLite 3 (bawaan) atau server database lain sesuai konfigurasi `.env`.

## Instalasi dari Git Clone
1. Clone repositori: `git clone https://github.com/<username>/Profil-Sekolah.git`.
2. Masuk ke folder proyek: `cd Profil-Sekolah`.
3. Pasang dependensi PHP: `composer install`.
4. Pasang dependensi frontend: `npm install`.
5. Salin berkas lingkungan: `cp .env.example .env` (Windows PowerShell: `Copy-Item .env.example .env`).
6. Konfigurasi variabel `.env` seperti `APP_NAME`, `APP_URL`, dan pengaturan database.
7. Buat file database SQLite jika mengikuti konfigurasi bawaan (`type NUL > database\database.sqlite` di Windows, `touch database/database.sqlite` di Mac/Linux).
8. Generate app key: `php artisan key:generate`.
9. Jalankan migrasi dan seeder demo: `php artisan migrate --seed`.
10. Opsional: siapkan symlink storage jika perlu menampilkan media terunggah: `php artisan storage:link`.

## Menjalankan Aplikasi
Gunakan dua terminal terpisah atau jalankan skrip gabungan:

```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev

# Alternatif satu perintah
composer run dev
```

Aplikasi akan tersedia di `http://127.0.0.1:8000` (atau sesuai `APP_URL`). Vite dev server melayani asset frontend dengan hot reload.

## Data Demo dan Kredensial
Seeder `AdminUserSeeder` membuat akun admin bawaan:

- Email: `admin@example.com`
- Password: `password`

Seeder `DemoContentSeeder` mengisi halaman profil, visi misi, program vokasional, berita, agenda, album galeri, dan media contoh agar portal langsung terisi.

## Testing
Jalankan suite pengujian Laravel dan Pest melalui:

```bash
composer test
```

Perintah di atas akan membersihkan cache konfigurasi lebih dahulu sebelum menjalankan pengujian.

## Struktur Direktori Penting
- `app/Models` berisi representasi data seperti `Post`, `Event`, `Album`, `VocationalProgram`, `SiteSetting`.
- `app/Http/Controllers/Public` menangani rute portal publik (beranda, berita, agenda, galeri, kontak).
- `app/Http/Controllers/Admin` menyediakan CRUD untuk konten dan pengaturan situs.
- `resources/js/pages/public` dan `resources/js/pages/news` menyusun halaman yang dilihat pengunjung.
- `resources/js/pages/admin` memuat layar dashboard, form konten, serta pengelolaan media.
- `database/seeders` menyiapkan akun admin dan data dummy untuk kebutuhan demo.

## Catatan Pengembangan
Aktifkan throttle pada formulir kontak (`throttle:60,1`) untuk mencegah spam, kelola antrean jika menambahkan job asynchronous, dan gunakan `php artisan optimize:clear` saat memperbarui dependensi. Saat deploy produksi, ubah driver email dan storage sesuai infrastruktur serta perbarui kredensial admin bawaan.

