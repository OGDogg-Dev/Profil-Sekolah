import { Head, router, usePage } from '@inertiajs/react';
import AppShell from '@/layouts/AppShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Pagination from '@/components/ui/Pagination';
import type { EventSummary } from '@/features/content/types';
import type { Paginated } from '@/features/common/types';

interface AgendaIndexProps {
    events: Paginated<EventSummary>;
    filters: {
        filter: string;
    };
}

type PageProps = {
    settings?: {
        site_name?: string;
    };
};

function formatRange(start: string, end?: string | null) {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : undefined;
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };

    if (!endDate) {
        return startDate.toLocaleDateString('id-ID', options);
    }

    const sameDay = startDate.toDateString() === endDate.toDateString();

    if (sameDay) {
        const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
        const startTime = startDate.toLocaleTimeString('id-ID', timeOptions);
        const endTime = endDate.toLocaleTimeString('id-ID', timeOptions);
        return `${startDate.toLocaleDateString('id-ID', options)} - ${startTime} s/d ${endTime}`;
    }

    return `${startDate.toLocaleDateString('id-ID', options)} - ${endDate.toLocaleDateString('id-ID', options)}`;
}

export default function AgendaIndex({ events, filters }: AgendaIndexProps) {
    const { props } = usePage<PageProps>();
    const siteName = props?.settings?.site_name ?? 'SMK Negeri 10 Kuningan';
    const activeFilter = filters.filter === 'past' ? 'past' : 'upcoming';

    return (
        <AppShell siteName={siteName}>
            <Head title={`Agenda - ${siteName}`}>
                <meta name="description" content={`Agenda kegiatan terbaru dari ${siteName}.`} />
            </Head>

            <section className="bg-white">
                <div className="mx-auto w-full max-w-6xl px-4 py-10">
                    <Breadcrumbs items={[{ label: 'Agenda', href: '/agenda' }]} />
                    <header className="mt-4 border-b-4 border-[#1b57d6] pb-3">
                        <h1 className="text-xl font-semibold uppercase tracking-[0.2em] text-[#1b57d6]">Agenda Kegiatan</h1>
                        <p className="mt-2 text-sm text-slate-600">Jadwal pelatihan, sosialisasi, dan agenda penting lainnya.</p>
                    </header>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => router.get('/agenda', { filter: 'upcoming' }, { preserveState: true, preserveScroll: true })}
                            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
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
                            onClick={() => router.get('/agenda', { filter: 'past' }, { preserveState: true, preserveScroll: true })}
                            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                                activeFilter === 'past'
                                    ? 'bg-[#1b57d6] text-white shadow'
                                    : 'border border-slate-300 text-slate-700 hover:border-[#1b57d6] hover:text-[#1b57d6]'
                            }`}
                            aria-pressed={activeFilter === 'past'}
                        >
                            Selesai
                        </button>
                    </div>

                    <div className="mt-6 space-y-4">
                        {events.data.length ? (
                            events.data.map((event) => {
                                const isUpcoming = new Date(event.start_at) >= new Date();
                                return (
                                    <article key={event.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                                                    isUpcoming ? 'bg-[#1b57d6]/10 text-[#1b57d6]' : 'bg-slate-200 text-slate-600'
                                                }`}>
                                                    {isUpcoming ? 'Mendatang' : 'Selesai'}
                                                </span>
                                                <h2 className="mt-2 text-lg font-semibold text-slate-900">
                                                    <a href={`/agenda/${event.slug}`} className="hover:text-[#1b57d6]">
                                                        {event.title}
                                                    </a>
                                                </h2>
                                            </div>
                                            <a
                                                href={`/agenda/${event.slug}`}
                                                className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b2b7a]"
                                            >
                                                Detail
                                            </a>
                                        </div>
                                        <p className="mt-3 text-sm font-medium text-slate-600">{formatRange(event.start_at, event.end_at)}</p>
                                        {event.location ? (
                                            <p className="text-sm text-slate-500">Lokasi: {event.location}</p>
                                        ) : null}
                                        {event.description ? (
                                            <p className="mt-3 text-sm text-slate-600">{event.description}</p>
                                        ) : null}
                                    </article>
                                );
                            })
                        ) : (
                            <p className="rounded-3xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                                Belum ada agenda pada kategori ini.
                            </p>
                        )}
                    </div>

                    <div className="mt-8">
                        <Pagination links={events.links} />
                    </div>
                </div>
            </section>
        </AppShell>
    );
}
