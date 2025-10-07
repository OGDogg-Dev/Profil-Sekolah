import { useMemo, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Layers, Search, Sparkles, UsersRound } from 'lucide-react';
import PublicLayout from '@/layouts/public/PublicLayout';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ProgramGrid from '@/components/vocational/ProgramGrid';
import type { VocationalProgram } from '@/features/vocational/types';
import type { MediaItem } from '@/features/vocational/types';

interface VocationalIndexProps {
    items: VocationalProgram[];
}

type PageProps = {
    settings?: {
        site_name?: string;
        tagline?: string;
    };
};

type ProgramWithMeta = VocationalProgram & {
    media: MediaItem[];
    focusTags: string[];
};

const heroPlaceholder = 'https://placehold.co/1600x900/1b57d6/ffffff?text=Program+Vokasional';

function normaliseUrl(url: string) {
    if (!url) {
        return url;
    }

    return url.startsWith('http') ? url : `/storage/${url}`;
}

export default function VocationalIndex({ items }: VocationalIndexProps) {
    const { props } = usePage<PageProps>();
    const siteName = props?.settings?.site_name ?? 'SMK Negeri 10 Kuningan';
    const tagline = props?.settings?.tagline ?? 'Where Tomorrow\'s Leaders Come Together';

    const programs = useMemo<ProgramWithMeta[]>(() => {
        return items.map((item) => {
            const media: MediaItem[] =
                item.media && item.media.length > 0
                    ? item.media.map((mediaItem) => ({
                          ...mediaItem,
                          url: normaliseUrl(mediaItem.url),
                      }))
                    : (item.photos ?? []).map((photo, index) => ({
                          id: index + 1,
                          type: 'image' as const,
                          url: normaliseUrl(photo),
                          alt: item.title,
                      }));

            const focusTags = item.audience
                ? item.audience
                      .split(',')
                      .map((value) => value.trim())
                      .filter(Boolean)
                : [];

            return {
                ...item,
                media,
                focusTags,
            };
        });
    }, [items]);

    const heroImage = programs.find((program) => program.media.length > 0)?.media[0]?.url ?? heroPlaceholder;

    const [searchTerm, setSearchTerm] = useState('');
    const [activeFocus, setActiveFocus] = useState<string>('all');

    const focusOptions = useMemo(() => {
        const counts = new Map<string, number>();

        programs.forEach((program) => {
            const tags = program.focusTags.length > 0 ? program.focusTags : ['Terbuka untuk Semua'];
            tags.forEach((tag) => {
                counts.set(tag, (counts.get(tag) ?? 0) + 1);
            });
        });

        return Array.from(counts.entries())
            .map(([value, count]) => ({ value, count }))
            .sort((a, b) => a.value.localeCompare(b.value));
    }, [programs]);

    const filteredPrograms = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return programs.filter((program) => {
            const matchesQuery =
                query.length === 0 ||
                [program.title, program.description, program.audience, program.schedule]
                    .filter(Boolean)
                    .some((field) => (field as string).toLowerCase().includes(query));

            if (activeFocus === 'all') {
                return matchesQuery;
            }

            const focusPool = program.focusTags.length > 0 ? program.focusTags : ['Terbuka untuk Semua'];
            return matchesQuery && focusPool.includes(activeFocus);
        });
    }, [programs, searchTerm, activeFocus]);

    const visiblePrograms = useMemo(() => filteredPrograms as VocationalProgram[], [filteredPrograms]);

    const aggregated = useMemo(() => {
        const facilitySet = new Set<string>();
        const mentorSet = new Set<string>();
        const outcomeSet = new Set<string>();

        programs.forEach((program) => {
            program.facilities?.forEach((facility) => facilitySet.add(facility));
            program.mentors?.forEach((mentor) => mentorSet.add(mentor));
            program.outcomes?.forEach((outcome) => outcomeSet.add(outcome));
        });

        return {
            facilityCount: facilitySet.size,
            mentorCount: mentorSet.size,
            outcomeCount: outcomeSet.size,
        };
    }, [programs]);

    return (
        <PublicLayout siteName={siteName} tagline={tagline}>
            <Head title={`Direktori Program Vokasional - ${siteName}`}>
                <meta
                    name="description"
                    content={`Jelajahi program vokasional ${siteName} lengkap dengan fokus pembelajaran, fasilitas, serta mentor profesional.`}
                />
            </Head>

            <section className="relative isolate overflow-hidden bg-slate-900 text-white">
                <div
                    aria-hidden
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{ backgroundImage: `url(${heroImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-900/70 to-slate-900/90" />
                <div className="relative mx-auto w-full max-w-6xl px-4 py-20">
                    <Breadcrumbs
                        items={[{ label: 'Direktori Program Vokasional', href: '/vokasional' }]}
                        variant="dark"
                    />

                    <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
                        <div className="space-y-8">
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
                                <Sparkles className="h-4 w-4" aria-hidden />
                                Program Unggulan
                            </span>
                            <div className="space-y-4">
                                <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                                    {siteName}: Direktori Program Vokasional Inklusif
                                </h1>
                                <p className="max-w-2xl text-base text-slate-100 sm:text-lg">
                                    Temukan jalur vokasional yang dirancang adaptif untuk kebutuhan beragam peserta didik. Setiap program
                                    menghadirkan kurikulum terapan, fasilitas aksesibel, dan pendampingan mentor profesional.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/profil"
                                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-200"
                                >
                                    Pelajari Profil Sekolah ↗
                                </Link>
                                <Link
                                    href="/hubungi-kami"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/70 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    Konsultasi Program
                                </Link>
                            </div>
                        </div>

                        <aside className="flex flex-col gap-4 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Jumlah Program</p>
                                <p className="mt-2 text-3xl font-semibold text-white">{programs.length.toString().padStart(2, '0')}</p>
                                <p className="text-sm text-slate-100">Pilihan jalur keahlian yang aktif dibuka untuk peserta didik.</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Fokus Pembelajaran</p>
                                <p className="mt-2 text-lg font-semibold text-white">{focusOptions.length}</p>
                                <p className="text-sm text-slate-100">Bidang minat berbeda dengan modul praktik adaptif.</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Mentor Profesional</p>
                                <p className="mt-2 text-lg font-semibold text-white">{aggregated.mentorCount}</p>
                                <p className="text-sm text-slate-100">Jejaring pendamping industri dan guru kejuruan.</p>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <section className="bg-slate-50 py-12">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="max-w-xl space-y-3">
                                <h2 className="text-2xl font-semibold text-slate-900">Jelajahi Program yang Tepat</h2>
                                <p className="text-sm leading-relaxed text-slate-600">
                                    Gunakan pencarian dan filter fokus untuk menemukan program vokasional sesuai minat dan kebutuhan pendampingan.
                                </p>
                            </div>
                            <div className="relative w-full max-w-sm">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
                                <input
                                    type="search"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    placeholder="Cari program, jadwal, atau sasaran..."
                                    className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 px-10 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200"
                                />
                            </div>
                        </div>
                        {focusOptions.length > 0 ? (
                            <div className="mt-6 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveFocus('all')}
                                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition hover:border-brand-500 hover:text-brand-600"
                                    data-active={activeFocus === 'all'}
                                    aria-pressed={activeFocus === 'all'}
                                >
                                    <Layers className="h-4 w-4" aria-hidden />
                                    Semua Fokus
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold">{programs.length}</span>
                                </button>
                                {focusOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setActiveFocus(option.value)}
                                        className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition hover:border-brand-500 hover:text-brand-600 data-[active=true]:border-brand-500 data-[active=true]:bg-brand-50 data-[active=true]:text-brand-700"
                                        data-active={activeFocus === option.value}
                                        aria-pressed={activeFocus === option.value}
                                    >
                                        <UsersRound className="h-4 w-4" aria-hidden />
                                        {option.value}
                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold">{option.count}</span>
                                    </button>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <div className="space-y-8">
                        <header className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Direktori Lengkap</p>
                            <h3 className="text-xl font-semibold text-slate-900">
                                {activeFocus === 'all' ? 'Seluruh program vokasional tersedia' : `Program dengan fokus ${activeFocus}`}
                            </h3>
                            {searchTerm ? (
                                <p className="text-sm text-slate-500">
                                    Menampilkan hasil untuk "{searchTerm}" — {visiblePrograms.length} program ditemukan.
                                </p>
                            ) : null}
                        </header>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            {visiblePrograms.length > 0 ? (
                                <ProgramGrid items={visiblePrograms} />
                            ) : (
                                <div className="flex flex-col items-center gap-3 py-12 text-center">
                                    <Sparkles className="h-10 w-10 text-brand-500" aria-hidden />
                                    <p className="text-sm font-semibold text-slate-700">Belum ada program yang sesuai pencarian Anda.</p>
                                    <p className="max-w-md text-sm text-slate-500">
                                        Coba ubah kata kunci atau pilih fokus lain. Anda juga dapat menghubungi tim kami untuk rekomendasi program yang paling relevan.
                                    </p>
                                    <Link
                                        href="/hubungi-kami"
                                        className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-500"
                                    >
                                        Hubungi Tim Akademik ↗
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white py-16">
                <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 lg:grid-cols-[1.2fr_1fr]">
                    <div className="space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Mengapa Memilih Program Kami</p>
                        <h3 className="text-2xl font-semibold text-slate-900">Ekosistem vokasional yang terhubung dengan dunia kerja</h3>
                        <p className="text-sm leading-relaxed text-slate-600">
                            Kolaborasi dengan industri dan komunitas memungkinkan peserta didik belajar melalui praktik langsung. Fasilitas yang adaptif,
                            jejaring mentor lintas bidang, dan kurikulum berbasis proyek memastikan setiap program menjawab kebutuhan dunia kerja masa kini.
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Fasilitas Unggulan</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-900">{aggregated.facilityCount}</p>
                                <p className="text-sm text-slate-600">Laboratorium, studio, dan ruang praktik yang siap digunakan untuk pembelajaran adaptif.</p>
                            </div>
                            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Hasil Pembelajaran</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-900">{aggregated.outcomeCount}</p>
                                <p className="text-sm text-slate-600">Kompetensi spesifik yang dikurasi bersama mitra industri untuk kesiapan kerja.</p>
                            </div>
                        </div>
                    </div>
                    <aside className="flex flex-col justify-between gap-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Butuh Bantuan?</p>
                            <p className="mt-2 text-lg font-semibold text-slate-900">Tim layanan pendidikan siap membantu.</p>
                            <p className="mt-2 text-sm text-slate-600">
                                Konsultasikan kebutuhan pembelajaran khusus, rencana magang, atau penempatan dunia kerja untuk setiap peserta didik.
                            </p>
                        </div>
                        <Link
                            href="/hubungi-kami"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-500"
                        >
                            Jadwalkan Konsultasi ↗
                        </Link>
                    </aside>
                </div>
            </section>
        </PublicLayout>
    );
}
