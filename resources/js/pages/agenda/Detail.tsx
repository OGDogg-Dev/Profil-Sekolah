import { Head, usePage } from '@inertiajs/react';
import AppShell from '@/layouts/AppShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import type { EventSummary } from '@/features/content/types';

interface AgendaDetailProps {
    event: EventSummary & {
        description?: string | null;
    };
}

type PageProps = {
    settings?: {
        site_name?: string;
    };
};

function formatDate(date: string, withTime = true) {
    const d = new Date(date);
    const dateStr = d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    if (!withTime) {
        return dateStr;
    }

    const timeStr = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    return `${dateStr} - ${timeStr}`;
}

function formatICSDate(date: string) {
    const utc = new Date(date);
    return `${utc.getUTCFullYear()}${String(utc.getUTCMonth() + 1).padStart(2, '0')}${String(utc.getUTCDate()).padStart(2, '0')}T${String(utc.getUTCHours()).padStart(2, '0')}${String(utc.getUTCMinutes()).padStart(2, '0')}${String(utc.getUTCSeconds()).padStart(2, '0')}Z`;
}

function escapeICS(value: string) {
    return value.replace(/[\\,\n;]/g, (match) => ({ '\\': '\\\\', ',': '\\,', ';': '\\;', '\n': '\\n' }[match] ?? match));
}

export default function AgendaDetail({ event }: AgendaDetailProps) {
    const { props } = usePage<PageProps>();
    const siteName = props?.settings?.site_name ?? 'SMK Negeri 10 Kuningan';
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
        description: event.description ?? undefined,
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
            ? `DESCRIPTION:${escapeICS(event.description.replace(/<[^>]+>/g, ''))}`
            : null,
        'END:VEVENT',
        'END:VCALENDAR',
    ].filter(Boolean);

    const icsContent = encodeURIComponent(icsLines.join('\r\n'));
    const icsHref = `data:text/calendar;charset=utf-8,${icsContent}`;

    return (
        <AppShell siteName={siteName}>
            <Head title={`${event.title} - ${siteName}`}>
                <meta name="description" content={event.description ?? event.title} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }} />
            </Head>

            <section className="bg-white">
                <div className="mx-auto w-full max-w-6xl px-4 py-10">
                    <Breadcrumbs
                        items={[
                            { label: 'Agenda', href: '/agenda' },
                            { label: event.title },
                        ]}
                    />
                    <header className="mt-4 border-b-4 border-[#1b57d6] pb-3">
                        <h1 className="text-xl font-semibold uppercase tracking-[0.2em] text-[#1b57d6]">{event.title}</h1>
                    </header>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                        <span>{formatDate(event.start_at)}</span>
                        {event.end_at ? <span>sampai {formatDate(event.end_at)}</span> : null}
                        {event.location ? <span>Lokasi: {event.location}</span> : null}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <a
                            href={icsHref}
                            download={`${event.slug}.ics`}
                            className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b2b7a]"
                        >
                            Tambah ke Kalender (.ics)
                        </a>
                    </div>
                    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        {event.description ? (
                            <div dangerouslySetInnerHTML={{ __html: event.description }} />
                        ) : (
                            <p>Deskripsi agenda belum tersedia.</p>
                        )}
                    </div>
                </div>
            </section>
        </AppShell>
    );
}
