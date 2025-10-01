import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import A11yToolbar from '@/components/layout/A11yToolbar';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Pagination from '@/components/ui/Pagination';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/card';
import Pill from '@/components/ui/Pill';
import type { EventSummary } from '@/features/content/types';
import type { Paginated } from '@/features/common/types';

interface AgendaIndexProps {
    events: Paginated<EventSummary>;
    filters: {
        filter: string;
    };
}

function formatRange(start: string, end?: string | null) {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : undefined;
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    if (!endDate) {
        return startDate.toLocaleDateString('id-ID', options);
    }
    const sameDay = startDate.toDateString() === endDate.toDateString();
    if (sameDay) {
        return `${startDate.toLocaleDateString('id-ID', options)} · ${startDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return `${startDate.toLocaleDateString('id-ID', options)} - ${endDate.toLocaleDateString('id-ID', options)}`;
}

export default function AgendaIndex({ events, filters }: AgendaIndexProps) {
    const siteName = 'Vokasional Disabilitas';
    const activeFilter = filters.filter === 'past' ? 'past' : 'upcoming';
    usePage();

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Head title={`Agenda - ${siteName}`}>
                <meta name="description" content={`Agenda kegiatan terbaru dari ${siteName}.`} />
            </Head>
            <A11yToolbar />
            <Navbar schoolName={siteName} activeId="agenda" />
            <main id="main-content" className="space-y-12">
                <Section id="agenda" className="space-y-6">
                    <Breadcrumbs items={[{ label: 'Agenda', href: '/agenda' }]} />
                    <header className="space-y-3 md:flex md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Agenda Kegiatan</h1>
                            <p className="text-slate-600">Jadwal pelatihan, sosialisasi, dan agenda penting lainnya.</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => router.get('/agenda', { filter: 'upcoming' }, { preserveState: true })}
                                className={`rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                                    activeFilter === 'upcoming' ? 'bg-slate-900 text-white' : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                                }`}
                                aria-pressed={activeFilter === 'upcoming'}
                            >
                                Mendatang
                            </button>
                            <button
                                type="button"
                                onClick={() => router.get('/agenda', { filter: 'past' }, { preserveState: true })}
                                className={`rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                                    activeFilter === 'past' ? 'bg-slate-900 text-white' : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                                }`}
                                aria-pressed={activeFilter === 'past'}
                            >
                                Selesai
                            </button>
                        </div>
                    </header>
                    <div className="space-y-4">
                        {events.data.length ? (
                            events.data.map((event) => {
                                const isUpcoming = new Date(event.start_at) >= new Date();
                                return (
                                    <Card key={event.slug} className="flex flex-col gap-3 p-6 md:flex-row md:items-start md:justify-between">
                                        <div className="space-y-3">
                                            <Pill className={isUpcoming ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-100 text-slate-600'}>
                                                {isUpcoming ? 'Mendatang' : 'Selesai'}
                                            </Pill>
                                            <a
                                                href={`/agenda/${event.slug}`}
                                                className="text-xl font-semibold text-slate-900 hover:underline"
                                            >
                                                {event.title}
                                            </a>
                                            <p className="text-sm font-medium text-slate-600">{formatRange(event.start_at, event.end_at)}</p>
                                            {event.location ? (
                                                <p className="text-sm text-slate-500">Lokasi: {event.location}</p>
                                            ) : null}
                                            {event.description ? (
                                                <p className="text-sm text-slate-600 line-clamp-3">{event.description}</p>
                                            ) : null}
                                        </div>
                                        <a
                                            href={`/agenda/${event.slug}`}
                                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:underline"
                                        >
                                            Lihat detail <span aria-hidden>?</span>
                                        </a>
                                    </Card>
                                );
                            })
                        ) : (
                            <p className="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                                Belum ada agenda pada kategori ini.
                            </p>
                        )}
                    </div>
                    <Pagination links={events.links} />
                </Section>
            </main>
            <Footer siteName={siteName} />
        </div>
    );
}
