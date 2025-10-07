import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, CalendarCheck, CalendarClock, MapPin, Share2 } from 'lucide-react';
import PublicLayout from '@/layouts/public/PublicLayout';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import type { EventSummary } from '@/features/content/types';

type AgendaDetailProps = {
    event: EventSummary & {
        description?: string | null;
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

function formatDate(value?: Date | null, options?: Intl.DateTimeFormatOptions) {
    if (!value) {
        return null;
    }

    return new Intl.DateTimeFormat(
        'id-ID',
        options ?? {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        },
    ).format(value);
}

function formatDateRange(startValue?: Date | null, endValue?: Date | null) {
    if (!startValue && !endValue) {
        return 'Jadwal menyesuaikan';
    }

    if (!startValue) {
        return `Hingga ${formatDate(endValue)}`;
    }

    if (!endValue) {
        return `${formatDate(startValue)} • ${formatDate(startValue, { hour: '2-digit', minute: '2-digit' })} WIB`;
    }

    const sameDay = startValue.toDateString() === endValue.toDateString();
    if (sameDay) {
        return `${formatDate(startValue)} • ${formatDate(startValue, {
            hour: '2-digit',
            minute: '2-digit',
        })} - ${formatDate(endValue, { hour: '2-digit', minute: '2-digit' })} WIB`;
    }

    return `${formatDate(startValue)} → ${formatDate(endValue)}`;
}

function relativeLabel(startValue?: Date | null) {
    if (!startValue) {
        return 'Jadwal segera diumumkan';
    }

    const now = new Date();
    const diff = startValue.getTime() - now.getTime();
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

function formatICSDate(date: string) {
    const utc = new Date(date);
    return `${utc.getUTCFullYear()}${String(utc.getUTCMonth() + 1).padStart(2, '0')}${String(utc.getUTCDate()).padStart(2, '0')}T${String(utc.getUTCHours()).padStart(2, '0')}${String(utc.getUTCMinutes()).padStart(2, '0')}${String(utc.getUTCSeconds()).padStart(2, '0')}Z`;
}

function escapeICS(value: string) {
    return value.replace(/[\\,\n;]/g, (match) => ({ '\\': '\\\\', ',': '\\,', ';': '\\;', '\n': '\\n' }[match] ?? match));
}

function stripHtml(value?: string | null) {
    if (!value) {
        return '';
    }

    return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function truncate(value: string, maxLength = 200) {
    if (value.length <= maxLength) {
        return value;
    }

    return `${value.slice(0, maxLength).trim()}…`;
}

export default function AgendaDetail({ event }: AgendaDetailProps) {
    const { props } = usePage<PageProps>();
    const siteName = props?.settings?.site_name ?? 'SMK Negeri 10 Kuningan';
    const startDate = parseDate(event.start_at);
    const endDate = parseDate(event.end_at ?? undefined);
    const cleanedDescription = truncate(stripHtml(event.description) || event.title, 200);

    const eventJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: event.title,
        startDate: event.start_at,
        endDate: event.end_at ?? undefined,
        location: event.location
            ? {
                  '@type': 'Place',
                  name: event.location,
              }
            : undefined,
        description: stripHtml(event.description) || undefined,
    };

    const icsLines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Profil Sekolah//Agenda//ID',
        'BEGIN:VEVENT',
        `UID:${event.slug}@profil-sekolah.local`,
        `DTSTAMP:${formatICSDate(new Date().toISOString())}`,
        `DTSTART:${formatICSDate(event.start_at)}`,
        event.end_at ? `DTEND:${formatICSDate(event.end_at)}` : null,
        `SUMMARY:${escapeICS(event.title)}`,
        event.location ? `LOCATION:${escapeICS(event.location)}` : null,
        event.description
            ? `DESCRIPTION:${escapeICS(stripHtml(event.description))}`
            : null,
        'END:VEVENT',
        'END:VCALENDAR',
    ].filter(Boolean);

    const icsContent = encodeURIComponent(icsLines.join('\r\n'));
    const icsHref = `data:text/calendar;charset=utf-8,${icsContent}`;

    return (
        <PublicLayout siteName={siteName}>
            <Head title={`${event.title} - ${siteName}`}>
                <meta name="description" content={cleanedDescription} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }} />
            </Head>

            <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
                <div className="pointer-events-none absolute inset-0 opacity-50">
                    <div className="absolute -left-24 top-24 h-56 w-56 rounded-full bg-amber-400/30 blur-3xl" />
                    <div className="absolute -right-16 bottom-16 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
                </div>
                <div className="relative mx-auto w-full max-w-4xl px-4 pb-16 pt-14 lg:pt-20">
                    <Breadcrumbs
                        items={[
                            { label: 'Agenda', href: '/agenda' },
                            { label: event.title },
                        ]}
                        variant="dark"
                        className="text-slate-200"
                    />
                    <header className="mt-10 space-y-6">
                        <Link
                            href="/agenda"
                            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200 transition hover:text-white"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Agenda
                        </Link>
                        <div className="space-y-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Agenda Sekolah</p>
                            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{event.title}</h1>
                            <p className="max-w-3xl text-base text-slate-100 sm:text-lg">
                                {cleanedDescription || `Agenda resmi ${siteName} untuk mendukung pembelajaran vokasional.`}
                            </p>
                        </div>
                        <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:grid-cols-2">
                            <div className="space-y-2">
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-200">Waktu Pelaksanaan</p>
                                <p className="text-base font-semibold text-white">{formatDateRange(startDate, endDate)}</p>
                                <p className="text-xs text-slate-200/70">{relativeLabel(startDate)}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-200">Lokasi</p>
                                <p className="text-base font-semibold text-white">{event.location ?? 'Lokasi menyusul'}</p>
                                <p className="text-xs text-slate-200/70">Hubungi panitia untuk informasi akses.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href={icsHref}
                                download={`${event.slug}.ics`}
                                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#0b2b7a] transition hover:bg-amber-300"
                            >
                                <CalendarCheck className="h-4 w-4" /> Simpan ke Kalender (.ics)
                            </a>
                            <a
                                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatICSDate(event.start_at)}${event.end_at ? `/${formatICSDate(event.end_at)}` : ''}&details=${encodeURIComponent(stripHtml(event.description) || '')}&location=${encodeURIComponent(event.location ?? '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:border-white hover:bg-white hover:text-slate-900"
                            >
                                <Share2 className="h-4 w-4" /> Tambah ke Google Calendar
                            </a>
                        </div>
                    </header>
                </div>
            </section>

            <section className="bg-slate-50 py-16">
                <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 lg:grid-cols-[1.6fr_1fr]">
                    <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                        {event.description ? (
                            <div className="prose max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-[#1b57d6]">
                                <div dangerouslySetInnerHTML={{ __html: event.description }} />
                            </div>
                        ) : (
                            <p className="text-sm text-slate-600">Deskripsi agenda belum tersedia.</p>
                        )}
                    </article>
                    <aside className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1b57d6]">Informasi Singkat</p>
                            <dl className="mt-4 space-y-4 text-sm text-slate-600">
                                <div className="flex items-start gap-3">
                                    <CalendarClock className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1b57d6]" />
                                    <div>
                                        <dt className="text-xs uppercase tracking-[0.28em] text-slate-500">Waktu</dt>
                                        <dd className="font-semibold text-slate-900">{formatDateRange(startDate, endDate)}</dd>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1b57d6]" />
                                    <div>
                                        <dt className="text-xs uppercase tracking-[0.28em] text-slate-500">Lokasi</dt>
                                        <dd className="font-semibold text-slate-900">{event.location ?? 'Lokasi menyusul'}</dd>
                                    </div>
                                </div>
                            </dl>
                        </div>
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-100/60 p-6 text-sm text-slate-600">
                            <p className="font-semibold text-slate-800">Butuh dukungan publikasi?</p>
                            <p className="mt-2">
                                Hubungi tim humas {siteName} melalui email
                                {' '}
                                <a
                                    href="mailto:halo@smkn10kuningan.sch.id"
                                    className="text-[#1b57d6] underline decoration-dotted underline-offset-4"
                                >
                                    halo@smkn10kuningan.sch.id
                                </a>
                                {' '}untuk koordinasi dokumentasi atau peliputan agenda.
                            </p>
                        </div>
                    </aside>
                </div>
            </section>
        </PublicLayout>
    );
}
