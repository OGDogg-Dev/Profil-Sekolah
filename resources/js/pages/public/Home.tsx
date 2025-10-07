import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarDays,
    GraduationCap,
    MapPin,
    MessageCircle,
    Newspaper,
    PhoneCall,
    Sparkles,
    Users,
} from 'lucide-react';
import PublicLayout from '@/layouts/public/PublicLayout';
import type { EventSummary, PostSummary } from '@/features/content/types';
import type { VocationalProgram } from '@/features/vocational/types';

interface HomeProps {
    settings: {
        site_name?: string;
        tagline?: string;
    } | null;
    profile: {
        title: string;
        excerpt?: string | null;
        content?: string | null;
    };
    programs: VocationalProgram[];
    posts: PostSummary[];
    events: EventSummary[];
}

interface SharedSettings {
    whatsapp?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
}

interface SharedProps {
    settings?: SharedSettings | null;
}

const heroBadges = [
    'Sekolah inklusif',
    'Terakreditasi A',
    'Jejaring Industri Nasional',
    'Pendamping profesional',
];

const inclusionFocus = [
    {
        title: 'Aksesibilitas Menyeluruh',
        description: 'Ruang kelas, laboratorium, dan fasilitas umum yang dirancang untuk semua kebutuhan mobilitas.',
    },
    {
        title: 'Pendampingan Individual',
        description: 'Setiap peserta didik mendapatkan rencana belajar personal dan mentor khusus.',
    },
    {
        title: 'Kolaborasi Orang Tua',
        description: 'Pertemuan rutin, kanal konsultasi, dan pelibatan orang tua dalam proses belajar.',
    },
    {
        title: 'Kemitraan Industri',
        description: 'Program magang dan pelatihan bersama mitra dunia kerja yang ramah disabilitas.',
    },
];

const testimonialFallback = [
    {
        name: 'Dwi Hartanti',
        relation: 'Orang Tua Peserta Didik',
        quote:
            'Sekolah ini tidak hanya menerima, tetapi juga benar-benar memahami kebutuhan anak kami. Komunikasi dengan guru selalu terbuka.',
    },
    {
        name: 'Bagas Pratama',
        relation: 'Alumni Program Desain Grafis',
        quote:
            'Pendampingan vokasionalnya membuat saya percaya diri bekerja di industri kreatif. Lingkungannya suportif dan kolaboratif.',
    },
];

const galleryHighlights = [
    'Praktik kerja industri inklusif',
    'Kegiatan konseling karier',
    'Kolaborasi komunitas orang tua',
    'Showcase karya peserta didik',
];

