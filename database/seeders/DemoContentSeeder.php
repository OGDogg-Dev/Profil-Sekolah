<?php

namespace Database\Seeders;

use App\Models\Album;
use App\Models\AlbumMedia;
use App\Models\ContactMessage;
use App\Models\Event;
use App\Models\MediaAsset;
use App\Models\MediaItem;
use App\Models\Page;
use App\Models\Post;
use App\Models\SiteSetting;
use App\Models\VocationalProgram;
use Illuminate\Support\Arr;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class DemoContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedSiteSettings();

        Page::updateOrCreate(
            ['slug' => 'profil'],
            [
                'title' => 'Profil Sekolah',
                'content' => '<p>Vokasional Disabilitas menghadirkan pelatihan keterampilan yang ramah akses bagi penyandang disabilitas. Kurikulum kami dirancang bersama praktisi industri, mentor disabilitas, serta pendamping psikososial agar setiap peserta mendapatkan dukungan personal, lingkungan aman, dan jalur karier yang jelas.</p><p>Kami menyediakan ruang belajar adaptif, alat bantu komunikasi, dan metode asesmen diferensiasi sehingga peserta dapat berkembang sesuai potensi. Mitra kerja dan komunitas kewirausahaan siap mendampingi lulusan untuk magang maupun memulai usaha mandiri.</p>',
            ],
        );

        Page::updateOrCreate(
            ['slug' => 'visi-misi'],
            [
                'title' => 'Visi & Misi',
                'content' => '<h3>Visi</h3><p>Menjadi ekosistem vokasional inklusif yang menumbuhkan kemandirian dan daya saing penyandang disabilitas di dunia kerja.</p><h3>Misi</h3><ul><li>Menyelenggarakan pelatihan praktis dengan teknologi adaptif.</li><li>Membangun budaya saling dukung antara peserta, mentor, dan industri.</li><li>Menyediakan layanan pendampingan karier dan kewirausahaan yang berkelanjutan.</li><li>Mengedepankan aksesibilitas universal pada setiap fasilitas dan materi belajar.</li></ul>',
            ],
        );

        $this->seedPrograms();
        $this->seedPosts();
        $this->seedEvents();
        $this->seedAlbums();
        $this->seedContactMessages();
    }

    private function seedSiteSettings(): void
    {
        $this->setSettings('general', [
            'site_name' => 'Vokasional Disabilitas',
            'tagline' => 'Pelatihan vokasi inklusif - belajar, berkarya, berdaya',
            'address' => 'Jl. Rampa Akses 01, Surakarta',
            'phone' => '+62-812-0000-0000',
            'email' => 'halo@sekolahinklusi.sch.id',
            'footer_hours' => "Sen-Jum: 07.00-15.00\nSab: 08.00-12.00\nMin & Libur: Tutup",
        ]);

        $this->setSettings('home', [
            'hero_eyebrow' => 'Sekolah Inklusif - Ramah Disabilitas',
            'hero_title' => 'Setiap Anak Berhak Tumbuh & Berprestasi',
            'hero_description' => 'Lingkungan belajar yang aman, aksesibel, dan menyenangkan dengan dukungan guru pendamping, terapi, serta teknologi asistif.',
            'hero_primary_label' => 'Daftar PPDB',
            'hero_primary_link' => '/ppdb',
            'hero_secondary_label' => 'Hubungi Kami',
            'hero_secondary_link' => '/hubungi-kami',
            'highlights' => [
                ['title' => 'Program Unggulan', 'description' => 'Inklusi SD-SMA, terapi wicara dan okupasi, teknologi asistif & koding', 'href' => '/vokasional'],
                ['title' => 'Berita Terbaru', 'description' => 'Sorotan kegiatan dan prestasi siswa setiap pekan', 'href' => '/berita'],
                ['title' => 'Agenda', 'description' => 'Seminar orang tua, open house, dan perayaan inklusi nasional', 'href' => '/agenda'],
                ['title' => 'Galeri', 'description' => 'Fasilitas aksesibel dan dokumentasi kegiatan siswa', 'href' => '/galeri'],
            ],
            'stats' => [
                ['label' => 'Siswa', 'value' => '1.200+'],
                ['label' => 'Tenaga Pendidik', 'value' => '85'],
                ['label' => 'Akreditasi', 'value' => 'A'],
                ['label' => 'Dokumentasi', 'value' => '+500'],
            ],
            'news_title' => 'Berita Terbaru',
            'news_description' => 'Informasi terbaru tentang kegiatan dan prestasi sekolah.',
            'agenda_title' => 'Agenda Terdekat',
            'agenda_description' => 'Jadwal kegiatan sekolah dan komunitas inklusif.',
            'gallery_title' => 'Galeri / Prestasi',
            'gallery_description' => 'Dokumentasi kegiatan, fasilitas, dan karya siswa.',
            'testimonials_title' => 'Suara Mereka',
            'testimonials_items' => [
                ['quote' => 'Anak saya lebih percaya diri; guru pendamping sangat suportif dan programnya jelas.', 'name' => 'Ibu Sari', 'role' => 'Orang tua'],
                ['quote' => 'Lab komputer aksesibel membuat saya berani melanjutkan belajar koding.', 'name' => 'Rafi', 'role' => 'Alumni'],
            ],
        ]);

        $this->setSettings('profile', [
            'title' => 'Profil Sekolah',
            'content' => '<p>Konten profil belum tersedia.</p>',
        ]);

        $this->setSettings('vision', [
            'title' => 'Visi & Misi',
            'description' => 'Menjadi pusat vokasi inklusif yang memberdayakan peserta didik dengan berbagai kebutuhan khusus.',
            'vision' => 'Menjadi ekosistem vokasional inklusif yang menumbuhkan kemandirian dan daya saing penyandang disabilitas di dunia kerja.',
            'missions' => [
                'Menyelenggarakan pelatihan praktis dengan teknologi adaptif.',
                'Membangun budaya saling dukung antara peserta, mentor, dan industri.',
                'Menyediakan layanan pendampingan karier dan kewirausahaan yang berkelanjutan.',
                'Mengedepankan aksesibilitas universal pada setiap fasilitas dan materi belajar.',
            ],
        ]);

        $this->setSettings('contact', [
            'title' => 'Hubungi Kami',
            'description' => 'Kami siap membantu Anda mendapatkan informasi terbaru seputar program, fasilitas, dan layanan sekolah.',
            'map_embed' => null,
        ]);

        MediaAsset::updateOrCreate(
            // use existing allowed collection 'hero' to satisfy sqlite CHECK constraint
            ['collection' => 'hero', 'key' => 'hero'],
            [
                'disk' => 'public',
                'path' => 'public-content/home/hero-demo.jpg',
                'type' => 'image',
                'alt' => 'Peserta vokasional berkolaborasi di ruang kelas',
            ],
        );
    }

    private function setSettings(string $section, array $values): void
    {
        foreach ($values as $key => $value) {
            SiteSetting::updateOrCreate(
                ['section' => $section, 'key' => $key],
                [
                    // store normalized value as JSON in `value_json`
                    'value_json' => is_array($value) ? $value : (string) $value,
                ],
            );
        }
    }

    private function seedPrograms(): void
    {
        $programs = [
            [
                'slug' => 'komputer',
                'title' => 'Vokasional Komputer',
                'description' => 'Belajar instalasi, perakitan, dan pemeliharaan komputer serta dasar pengembangan aplikasi mudah diakses.',
                'audience' => 'Penyandang disabilitas fisik dan sensorik yang berminat pada teknologi informasi.',
                'duration' => '6 bulan',
                'schedule' => 'Senin-Jumat, 08.00-12.00 WIB',
                'outcomes' => [
                    'Instalasi sistem operasi dan aplikasi adaptif.',
                    'Perakitan komputer dan troubleshooting dasar.',
                    'Pengenalan pengembangan web aksesibel.',
                ],
                'facilities' => [
                    'Laboratorium komputer dengan perangkat bantu layar.',
                    'Ruang konsultasi karier dan literasi digital.',
                ],
                'mentors' => ['Instruktur TI bersertifikasi', 'Praktisi aksesibilitas digital'],
            ],
            [
                'slug' => 'fotografi',
                'title' => 'Vokasional Fotografi',
                'description' => 'Pelatihan fotografi kreatif dengan studio adaptif dan pendampingan storytelling visual.',
                'audience' => 'Penyandang disabilitas netra low vision dan disabilitas rungu.',
                'duration' => '5 bulan',
                'schedule' => 'Selasa-Sabtu, 09.00-13.00 WIB',
                'outcomes' => [
                    'Teknik dasar pengambilan gambar dan komposisi.',
                    'Pengolahan foto dengan software aksesibel.',
                    'Produksi portofolio dan layanan dokumentasi acara.',
                ],
                'facilities' => [
                    'Studio foto dengan pencahayaan adaptif.',
                    'Peralatan kamera ringan dan tripod inklusif.',
                ],
                'mentors' => ['Fotografer profesional', 'Praktisi content creator inklusif'],
            ],
            [
                'slug' => 'bengkel-motor',
                'title' => 'Vokasional Bengkel Sepeda Motor',
                'description' => 'Mempelajari servis ringan hingga perawatan berkala sepeda motor dengan perangkat bantu ergonomis.',
                'audience' => 'Penyandang disabilitas daksa ringan dan tuli.',
                'duration' => '7 bulan',
                'schedule' => 'Senin-Jumat, 08.00-12.00 WIB',
                'outcomes' => [
                    'Pemeriksaan sistem kelistrikan dan injeksi.',
                    'Perawatan mesin dan bodi motor secara mandiri.',
                    'Standar layanan pelanggan bengkel inklusif.',
                ],
                'facilities' => [
                    'Bengkel praktik dengan meja kerja adjustable.',
                    'Toolkit adaptif untuk pegangan terbatas.',
                ],
                'mentors' => ['Teknisi otomotif bersertifikasi', 'Instruktur vokasional'],
            ],
        ];

        foreach ($programs as $seed) {
            VocationalProgram::updateOrCreate(
                ['slug' => $seed['slug']],
                Arr::only($seed, ['title', 'description', 'audience', 'duration', 'schedule', 'outcomes', 'facilities', 'mentors']),
            );
        }
    }

    private function seedPosts(): void
    {
        $posts = [
            [
                'title' => 'Launching Laboratorium Inovasi Baru',
                'excerpt' => 'Fasilitas baru untuk mendukung pembelajaran teknologi adaptif.',
                'content' => '<p>Kami meluncurkan laboratorium baru dengan perangkat aksesibilitas terkini.</p>',
                'status' => 'published',
                'cover_url' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'Sesi Pelatihan Soft Skill Bersama Industri',
                'excerpt' => 'Kolaborasi dengan mitra industri untuk menyiapkan peserta vokasional.',
                'content' => '<p>Pelatihan soft skill bersama praktisi HR memberikan pengalaman nyata bagi peserta.</p>',
                'status' => 'published',
                'cover_url' => 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
                'published_at' => now()->subDays(9),
            ],
        ];

        foreach ($posts as $seed) {
            Post::updateOrCreate(
                ['slug' => Str::slug($seed['title'])],
                $seed,
            );
        }
    }

    private function seedEvents(): void
    {
        $now = Carbon::now();

        $events = [
            [
                'title' => 'Open House Program Vokasional',
                'description' => 'Kesempatan mengenal fasilitas, kurikulum, dan mentor vokasional inklusif.',
                'start_at' => $now->copy()->addDays(7)->setTime(9, 0),
                'end_at' => $now->copy()->addDays(7)->setTime(12, 0),
                'location' => 'Kampus Vokasional Disabilitas',
            ],
            [
                'title' => 'Workshop Literasi Digital Inklusif',
                'description' => 'Pelatihan penggunaan teknologi aksesibel untuk orang tua dan peserta.',
                'start_at' => $now->copy()->addDays(14)->setTime(13, 30),
                'end_at' => $now->copy()->addDays(14)->setTime(16, 0),
                'location' => 'Ruang Multimedia Lantai 2',
            ],
        ];

        foreach ($events as $seed) {
            Event::updateOrCreate(
                ['slug' => Str::slug($seed['title'])],
                $seed,
            );
        }
    }

    private function seedAlbums(): void
    {
        $album = Album::updateOrCreate(
            ['slug' => 'kegiatan-vokasional'],
            [
                'title' => 'Kegiatan Vokasional 2025',
                'cover_url' => 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
                'description' => 'Kumpulan dokumentasi kegiatan belajar dan karya peserta dari berbagai program.',
            ],
        );

        $media = [
            ['type' => 'image', 'url' => 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Pendampingan mentoring di lab komputer', 'sort' => 1],
            ['type' => 'image', 'url' => 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Workshop fotografi inklusif', 'sort' => 2],
            ['type' => 'image', 'url' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Praktik perakitan komputer', 'sort' => 3],
            ['type' => 'image', 'url' => 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Pelatihan layanan pelanggan', 'sort' => 4],
        ];

        foreach ($media as $seed) {
            AlbumMedia::updateOrCreate(
                ['album_id' => $album->id, 'url' => $seed['url']],
                $seed,
            );
        }
    }

    private function seedContactMessages(): void
    {
        $contacts = [
            [
                'name' => 'Ahmad Rahman',
                'email' => 'ahmad.rahman@example.com',
                'phone' => '+6281234567890',
                'message' => 'Saya ingin bertanya tentang program vokasional komputer untuk low vision.',
                'is_read' => false,
            ],
            [
                'name' => 'Siti Nurhaliza',
                'email' => 'siti.nurhaliza@example.com',
                'phone' => '+6281987654321',
                'message' => 'Bagaimana cara mendaftar untuk program fotografi? Ada biaya?',
                'is_read' => true,
            ],
        ];

        foreach ($contacts as $seed) {
            ContactMessage::updateOrCreate(
                ['email' => $seed['email']],
                $seed,
            );
        }
    }
}


