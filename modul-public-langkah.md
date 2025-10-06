# Tujuan singkat

* Semua halaman publik di-drive dari **data terstruktur** (bukan hardcoded).
* Admin bisa **atur konten, media, urutan section, SEO**, dan **jadwal tayang** tanpa sentuh kode.
* **Satu sumber kebenaran** untuk header/footer (`settings`) supaya konsisten di seluruh halaman.

# Peran & workflow

* **Author**: buat draft (Berita/Agenda/Program/Galeri).
* **Editor**: review, ubah status → *Scheduled* / *Published* / *Archived*.
* **Admin**: ubah navigasi, brand, hero beranda, blok konten, redirect.
* Semua konten punya **riwayat** (versioning minimal: last 10 changes) + **Preview** (tokenized link).

# Pola global (disarankan)

* **Settings** (dibaca `PublicLayout.tsx`): identitas sekolah, alamat, WA, logo, warna, OG image, menu order.
* **Media**: tiap halaman/tipe konten punya **collection** (hero, cover, gallery, logo). Validasi rasio & ukuran, alt text wajib.
* **SEO**: setiap entitas punya meta title, description, OG image (fallback ke global), canonical (opsional).
* **Status**: `draft | scheduled | published | archived` + `published_at`.
* **Slug & redirect**: ubah slug otomatis simpan ke **redirects** (301).

---

# Manajemen per halaman

## 1) Beranda (`/`)

**Admin → Konten → Beranda**

* **Hero**: title, subtitle, **media hero** (image/video), CTA1(label, url), CTA2.
* **Highlights (4 blok)**: ikon (pilih dari library), judul, deskripsi, link. (drag & drop urutan)
* **Berita Terbaru**: mode **otomatis** (N item terakhir) atau **manual pin** (pilih 1 headline + 3 kartu kecil).
* **Agenda Terdekat**: otomatis (N event terdekat) dengan batas hari; opsi tampilkan **mini calendar**.
* **Galeri/Prestasi**: pilih **album** (otomatis) atau **manual** (pilih 6–9 media).
* **Stats**: angka siswa/guru/akreditasi/dokumentasi.
* **Testimoni**: daftar kutipan (nama, peran, avatar).
* **SEO**: judul, deskripsi, OG.
* **Tombol “Reset ke default”** per blok.

> UI: satu halaman dengan **section cards** (Hero, Highlights, News, Agenda, Gallery, Stats, Testimonials). Masing-masing collapsible + reorder.

## 2) Profil (`/profil`)

**Admin → Konten → Profil**

* **Hero** (opsional).
* **Body**: editor rich text terbatas (H2/H3, list, quote, tabel sederhana).
* **Lampiran** (PDF brosur, struktur organisasi).
* **Sidebar**: “Tautan terkait/Unduhan”.
* **SEO**.

> Validasi: maksimal 3 level heading, link checker ke file/URL internal.

## 3) Visi & Misi (`/visi-misi`)

**Admin → Konten → Visi & Misi**

* **Hero** (opsional).
* **Visi** (teks pendek).
* **Misi** (array bullet, drag & drop).
* **Nilai/Tagline** (opsional, 3–6 chips dengan ikon).
* **SEO**.

> Editor khusus misi: input baris-per-baris, bukan rich text (agar konsisten di frontend).

## 4) Direktori Program Vokasional (`/vokasional`)

**Admin → Akademik → Program**

* **List view**: cari, filter status/kategori, bulk publish/archive, **reorder “featured”**.
* **Form Program (detail page)**:

  * Umum: judul, slug, kategori/kompetensi, **cover**, ringkasan 1–2 paragraf.
  * **Kurikulum** (array poin), **Fasilitas** (array), **Galeri** (multi upload), **Contact person** (nama, telp/WA).
  * **CTA**: label + url (mis. form pendaftaran).
  * **SEO**, status, schedule.
* **Filter publik** (di halaman katalog): kelola daftar filter (kompetensi, jenjang) dari admin.

> Tambahan: tombol **Duplikat Program** untuk entri serupa.

## 5) Berita (`/berita`)

**Admin → Konten → Berita**

* **List view**: tabel dengan thumbnail, judul, kategori, tanggal, status, **hitungan baca**.
* **Form Berita**:

  * Judul, slug, **cover**, kategori, **tags[]**, excerpt, **body** (TipTap/Markdown terkurasi).
  * **Related posts**: otomatis by tag atau manual pilih 3.
  * **Sticky highlight** (muncul di Beranda/daftar).
  * SEO, status, schedule.
