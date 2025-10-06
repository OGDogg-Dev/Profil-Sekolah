<?php

namespace App\Support;

class HomePageDefaults
{
    public static function hero(): array
    {
        return [
            'eyebrow' => 'Sekolah Inklusif - Ramah Disabilitas',
            'title' => 'Setiap Anak Berhak Tumbuh & Berprestasi',
            'description' => 'Lingkungan belajar yang aman, aksesibel, dan menyenangkan dengan dukungan guru pendamping, terapi, serta teknologi asistif.',
            'primary' => [
                'label' => 'Daftar PPDB',
                'href' => '/ppdb',
            ],
            'secondary' => [
                'label' => 'Hubungi Kami',
                'href' => '/hubungi-kami',
            ],
            'media' => null,
        ];
    }

    public static function highlights(): array
    {
        return [
            [
                'title' => 'Program Unggulan',
                'description' => 'Inklusi SD-SMA, terapi wicara dan okupasi, teknologi asistif & koding',
                'href' => '/vokasional',
                'icon' => 'Layers',
            ],
            [
                'title' => 'Berita Terbaru',
                'description' => 'Sorotan kegiatan dan prestasi siswa setiap pekan',
                'href' => '/berita',
                'icon' => 'Newspaper',
            ],
            [
                'title' => 'Agenda',
                'description' => 'Seminar orang tua, open house, dan perayaan inklusi nasional',
                'href' => '/agenda',
                'icon' => 'CalendarDays',
            ],
            [
                'title' => 'Galeri',
                'description' => 'Fasilitas aksesibel dan dokumentasi kegiatan siswa',
                'href' => '/galeri',
                'icon' => 'Image',
            ],
        ];
    }

    public static function stats(): array
    {
        return [
            ['label' => 'Siswa', 'value' => '1.200+'],
            ['label' => 'Tenaga Pendidik', 'value' => '85'],
            ['label' => 'Akreditasi', 'value' => 'A'],
            ['label' => 'Dokumentasi', 'value' => '+500'],
        ];
    }

    public static function testimonials(): array
    {
        return [
            [
                'quote' => 'Anak saya lebih percaya diri; guru pendamping sangat suportif dan programnya jelas.',
                'name' => 'Ibu Sari',
                'role' => 'Orang tua',
            ],
            [
                'quote' => 'Lab komputer aksesibel membuat saya berani melanjutkan belajar koding.',
                'name' => 'Rafi',
                'role' => 'Alumni',
            ],
        ];
    }

    public static function news(): array
    {
        return [
            'mode' => 'auto',
            'auto' => [
                'limit' => 4,
            ],
            'manual' => [
                'post_ids' => [],
            ],
        ];
    }

    public static function agenda(): array
    {
        return [
            'limit' => 4,
            'range_days' => 60,
            'show_calendar' => true,
        ];
    }

    public static function gallery(): array
    {
        return [
            'mode' => 'album',
            'album_id' => null,
            'limit' => 6,
            'manual_media_ids' => [],
        ];
    }

    public static function sections(): array
    {
        return [
            'news' => [
                'eyebrow' => 'Update',
                'title' => 'Berita Terbaru',
                'description' => 'Informasi terbaru tentang kegiatan dan prestasi sekolah.',
            ],
            'agenda' => [
                'eyebrow' => 'Kalender',
                'title' => 'Agenda Terdekat',
                'description' => 'Jadwal kegiatan sekolah dan komunitas inklusif.',
            ],
            'gallery' => [
                'eyebrow' => 'Dokumentasi',
                'title' => 'Galeri / Prestasi',
                'description' => 'Dokumentasi kegiatan, fasilitas, dan karya siswa.',
            ],
        ];
    }

    public static function layout(): array
    {
        return ['hero', 'highlights', 'news', 'agenda', 'programs', 'gallery', 'stats_testimonials'];
    }

    public static function seo(): array
    {
        return [
            'title' => 'Beranda',
            'description' => 'Sekolah inklusif yang mendukung bakat setiap anak melalui program akademik dan non-akademik.',
            'canonical' => null,
            'og_image_id' => null,
        ];
    }

    public static function all(): array
    {
        return [
            'hero' => self::hero(),
            'highlights' => self::highlights(),
            'stats' => self::stats(),
            'testimonials' => self::testimonials(),
            'news' => self::news(),
            'agenda' => self::agenda(),
            'gallery' => self::gallery(),
            'sections' => self::sections(),
            'layout' => self::layout(),
            'seo' => self::seo(),
        ];
    }
}

