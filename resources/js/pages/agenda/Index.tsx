import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarCheck,
    CalendarClock,
    CalendarDays,
    MapPin,
    Sparkles,
} from 'lucide-react';
import { PublicLayout } from '@/layouts/public/PublicLayout';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Pagination from '@/components/ui/Pagination';
import type { EventSummary } from '@/features/content/types';
import type { Paginated } from '@/features/common/types';

type AgendaIndexProps = {
    events: Paginated<EventSummary>;
    filters: {
        filter: string;
    };
};

type PageProps = {
    settings?: {
        site_name?: string;
    };
};

function parseDate(value?: string | null) {
    if (!value) {
        return null;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return parsed;
}

function formatDateRange(startValue?: Date | null, endValue?: Date | null) {
    if (!startValue && !endValue) {
        return 'Jadwal menyesuaikan';
    }

    const dateFormatter = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    const timeFormatter = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    });

    if (!startValue) {
        return `Hingga ${dateFormatter.format(endValue!)}`;
    }

    if (!endValue) {
        return `${dateFormatter.format(startValue)} • ${timeFormatter.format(startValue)} WIB`;
    }

    const sameDay = startValue.toDateString() === endValue.toDateString();
    if (sameDay) {
        return `${dateFormatter.format(startValue)} • ${timeFormatter.format(startValue)} - ${timeFormatter.format(endValue)} WIB`;
    }

    return `${dateFormatter.format(startValue)} → ${dateFormatter.format(endValue)}`;
}

function relativeLabel(target?: Date | null) {
    if (!target) {
        return 'Jadwal segera diumumkan';
    }

    const now = new Date();
    const diff = target.getTime() - now.getTime();
    const dayMs = 1000 * 60 * 60 * 24;
    const days = Math.round(diff / dayMs);

    if (Math.abs(diff) < dayMs / 2) {
        return diff >= 0 ? 'Berlangsung hari ini' : 'Selesai hari ini';
    }

    if (days > 0) {
        return `Dalam ${days} hari`;
    }

    return `${Math.abs(days)} hari lalu`;
}