* **Kualitas**: auto **reading time**, **table of contents** (dari H2/H3).
* **AMP (opsional)**: switch generate view minimalis.

## 6) Agenda (`/agenda`)

**Admin → Kegiatan → Agenda**

* **List**: view kalender & tabel.
* **Form Event**:

  * Judul, slug, **start/end (tanggal & jam, zona waktu)**, lokasi (on-site/online + url meeting), kategori, **cover** (opsional).
  * **Deskripsi**, **CTA pendaftaran** (url/Google Form).
  * **Recurrence** (RRULE sederhana: mingguan/bulanan), **capacity** (opsional).
  * SEO, status, schedule.
* Otomatis **ICS export** + tombol “Tambah ke Google Calendar”.

## 7) Galeri (`/galeri`)

**Admin → Media → Galeri**

* **Album**: judul, slug, deskripsi singkat, **cover**.
* **Item**: multi-upload (drag & drop), **alt text wajib**, **reorder**.
* **Tipe**: gambar atau video (URL YouTube/Vimeo/file MP4).
* **Status** album, tanggal publikasi.
* **Album featured** untuk muncul di Beranda.

## 8) Hubungi Kami (`/hubungi-kami`)

**Admin → Situs → Hubungi Kami**

* **Kontak**: alamat, telp, WA, email, embed map (url), jam layanan (array).
* **Form**: aktif/nonaktif, tujuan email penerima, **auto-reply template**, reCAPTCHA/honeypot.
* **Inbox**: daftar pesan masuk, status (*open/in-progress/closed*), **label** (umum/PPDB/aduan), export CSV.

---

# Fitur lintas-halaman (penting)

* **Preview**: tombol “Lihat” membuka route publik dengan query token (bypass auth) + banner “Preview”.
* **Versioning**: simpan snapshot JSON konten setiap simpan; **Rollback** 1 klik.
* **Schedule & Unpublish**: jadwal mulai & akhir tayang (events & banner).
* **Banner pengumuman global** (emergency/PPDB) di settings dengan waktu mulai/berakhir.
* **Aksesibilitas lint**: checker alt kosong, kontras, heading skip; tampilkan peringatan sebelum publish.
* **Image pipeline**: resize + WebP/AVIF, crop preset (Hero 16:9, Card 4:3, Avatar 1:1).
* **SEO helper**: counter 50–60 char (title) & 140–160 (description), live preview OG.
* **Redirects**: tabel sederhana (from → to, 301/302).
* **Cache & invalidasi**: flush page cache on publish/update (Home, listing, detail).

---

# Navigasi & konsistensi `PublicLayout.tsx`

* Inject `settings` (logo, nama, warna, WA, menu order) lewat **middleware** atau composer ke semua response Inertia → `PublicLayout` tidak perlu fetch ulang.
* **Menu order** editable: daftar `{ href, label, icon, visible, sort }`. Toggle “visible” untuk sembunyikan.
* **Footer** juga dari `settings`: alamat, email, telp, jam layanan, link cepat (array).

---

# UX list view (Admin)

* Semua modul list: **search cepat**, filter status/kategori/tanggal, **bulk action** (publish/archive/delete), **kolom bisa diurutkan**, ekspor CSV.
* **Empty state** ramah (ikon + CTA “Tambah …”).
* **Toasts** untuk sukses/error, dan **guard** “Anda punya perubahan belum disimpan”.

---

# Validasi ringkas (server & client)

* **Slug unik** per tipe.
* **Cover/Hero**: min width (mis. 1600px), max size (mis. 2–3 MB), tipe mime.
* **Agenda**: `end ≥ start`, timezone wajib, kalau *online* wajib url meeting.
* **Galeri**: alt wajib, maksimal N item per upload (batasi 20–30 sekali unggah).
* **Berita**: excerpt 140–200 karakter; TOC auto dari H2/H3.

---

# Analitik & umpan balik

* Event GA4/Plausible: klik CTA PPDB, submit form kontak, klik WA, cari di direktori program.
* Pencarian internal dicatat (query, timestamp) → insight konten.
* Widget “Ada yang kurang?” (yes/no + komentar) per halaman profil/visi.

---

# Testing & rilis (tambahan)

* **Smoke test** sitemaps, robots, schema JSON-LD (School/Article/Event/BreadcrumbList).
* **Link checker** (internal) mingguan.
* **Image weight** audit: kartu daftar < 120 KB, hero < 300 KB (WebP).
* **E2E** skenario utama: publish berita, ubah hero beranda, tambah event berulang, upload album 20 foto, kirim form kontak.

---