function formatDateRange(event: EventSummary) {
    if (!event.start_at) {
        return 'Jadwal menyusul';
    }

    const start = new Date(event.start_at);
    const end = event.end_at ? new Date(event.end_at) : null;

    const dateFormatter = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    if (!end) {
        return dateFormatter.format(start);
    }

    const sameDay = start.toDateString() === end.toDateString();
    if (sameDay) {
        const timeFormatter = new Intl.DateTimeFormat('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return `${dateFormatter.format(start)} · ${timeFormatter.format(start)} - ${timeFormatter.format(end)}`;
    }

    return `${dateFormatter.format(start)} - ${dateFormatter.format(end)}`;
}

export default function Home({ settings, profile, programs, posts, events }: HomeProps) {
    const { props } = usePage<SharedProps>();
    const sharedSettings = props.settings ?? undefined;

    const siteName = settings?.site_name ?? 'Sekolah Inklusif';
    const tagline = settings?.tagline ?? 'Mewujudkan pendidikan vokasional yang ramah semua peserta didik.';

    const contactNumber = sharedSettings?.whatsapp ?? sharedSettings?.phone ?? null;
    const contactEmail = sharedSettings?.email ?? null;
    const contactAddress = sharedSettings?.address ?? 'Jl. Pendidikan Inklusif No. 10, Kuningan';

    const featuredPost = posts[0] ?? null;
    const otherPosts = posts.slice(1, 4);
    const upcomingEvents = events.slice(0, 4);
    const highlightedPrograms = programs.slice(0, 4);

    const heroChecklist = [
        'Pendamping guru inklusi bersertifikasi',
        'Evaluasi berkala bersama orang tua',
        'Ruang belajar adaptif dan aman',
    ];

    const stats = [
        { label: 'Peserta Didik Aktif', value: 320, icon: <Users className="h-5 w-5 text-brand-600" aria-hidden /> },
        { label: 'Program Vokasi', value: Math.max(highlightedPrograms.length, 4), icon: <GraduationCap className="h-5 w-5 text-brand-600" aria-hidden /> },
        { label: 'Kemitraan Industri', value: 18, icon: <Sparkles className="h-5 w-5 text-brand-600" aria-hidden /> },
        { label: 'Agenda Tahunan', value: Math.max(upcomingEvents.length, 8), icon: <CalendarDays className="h-5 w-5 text-brand-600" aria-hidden /> },
    ];

    return (
        <PublicLayout siteName={siteName} tagline={tagline}>
            <Head title={`Profil Sekolah - ${siteName}`}>
                <meta
                    name="description"
                    content={
                        profile.excerpt ??
                        'Sekolah vokasional inklusif dengan layanan personal, fasilitas aksesibel, dan jaringan industri ramah disabilitas.'
                    }
                />
            </Head>

            <section className="bg-slate-100">
                <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-12 pt-10 lg:grid-cols-[1.35fr_1fr]">
                    <div className="space-y-8">
                        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
                            {heroBadges.map((badge) => (
                                <span key={badge} className="rounded-full bg-white px-3 py-1 text-slate-600 shadow-sm">
                                    {badge}
                                </span>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-brand-600">Profil Sekolah</p>
                            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{profile.title}</h1>
                            <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
                                {profile.excerpt ??
                                    'Kami berkomitmen menyediakan pembelajaran vokasional berkualitas yang memberi ruang tumbuh untuk setiap peserta didik, tanpa terkecuali.'}
                            </p>
                        </div>
                        <ul className="grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
                            {heroChecklist.map((item) => (
                                <li key={item} className="flex items-start gap-2 rounded-2xl bg-white p-3 shadow-sm">
                                    <span className="mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-brand-500" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/vokasional"
                                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                            >
                                Lihat Program Vokasi <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/hubungi-kami"
                                className="inline-flex items-center gap-2 rounded-full border border-brand-200 px-5 py-2 text-sm font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-brand-50"
                            >
                                Konsultasi Dengan Kami
                            </Link>
                        </div>
                    </div>

                    <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Hubungi Tim Layanan</p>
                        <p className="mt-3 text-lg font-semibold text-slate-900">Butuh panduan lebih lanjut?</p>
                        <p className="mt-2 text-sm text-slate-600">
                            Tim kami siap membantu orang tua, calon peserta didik, dan mitra industri untuk memahami dukungan inklusi yang tersedia.
                        </p>
                        <div className="mt-5 space-y-3 text-sm text-slate-700">
                            {contactNumber ? (
                                <a
                                    href={`https://wa.me/${contactNumber.replace(/[^0-9]/g, '')}`}
                                    className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 transition hover:border-brand-300 hover:bg-brand-50"
                                >
                                    <PhoneCall className="h-4 w-4 text-brand-600" />
                                    <span>{contactNumber}</span>
                                </a>
                            ) : null}
                            {contactEmail ? (
                                <a
                                    href={`mailto:${contactEmail}`}
                                    className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 transition hover:border-brand-300 hover:bg-brand-50"
                                >
                                    <MessageCircle className="h-4 w-4 text-brand-600" />
                                    <span>{contactEmail}</span>
                                </a>
                            ) : null}
                            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                                <MapPin className="mt-1 h-4 w-4 text-brand-600" />
                                <span>{contactAddress}</span>
                            </div>
                        </div>
                        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
                            <p className="font-semibold uppercase tracking-[0.3em] text-brand-500">Jam Konsultasi</p>
                            <p className="mt-2 leading-relaxed">Senin - Jumat · 08.00 - 15.00 WIB</p>
                            <p className="mt-1 leading-relaxed">Sabtu · Penjadwalan melalui janji temu</p>
                        </div>
                    </aside>
                </div>
            </section>

            <section className="bg-white">
                <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 pb-12 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50">{stat.icon}</div>
                            <div>
                                <p className="text-2xl font-semibold text-slate-900">{stat.value.toString().padStart(2, '0')}</p>
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-slate-50">
                <div className="mx-auto w-full max-w-6xl px-4 py-12">
                    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Berita Terbaru</p>
                            <h2 className="text-2xl font-semibold text-slate-900">Cerita terbaru dari komunitas sekolah</h2>
                        </div>
                        <Link href="/berita" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-600">
                            Arsip Berita <ArrowRight className="h-4 w-4" />
                        </Link>
                    </header>
                    <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                        {featuredPost ? (
                            <Link
                                href={`/berita/${featuredPost.slug}`}
                                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                            >
                                {featuredPost.cover_url ? (
                                    <img
                                        src={featuredPost.cover_url}
                                        alt={featuredPost.title}
                                        className="h-60 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                                    />
                                ) : null}
                                <div className="flex flex-1 flex-col gap-3 p-6">
                                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">
                                        <Newspaper className="h-4 w-4" /> Sorotan Utama
                                    </span>
                                    <h3 className="text-xl font-semibold text-slate-900 group-hover:text-brand-700">{featuredPost.title}</h3>
                                    {featuredPost.excerpt ? <p className="text-sm text-slate-600">{featuredPost.excerpt}</p> : null}
                                    <p className="mt-auto text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">
                                        {new Date(featuredPost.published_at ?? featuredPost.created_at ?? '').toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </Link>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
                                <Newspaper className="h-10 w-10" />
                                <p className="mt-3 text-sm">Belum ada berita yang dipublikasikan.</p>
                            </div>
                        )}
                        <div className="space-y-4">
                            {otherPosts.length > 0 ? (
                                otherPosts.map((post) => (
                                    <Link
                                        key={post.id}
                                        href={`/berita/${post.slug}`}
                                        className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:bg-brand-50"
                                    >
                                        {post.cover_url ? (
                                            <img
                                                src={post.cover_url}
                                                alt={post.title}
                                                className="h-20 w-28 rounded-2xl object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-20 w-28 items-center justify-center rounded-2xl bg-slate-100 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                                Berita
                                            </div>
                                        )}
                                        <div className="flex flex-1 flex-col gap-2">
                                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">
                                                {new Date(post.published_at ?? post.created_at ?? '').toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                            <h4 className="text-base font-semibold text-slate-900 group-hover:text-brand-700">{post.title}</h4>
                                            {post.excerpt ? <p className="text-sm text-slate-600 line-clamp-2">{post.excerpt}</p> : null}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
                                    Belum ada berita lainnya.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white">
                <div className="mx-auto w-full max-w-6xl px-4 py-12">
                    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Agenda Terdekat</p>
                            <h2 className="text-2xl font-semibold text-slate-900">Kolaborasi dan kegiatan komunitas</h2>
                        </div>
                        <Link href="/agenda" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-600">
                            Lihat Semua Agenda <ArrowRight className="h-4 w-4" />
                        </Link>
                    </header>
                    <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                        <div className="hidden grid-cols-[1fr_0.7fr_0.6fr_0.5fr] bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 md:grid">
                            <span>Agenda</span>
                            <span>Jadwal</span>
                            <span>Lokasi</span>
                            <span>Status</span>
                        </div>
                        <div className="divide-y divide-slate-200">
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map((event) => (
                                    <Link
                                        key={event.id}
                                        href={`/agenda/${event.slug}`}
                                        className="grid gap-4 px-6 py-5 transition hover:bg-white md:grid-cols-[1fr_0.7fr_0.6fr_0.5fr]"
                                    >
                                        <div className="space-y-2">
                                            <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                                            {event.summary ? <p className="text-xs text-slate-500">{event.summary}</p> : null}
                                        </div>
                                        <div className="text-sm text-slate-700">{formatDateRange(event)}</div>
                                        <div className="text-sm text-slate-700">{event.location ?? 'Daring / Luring'}</div>
                                        <div>
                                            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                {event.status ?? 'Terjadwal'}
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="px-6 py-8 text-center text-sm text-slate-500">Belum ada agenda terdekat.</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-slate-50">
                <div className="mx-auto w-full max-w-6xl px-4 py-12">
                    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Program Vokasi Inklusif</p>
                            <h2 className="text-2xl font-semibold text-slate-900">Jalur belajar adaptif dengan dukungan profesional</h2>
                            <p className="mt-2 max-w-2xl text-sm text-slate-600">
                                Program dirancang bersama mitra industri dan tenaga ahli terapi untuk memastikan kesiapan kerja dan kemandirian.
                            </p>
                        </div>
                        <Link href="/vokasional" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-600">
                            Lihat Semua Program <ArrowRight className="h-4 w-4" />
                        </Link>
                    </header>
                    <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {highlightedPrograms.length > 0 ? (
                            highlightedPrograms.map((program) => (
                                <Link
                                    key={program.id}
                                    href={`/vokasional/${program.slug}`}
                                    className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:bg-brand-50"
                                >
                                    <div className="flex flex-col gap-2">
                                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">
                                            <GraduationCap className="h-4 w-4" />
                                            {program.category ?? 'Program Unggulan'}
                                        </span>
                                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand-700">{program.name}</h3>
                                        {program.short_description ? (
                                            <p className="text-sm text-slate-600 line-clamp-3">{program.short_description}</p>
                                        ) : null}
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-500">
                                        {(program.focus_tags ?? []).slice(0, 3).map((tag) => (
                                            <span key={tag} className="rounded-full bg-brand-100 px-3 py-1 text-brand-700">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="sm:col-span-2 xl:col-span-4 rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                                Program belum tersedia.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="bg-white">
                <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1.2fr_1fr]">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Fokus Inklusi</p>
                        <h2 className="mt-3 text-2xl font-semibold text-slate-900">Lingkungan belajar yang aman dan suportif</h2>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {inclusionFocus.map((focus) => (
                                <div key={focus.title} className="rounded-2xl bg-white/70 p-4">
                                    <h3 className="text-base font-semibold text-slate-900">{focus.title}</h3>
                                    <p className="mt-2 text-sm text-slate-600">{focus.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Kolaborasi Vokasi Inklusif</p>
                        <h3 className="mt-3 text-xl font-semibold">Bersama mewujudkan masa depan yang setara</h3>
                        <p className="mt-3 text-sm text-emerald-800">
                            Buka peluang magang, dukungan beasiswa, atau program CSR dengan menghubungi tim layanan publik kami. Kami menyesuaikan kebutuhan kolaborasi agar inklusif untuk semua.
                        </p>
                        <Link
                            href="/hubungi-kami"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                            Ajukan Kolaborasi <ArrowRight className="h-4 w-4" />
                        </Link>
                    </aside>
                </div>
            </section>

            <section className="bg-slate-50">
                <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1.2fr_1fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Testimoni</p>
                        <h2 className="mt-3 text-2xl font-semibold text-slate-900">Cerita keberhasilan dari keluarga dan alumni</h2>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {testimonialFallback.map((testimonial) => (
                                <div key={testimonial.name} className="flex h-full flex-col rounded-2xl bg-slate-50/70 p-4">
                                    <p className="flex-1 text-sm text-slate-700">“{testimonial.quote}”</p>
                                    <div className="mt-4 text-sm font-semibold text-slate-900">
                                        {testimonial.name}
                                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-500">{testimonial.relation}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Kilas Galeri</p>
                        <h3 className="mt-3 text-xl font-semibold text-slate-900">Momen yang kami dokumentasikan</h3>
                        <ul className="mt-4 space-y-3 text-sm text-slate-600">
                            {galleryHighlights.map((highlight) => (
                                <li key={highlight} className="flex items-start gap-2">
                                    <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-brand-500" />
                                    <span>{highlight}</span>
                                </li>
                            ))}
                        </ul>
                        <Link
                            href="/galeri"
                            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-600"
                        >
                            Lihat Album Terbaru <ArrowRight className="h-4 w-4" />
                        </Link>
                    </aside>
                </div>
            </section>

            <section className="bg-white">
                <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1fr_1.1fr]">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Siap Berkunjung?</p>
                        <h2 className="mt-3 text-2xl font-semibold text-slate-900">Jadwalkan tur kampus inklusif kami</h2>
                        <p className="mt-3 text-sm text-slate-600">
                            Kami menyambut kunjungan orang tua, calon peserta didik, dan mitra industri. Tim kami akan menyesuaikan tur sesuai kebutuhan aksesibilitas Anda.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/hubungi-kami"
                                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                            >
                                Jadwalkan Kunjungan <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/profil"
                                className="inline-flex items-center gap-2 rounded-full border border-brand-200 px-5 py-2 text-sm font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-brand-50"
                            >
                                Pelajari Kurikulum
                            </Link>
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
                        <iframe
                            title="Lokasi Sekolah Inklusif"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.3814739646857!2d108.483375!3d-7.417465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f2bb2c664f0f5%3A0x2cdb5090c962f8d5!2sSMK%20Negeri%2010%20Kuningan!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                            className="h-[320px] w-full border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                        />
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
