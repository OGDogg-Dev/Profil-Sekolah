import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import ProgramGrid from '@/components/vocational/ProgramGrid';
import AlbumPreview from '@/components/home/AlbumPreview';
import EventList from '@/components/home/EventList';
import PostList from '@/components/home/PostList';
import type { AlbumSummary, EventSummary, PostSummary } from '@/features/content/types';
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
    albums: AlbumSummary[];
}

const placeholderImage = 'https://placehold.co/1600x900?text=Profil+Sekolah+Inklusif';

export default function Home({ settings, profile, programs, posts, events, albums }: HomeProps) {
    const siteName = settings?.site_name ?? 'SMK Negeri 10 Kuningan';
    const tagline = settings?.tagline ?? 'Mewujudkan pendidikan vokasional yang inklusif dan berdaya saing.';

    const featuredPost = posts[0] ?? null;
    const highlightedPrograms = programs.slice(0, 4);
    const latestPosts = posts.slice(0, 6);
    const spotlightAlbums = albums.slice(0, 3);
    const highlightedEvents = events.slice(0, 4);

    const upcomingEvent = events.find((event) => new Date(event.start_at) >= new Date()) ?? events[0] ?? null;

    const stats = [
        { label: 'Program Vokasional', value: programs.length },
        { label: 'Agenda Aktif', value: events.length },
        { label: 'Publikasi', value: posts.length },
        { label: 'Album Galeri', value: albums.length },
    ];

    const commitments = [
        {
            title: 'Pembelajaran Adaptif',
            description:
                'Rencana pembelajaran yang fleksibel dan pendampingan sesuai kebutuhan peserta didik berkebutuhan khusus.',
        },
        {
            title: 'Kolaborasi Industri',
            description: 'Kemitraan dengan dunia usaha dan dunia industri untuk memberikan pengalaman kerja nyata.',
        },
        {
            title: 'Lingkungan Inklusif',
            description: 'Fasilitas aksesibel, komunitas suportif, dan budaya sekolah yang menjunjung keberagaman.',
        },
    ];

    const heroImage = featuredPost?.cover_url ?? placeholderImage;

    return (
        <PublicLayout siteName={siteName} tagline={tagline}>
            <Head title={`Beranda - ${siteName}`}>
                <meta name="description" content={tagline} />
            </Head>

            <main className="bg-slate-50">
                <section className="relative isolate overflow-hidden bg-slate-900 text-white">
                    <div
                        aria-hidden
                        className="absolute inset-0 bg-cover bg-center opacity-50"
                        style={{ backgroundImage: `url(${heroImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/80" />
                    <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 lg:grid-cols-[1.2fr_1fr]">
                        <div className="space-y-6">
                            <span className="inline-flex items-center rounded-full bg-emerald-400/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
                                Portal Publik
                            </span>
                            <div className="space-y-4">
                                <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                                    {siteName}: Ruang Berkembang untuk Semua
                                </h1>
                                <p className="max-w-2xl text-base text-slate-100 sm:text-lg">
                                    {profile.excerpt ??
                                        'Kami menghadirkan pembelajaran vokasional yang berpihak pada keberagaman dan memastikan setiap peserta didik mendapatkan dukungan optimal untuk meraih cita-cita.'}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/profil"
                                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-200 hover:text-slate-900"
                                >
                                    Jelajahi Profil ↗
                                </Link>
                                <Link
                                    href="/kontak"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/70 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    Hubungi Kami
                                </Link>
                            </div>
                            {featuredPost && (
                                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Sorotan Terbaru</p>
                                    <Link
                                        href={`/berita/${featuredPost.slug}`}
                                        className="mt-2 block text-lg font-semibold text-white hover:text-amber-300"
                                    >
                                        {featuredPost.title}
                                    </Link>
                                    {featuredPost.excerpt && (
                                        <p className="mt-1 text-sm text-slate-100">{featuredPost.excerpt}</p>
                                    )}
                                </div>
                            )}
                        </div>
                        <aside className="flex flex-col justify-between gap-6 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Agenda Berikutnya</p>
                                {upcomingEvent ? (
                                    <div className="mt-3 space-y-2">
                                        <p className="text-sm font-medium text-amber-200">
                                            {new Date(upcomingEvent.start_at ?? '').toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                        <Link
                                            href={`/agenda/${upcomingEvent.slug}`}
                                            className="block text-lg font-semibold text-white hover:text-amber-300"
                                        >
                                            {upcomingEvent.title}
                                        </Link>
                                        {upcomingEvent.location ? (
                                            <p className="text-sm text-slate-100">{upcomingEvent.location}</p>
                                        ) : null}
                                    </div>
                                ) : (
                                    <p className="mt-2 text-sm text-slate-100">Belum ada agenda yang dijadwalkan.</p>
                                )}
                            </div>
                            <div className="rounded-2xl bg-slate-900/70 p-4 shadow-lg">
                                <p className="text-sm font-semibold text-white">
                                    "Pendidikan adalah tiket menuju masa depan. Hari esok dimiliki oleh mereka yang menyiapkan dirinya hari ini."
                                </p>
                                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-emerald-200">— Malcolm X</p>
                            </div>
                        </aside>
                    </div>
                </section>

                <section className="border-t border-white/40 bg-slate-50">
                    <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                                <p className="text-3xl font-semibold text-brand-600">{stat.value.toString().padStart(2, '0')}</p>
                                <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-white">
                    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.4fr_1fr]">
                        <div className="space-y-6">
                            <header className="space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Komitmen Kami</p>
                                <h2 className="text-2xl font-semibold text-slate-900">
                                    Membuka akses pendidikan vokasional yang ramah semua peserta didik
                                </h2>
                            </header>
                            <div className="grid gap-4 md:grid-cols-2">
                                {commitments.map((commitment) => (
                                    <div
                                        key={commitment.title}
                                        className="rounded-3xl border border-slate-200 bg-slate-50/60 p-5 shadow-sm"
                                    >
                                        <h3 className="text-lg font-semibold text-slate-900">{commitment.title}</h3>
                                        <p className="mt-2 text-sm text-slate-600">{commitment.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
                                Sambutan Kepala Sekolah
                            </p>
                            <h3 className="mt-3 text-xl font-semibold text-slate-900">Selamat Datang</h3>
                            <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                {profile.excerpt ??
                                    'Terima kasih telah mengunjungi portal resmi kami. Mari berkolaborasi dalam menciptakan lingkungan belajar yang aman, ramah, dan penuh kesempatan.'}
                            </p>
                            <Link
                                href="/profil"
                                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
                            >
                                Baca profil lengkap ↗
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="border-t border-slate-200 bg-slate-50">
                    <div className="mx-auto w-full max-w-6xl px-4 py-12">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Program Vokasional</p>
                                <h2 className="text-2xl font-semibold text-slate-900">Kurikulum adaptif berbasis industri</h2>
                                <p className="mt-2 max-w-xl text-sm text-slate-600">
                                    Pilihan program yang dirancang bersama mitra industri serta menyediakan dukungan personal untuk peserta didik berkebutuhan khusus.
                                </p>
                            </div>
                            <Link
                                href="/vokasional"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
                            >
                                Lihat semua program ↗
                            </Link>
                        </div>
                        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <ProgramGrid items={highlightedPrograms} />
                        </div>
                    </div>
                </section>

                <section className="border-t border-slate-200 bg-white">
                    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.4fr_1fr]">
                        <div>
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Berita Terbaru</p>
                                    <h2 className="text-2xl font-semibold text-slate-900">Cerita dari komunitas sekolah</h2>
                                </div>
                                <Link
                                    href="/berita"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
                                >
                                    Arsip berita ↗
                                </Link>
                            </div>
                            <div className="mt-6">
                                <PostList items={latestPosts} />
                            </div>
                        </div>
                        <aside className="space-y-6">
                            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Agenda Sekolah</p>
                                <p className="mt-2 text-sm text-slate-600">
                                    Ikuti perkembangan kegiatan pelatihan, workshop, dan seleksi peserta didik.
                                </p>
                                <div className="mt-5">
                                    <EventList items={highlightedEvents} />
                                </div>
                                <Link
                                    href="/agenda"
                                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
                                >
                                    Agenda lengkap ↗
                                </Link>
                            </div>
                            <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6 text-slate-900 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Butuh Informasi Tambahan?</p>
                                <p className="mt-2 text-sm text-slate-700">
                                    Tim layanan publik siap membantu orang tua, mitra industri, dan masyarakat yang ingin berkolaborasi.
                                </p>
                                <Link
                                    href="/kontak"
                                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-600"
                                >
                                    Hubungi layanan publik ↗
                                </Link>
                            </div>
                        </aside>
                    </div>
                </section>

                <section className="border-t border-slate-200 bg-slate-50">
                    <div className="mx-auto w-full max-w-6xl px-4 py-12">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Galeri Terbaru</p>
                                <h2 className="text-2xl font-semibold text-slate-900">Kilasan aktivitas peserta didik</h2>
                                <p className="mt-2 max-w-xl text-sm text-slate-600">
                                    Dokumentasi kegiatan praktik kerja, karya kreatif, dan momen kebersamaan di lingkungan sekolah.
                                </p>
                            </div>
                            <Link
                                href="/galeri"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
                            >
                                Semua album ↗
                            </Link>
                        </div>
                        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <AlbumPreview items={spotlightAlbums} />
                        </div>
                    </div>
                </section>

                <section className="border-t border-slate-200 bg-brand-600">
                    <div className="mx-auto w-full max-w-6xl px-4 py-12 text-white">
                        <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-center">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-semibold">Siap berkolaborasi dengan sekolah inklusif?</h2>
                                <p className="max-w-2xl text-sm text-white/80">
                                    Kami membuka ruang kolaborasi dengan lembaga, perusahaan, dan komunitas untuk menciptakan akses karier yang lebih luas bagi peserta didik vokasional. Mari wujudkan lingkungan belajar yang adil dan berkesinambungan.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                <Link
                                    href="/kontak"
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-amber-200"
                                >
                                    Jadwalkan Kunjungan ↗
                                </Link>
                                <Link
                                    href="/berita"
                                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/80 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    Lihat cerita terbaru
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </PublicLayout>
    );
}