function stripHtml(value?: string | null) {
    if (!value) {
        return '';
    }

    return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function truncate(value: string, maxLength = 180) {
    if (value.length <= maxLength) {
        return value;
    }

    return `${value.slice(0, maxLength).trim()}…`;
}

export default function AgendaIndex({ events, filters }: AgendaIndexProps) {
    const { props } = usePage<PageProps>();
    const siteName = props?.settings?.site_name ?? 'SMK Negeri 10 Kuningan';
    const activeFilter = filters.filter === 'past' ? 'past' : 'upcoming';
    const listedEvents = events.data ?? [];

    const normalizedEvents = listedEvents.map((event) => ({
        ...event,
        startDate: parseDate(event.start_at),
        endDate: parseDate(event.end_at ?? undefined),
    }));

    const now = new Date();
    const highlightEvent =
        normalizedEvents.find((event) => event.startDate && event.startDate >= now) ?? normalizedEvents[0];

    const highlightDescription = truncate(
        stripHtml(highlightEvent?.description) ||
            `Ikuti agenda ${activeFilter === 'past' ? 'arsip' : 'terkini'} dari ${siteName} yang mendukung kolaborasi dan pembelajaran vokasional.`,
        220,
    );

    const locations = new Set(
        normalizedEvents.map((event) => event.location?.trim()).filter((location): location is string => Boolean(location)),
    );

    const dateExtremes = normalizedEvents.reduce(
        (acc, event) => {
            if (event.startDate) {
                if (!acc.earliest || event.startDate < acc.earliest) {
                    acc.earliest = event.startDate;
                }
                if (!acc.latest || event.startDate > acc.latest) {
                    acc.latest = event.startDate;
                }
            }
            return acc;
        },
        { earliest: null as Date | null, latest: null as Date | null },
    );

    const coverageLabel =
        dateExtremes.earliest && dateExtremes.latest
            ? `${new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' }).format(dateExtremes.earliest)} — ${new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' }).format(dateExtremes.latest)}`
            : 'Menunggu jadwal';

    const metaDescription = highlightDescription || `Agenda kegiatan terbaru dari ${siteName}.`;

    return (
        <PublicLayout>
            <Head title={`Agenda - ${siteName}`}>
                <meta name="description" content={metaDescription} />
            </Head>

            <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
                <div className="pointer-events-none absolute inset-0 opacity-50">
                    <div className="absolute -left-24 top-24 h-56 w-56 rounded-full bg-amber-400/30 blur-3xl" />
                    <div className="absolute -right-16 bottom-16 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
                </div>
                <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-14 lg:pt-20">
                    <Breadcrumbs
                        items={[{ label: 'Agenda', href: '/agenda' }]}
                        variant="dark"
                        className="text-slate-200"
                    />
                    <div className="mt-10 grid gap-12 lg:grid-cols-[1.55fr_1fr] lg:items-start">
                        <header className="space-y-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Agenda Sekolah</p>
                            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                                Jadwal Kolaboratif untuk Komunitas {siteName}
                            </h1>
                            <p className="max-w-2xl text-base text-slate-100 sm:text-lg">{highlightDescription}</p>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/20 text-amber-100">
                                            <CalendarDays className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.3em] text-slate-200">Agenda Tercatat</p>
                                            <p className="text-lg font-semibold text-white">{events.total ?? normalizedEvents.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-100">
                                            <CalendarCheck className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.3em] text-slate-200">
                                                {activeFilter === 'past' ? 'Agenda Selesai' : 'Agenda Mendatang'}
                                            </p>
                                            <p className="text-lg font-semibold text-white">
                                                {normalizedEvents.length > 0 ? normalizedEvents.length : 'Menunggu'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-400/20 text-sky-100">
                                            <Sparkles className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.3em] text-slate-200">Cakupan Waktu</p>
                                            <p className="text-lg font-semibold text-white">{coverageLabel}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>
                        <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                            <div className="space-y-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Sorotan Agenda</p>
                                {highlightEvent ? (
                                    <div className="space-y-4">
                                        <div>
                                            <h2 className="text-xl font-semibold text-white">{highlightEvent.title}</h2>
                                            <p className="mt-2 text-sm text-slate-100/80">
                                                {truncate(stripHtml(highlightEvent.description) || 'Agenda pilihan yang sedang difokuskan tim sekolah.', 160)}
                                            </p>
                                        </div>
                                        <dl className="space-y-3 text-sm text-slate-100/90">
                                            <div className="flex items-start gap-3">
                                                <CalendarClock className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-200" />
                                                <div>
                                                    <dt className="text-xs uppercase tracking-[0.28em] text-slate-300">Jadwal</dt>
                                                    <dd className="font-medium text-white">
                                                        {formatDateRange(highlightEvent.startDate, highlightEvent.endDate)}
                                                    </dd>
                                                    <dd className="text-xs text-slate-200/70">{relativeLabel(highlightEvent.startDate)}</dd>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-200" />
                                                <div>
                                                    <dt className="text-xs uppercase tracking-[0.28em] text-slate-300">Lokasi</dt>
                                                    <dd className="font-medium text-white">
                                                        {highlightEvent.location ?? 'Lokasi diumumkan kemudian'}
                                                    </dd>
                                                </div>
                                            </div>
                                        </dl>
                                        <Link
                                            href={`/agenda/${highlightEvent.slug}`}
                                            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:border-white hover:bg-white hover:text-slate-900"
                                        >
                                            Lihat Agenda
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-100/80">
                                        Agenda terbaru sedang disusun. Pantau terus kanal informasi resmi {siteName} untuk pembaruan berikutnya.
                                    </p>
                                )}
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100/80">
                                <p className="font-semibold text-white">Butuh pendampingan?</p>
                                <p className="mt-1">
                                    Tim layanan kami siap membantu koordinasi agenda atau kolaborasi. Silakan hubungi <a
                                        className="text-amber-200 underline decoration-dotted underline-offset-4"
                                        href="mailto:halo@smkn10kuningan.sch.id"
                                    >halo@smkn10kuningan.sch.id</a>.
                                </p>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <section className="bg-slate-50 py-16">
                <div className="mx-auto w-full max-w-6xl px-4">
                    <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1b57d6]">Filter Agenda</p>
                            <h2 className="mt-2 text-xl font-semibold text-slate-900">Pilih agenda mendatang atau arsip</h2>
                            <p className="text-sm text-slate-600">Aktifkan kategori sesuai kebutuhan koordinasi Anda. Semua perubahan akan menjaga posisi gulir halaman.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    router.get(
                                        '/agenda',
                                        { filter: 'upcoming' },
                                        { preserveScroll: true, preserveState: true },
                                    )
                                }
                                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] transition ${
                                    activeFilter === 'upcoming'
                                        ? 'bg-[#1b57d6] text-white shadow'
                                        : 'border border-slate-300 text-slate-700 hover:border-[#1b57d6] hover:text-[#1b57d6]'
                                }`}
                                aria-pressed={activeFilter === 'upcoming'}
                            >
                                Mendatang
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    router.get(
                                        '/agenda',
                                        { filter: 'past' },
                                        { preserveScroll: true, preserveState: true },
                                    )
                                }
                                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] transition ${
                                    activeFilter === 'past'
                                        ? 'bg-[#1b57d6] text-white shadow'
                                        : 'border border-slate-300 text-slate-700 hover:border-[#1b57d6] hover:text-[#1b57d6]'
                                }`}
                                aria-pressed={activeFilter === 'past'}
                            >
                                Selesai
                            </button>
                        </div>
                    </div>

                    <div className="relative mt-10">
                        <span className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-[#1b57d6]/30 via-slate-200 to-transparent sm:block" />
                        <div className="space-y-6">
                            {normalizedEvents.length > 0 ? (
                                normalizedEvents.map((event) => {
                                    const isPast = event.startDate ? event.startDate < now : false;
                                    const statusLabel = isPast ? 'Selesai' : 'Mendatang';

                                    return (
                                        <article
                                            key={event.slug}
                                            className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:pl-16"
                                        >
                                            <span className="absolute -left-6 top-8 hidden h-3 w-3 rounded-full border-2 border-white bg-[#1b57d6] sm:block" />
                                            <div className="flex flex-wrap items-start justify-between gap-4">
                                                <div>
                                                    <span
                                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${
                                                            isPast
                                                                ? 'bg-slate-200 text-slate-600'
                                                                : 'bg-[#1b57d6]/10 text-[#1b57d6]'
                                                        }`}
                                                    >
                                                        {statusLabel}
                                                    </span>
                                                    <h3 className="mt-3 text-lg font-semibold text-slate-900">
                                                        <Link href={`/agenda/${event.slug}`} className="hover:text-[#1b57d6]">
                                                            {event.title}
                                                        </Link>
                                                    </h3>
                                                    <p className="mt-2 text-sm text-slate-600">
                                                        {truncate(stripHtml(event.description) || 'Detil agenda akan diumumkan menjelang pelaksanaan.', 180)}
                                                    </p>
                                                </div>
                                                <Link
                                                    href={`/agenda/${event.slug}`}
                                                    className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#0b2b7a] transition hover:bg-amber-300"
                                                >
                                                    Detail
                                                    <ArrowRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </div>
                                            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <CalendarClock className="h-4 w-4 text-[#1b57d6]" />
                                                    <span>{formatDateRange(event.startDate, event.endDate)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-[#1b57d6]" />
                                                    <span>{event.location ?? 'Lokasi menyusul'}</span>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })
                            ) : (
                                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                                    <p className="font-semibold text-slate-700">Belum ada agenda pada kategori ini.</p>
                                    <p className="mt-2 text-slate-500">
                                        Silakan cek kembali dalam beberapa waktu ke depan atau hubungi tim kami untuk berkoordinasi mengenai kebutuhan agenda baru.
                                    </p>
                                    <a
                                        href="mailto:halo@smkn10kuningan.sch.id"
                                        className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#1b57d6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#1b57d6] transition hover:bg-[#1b57d6] hover:text-white"
                                    >
                                        Konsultasi Agenda
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-10">
                        <Pagination links={events.links} />
                    </div>
                </div>
            </section>

            <section className="bg-white py-16">
                <div className="mx-auto w-full max-w-6xl px-4">
                    <div className="grid gap-6 rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm sm:grid-cols-3">
                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1b57d6]">Jejak Lokasi</p>
                            <p className="text-xl font-semibold text-slate-900">{locations.size > 0 ? `${locations.size} lokasi` : 'Lokasi menyesuaikan'}</p>
                            <p className="text-sm text-slate-600">Rangkaian agenda berlangsung di berbagai ruang belajar, mulai dari workshop, aula, hingga mitra industri.</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1b57d6]">Kolaborasi</p>
                            <p className="text-xl font-semibold text-slate-900">Terbuka untuk komunitas</p>
                            <p className="text-sm text-slate-600">Guru, siswa, alumni, dan mitra industri dapat berpartisipasi. Silakan hubungi kami untuk integrasi kegiatan bersama.</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1b57d6]">Dokumentasi</p>
                            <p className="text-xl font-semibold text-slate-900">Tersedia liputan</p>
                            <p className="text-sm text-slate-600">Setiap agenda utama didokumentasikan untuk memperkaya pembelajaran dan publikasi sekolah.</p>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
