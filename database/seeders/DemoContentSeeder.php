<?php

namespace Database\Seeders;

use App\Models\Album;
use App\Models\AlbumMedia;
use App\Models\ContactMessage;
use App\Models\Event;
use App\Models\MediaItem;
use App\Models\Page;
use App\Models\Post;
use App\Models\SiteSetting;
use App\Models\VocationalProgram;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class DemoContentSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::query()->updateOrCreate([], [
            'site_name' => 'Vokasional Disabilitas',
            'tagline' => 'Pelatihan vokasi inklusif � belajar, berkarya, berdaya',
        ]);

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

        $programSeeds = [
            [
                'slug' => 'komputer',
                'title' => 'Vokasional Komputer',
                'description' => 'Belajar instalasi, perakitan, dan pemeliharaan komputer serta dasar pengembangan aplikasi yang mudah diakses.',
                'audience' => 'Penyandang disabilitas fisik dan sensorik yang berminat pada teknologi informasi.',
                'duration' => '6 bulan',
                'schedule' => 'Senin�Jumat, 08.00�12.00 WIB',
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
                'schedule' => 'Selasa�Sabtu, 09.00�13.00 WIB',
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
                'schedule' => 'Senin�Jumat, 08.00�12.00 WIB',
                'outcomes' => [
                    'Pemeriksaan sistem kelistrikan dan injeksi.',
                    'Perawatan mesin dan bodi motor secara mandiri.',
                    'Standar layanan pelanggan bengkel inklusif.',
                ],
                'facilities' => [
                    'Bengkel praktik dengan meja kerja adjustable.',
                    'Toolkit adaptif untuk pegangan terbatas.',
                ],
                'mentors' => ['Teknisi otomotif bersertifikasi', 'Instruktur keselamatan kerja'],
            ],
            [
                'slug' => 'elektronika',
                'title' => 'Vokasional Elektronika',
                'description' => 'Pelatihan merakit kit elektronika, soldering aman, dan perawatan perangkat rumah tangga.',
                'audience' => 'Penyandang disabilitas rungu wicara dan autisme level ringan.',
                'duration' => '6 bulan',
                'schedule' => 'Senin�Kamis, 13.00�16.00 WIB',
                'outcomes' => [
                    'Membaca diagram elektronik sederhana.',
                    'Merakit kit IoT skala kecil.',
                    'Perawatan perangkat elektronik rumah tangga.',
                ],
                'facilities' => [
                    'Laboratorium elektronik dengan alat bantu visual.',
                    'Stasiun kerja ergonomis dan alat keselamatan.',
                ],
                'mentors' => ['Ahli elektronika industri', 'Fasilitator komunikasi isyarat'],
            ],
            [
                'slug' => 'las',
                'title' => 'Vokasional Las',
                'description' => 'Pelatihan pengelasan dasar MIG/TIG dengan standar keselamatan tinggi bagi penyandang disabilitas.',
                'audience' => 'Penyandang disabilitas daksa dan disabilitas pendengaran.',
                'duration' => '8 bulan',
                'schedule' => 'Senin�Jumat, 08.00�11.30 WIB',
                'outcomes' => [
                    'Penguasaan teknik las dasar dan pemotongan logam.',
                    'Pembuatan proyek kerangka sederhana.',
                    'Standar keselamatan kerja bengkel logam.',
                ],
                'facilities' => [
                    'Workshop las dengan exhaust dan tirai pelindung.',
                    'Alat keselamatan adaptif untuk mobilitas terbatas.',
                ],
                'mentors' => ['Welding inspector berpengalaman', 'Fasilitator bahasa isyarat'],
            ],
            [
                'slug' => 'handycraft',
                'title' => 'Vokasional Handycraft',
                'description' => 'Membuat kerajinan ramah lingkungan mulai dari anyaman hingga produk dekoratif bernilai jual.',
                'audience' => 'Penyandang disabilitas intelektual ringan dan psikososial.',
                'duration' => '4 bulan',
                'schedule' => 'Rabu�Jumat, 09.00�12.00 WIB',
                'outcomes' => [
                    'Teknik dasar anyaman, batik, dan decoupage.',
                    'Penyusunan paket produk dan penjualan daring.',
                    'Penguatan soft skill layanan pelanggan.',
                ],
                'facilities' => [
                    'Studio kerajinan dengan alat bantu ergonomis.',
                    'Galeri mini untuk kurasi produk.',
                ],
                'mentors' => ['Artisan craft lokal', 'Pendamping kewirausahaan'],
            ],
        ];

        foreach ($programSeeds as $index => $seed) {
            $program = VocationalProgram::updateOrCreate(
                ['slug' => $seed['slug']],
                Arr::except($seed, ['slug'])
            );

            // Add media items to first 3 programs
            if ($index < 3) {
                $mediaUrls = [
                    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=400&q=80',
                ];
                foreach ($mediaUrls as $url) {
                    MediaItem::updateOrCreate(
                        ['vocational_program_id' => $program->id, 'url' => $url],
                        [
                            'type' => 'image',
                            'alt' => $seed['title'],
                        ]
                    );
                }
            }
        }

        $now = now();

        $postSeeds = [
            [
                'title' => 'Workshop Inklusif: Pengenalan Teknologi Adaptif',
                'excerpt' => 'Peserta mempraktikkan penggunaan screen reader dan perangkat aksesibilitas terbaru.',
                'content' => '<p>Kegiatan workshop berlangsung selama dua hari dengan menghadirkan mentor dari industri teknologi aksesibel. Peserta mempraktikkan langsung penggunaan perangkat dan perangkat lunak adaptif...</p>',
                'cover_url' => 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Prestasi Alumni di Ajang Kompetisi Startup Disabilitas',
                'excerpt' => 'Tim alumni vokasional meraih juara favorit berkat aplikasi layanan inklusif.',
                'content' => '<p>Kompetisi startup disabilitas 2025 menobatkan tim alumni sebagai juara favorit...</p>',
                'cover_url' => 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Kolaborasi dengan Industri Otomotif untuk Program Magang',
                'excerpt' => 'Program Bengkel Motor menggandeng mitra bengkel ramah disabilitas.',
                'content' => '<p>Siswa vokasional bengkel sepeda motor mendapatkan kesempatan magang di bengkel mitra...</p>',
                'cover_url' => 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Karya Fotografi Peserta Dipamerkan di Galeri Kota',
                'excerpt' => 'Album foto bertema Kota Inklusif mendapat apresiasi pengunjung.',
                'content' => '<p>Program Vokasional Fotografi kembali menggelar pameran karya tahunan...</p>',
                'cover_url' => 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'title' => 'Pelatihan Soft Skill Layanan Pelanggan',
                'excerpt' => 'Pendamping psikososial memfasilitasi simulasi komunikasi pelanggan.',
                'content' => '<p>Pelatihan layanan pelanggan menjadi materi wajib bagi peserta vokasional...</p>',
                'cover_url' => 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
            ],
        ];

        foreach ($postSeeds as $index => $data) {
            Post::updateOrCreate(
                ['slug' => Str::slug($data['title'])],
                array_merge($data, [
                    'status' => 'published',
                    'published_at' => $now->copy()->subDays($index * 3),
                ])
            );
        }

        $eventSeeds = [
            [
                'title' => 'Open House Program Vokasional',
                'description' => 'Sesi perkenalan program, tur fasilitas, dan konsultasi dengan mentor.',
                'start_at' => $now->copy()->addDays(5)->setTime(9, 0),
                'end_at' => $now->copy()->addDays(5)->setTime(12, 0),
                'location' => 'Aula Utama Kampus Vokasional',
            ],
            [
                'title' => 'Kelas Umum Literasi Digital Inklusif',
                'description' => 'Kegiatan belajar bersama mengenal literasi digital dengan perangkat adaptif.',
                'start_at' => $now->copy()->addDays(12)->setTime(13, 30),
                'end_at' => $now->copy()->addDays(12)->setTime(16, 0),
                'location' => 'Ruang Multimedia Lantai 2',
            ],
            [
                'title' => 'Pameran Karya Peserta Handycraft',
                'description' => 'Pameran produk kerajinan ramah lingkungan hasil peserta vokasional.',
                'start_at' => $now->copy()->addDays(20)->setTime(10, 0),
                'end_at' => $now->copy()->addDays(20)->setTime(15, 0),
                'location' => 'Galeri Kota Kreatif',
            ],
        ];

        foreach ($eventSeeds as $seed) {
            Event::updateOrCreate(
                ['slug' => Str::slug($seed['title'])],
                $seed
            );
        }

        $album = Album::updateOrCreate(
            ['slug' => 'kegiatan-vokasional'],
            [
                'title' => 'Kegiatan Vokasional 2025',
                'cover_url' => 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
                'description' => 'Kumpulan dokumentasi kegiatan belajar dan karya peserta dari berbagai program.',
            ]
        );

        $mediaSeeds = [
            ['type' => 'image', 'url' => 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Pendampingan mentoring di lab komputer', 'sort' => 1],
            ['type' => 'image', 'url' => 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Workshop fotografi inklusif', 'sort' => 2],
            ['type' => 'image', 'url' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Praktik perakitan komputer', 'sort' => 3],
            ['type' => 'image', 'url' => 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Pelatihan soft skill layanan pelanggan', 'sort' => 4],
            ['type' => 'video', 'url' => 'https://www.youtube.com/watch?v=1q8Vd7xqv-E', 'caption' => 'Kilas balik showcase vokasional', 'poster' => null, 'track_vtt' => null, 'sort' => 5],
            ['type' => 'image', 'url' => 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Sesi kolaborasi lintas program', 'sort' => 6],
        ];

        foreach ($mediaSeeds as $seed) {
            AlbumMedia::updateOrCreate(
                ['album_id' => $album->id, 'url' => $seed['url']],
                $seed
            );
        }

        // Demo contact messages
        $contactSeeds = [
            [
                'name' => 'Ahmad Rahman',
                'email' => 'ahmad.rahman@example.com',
                'phone' => '+6281234567890',
                'message' => 'Saya ingin bertanya tentang program vokasional komputer. Apakah ada persyaratan khusus untuk penyandang disabilitas netra?',
                'is_read' => false,
            ],
            [
                'name' => 'Siti Nurhaliza',
                'email' => 'siti.nurhaliza@example.com',
                'phone' => '+6281987654321',
                'message' => 'Bagaimana cara mendaftar untuk program vokasional fotografi? Apakah ada biaya pendaftaran?',
                'is_read' => true,
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi.santoso@example.com',
                'phone' => '+6281122334455',
                'message' => 'Perusahaan kami tertarik untuk berkolaborasi dalam program magang untuk penyandang disabilitas. Siapa yang bisa kami hubungi?',
                'is_read' => false,
            ],
            [
                'name' => 'Maya Sari',
                'email' => 'maya.sari@example.com',
                'phone' => '+6281555666777',
                'message' => 'Saya adalah alumni program vokasional handycraft. Ingin berbagi pengalaman dan memberikan testimoni. Bagaimana caranya?',
                'is_read' => true,
            ],
            [
                'name' => 'Rizki Pratama',
                'email' => 'rizki.pratama@example.com',
                'phone' => '+6281777888999',
                'message' => 'Apakah semua fasilitas di kampus sudah ramah akses untuk penyandang disabilitas roda? Saya ingin memastikan sebelum mendaftar.',
                'is_read' => false,
            ],
        ];

        foreach ($contactSeeds as $seed) {
            ContactMessage::updateOrCreate(
                ['email' => $seed['email']],
                $seed
            );
        }
    }
}
