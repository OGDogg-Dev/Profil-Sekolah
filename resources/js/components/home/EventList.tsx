import React from 'react';
import Card from '@/components/ui/card';
import Pill from '@/components/ui/Pill';
import type { EventSummary } from '@/features/content/types';

function formatDateRange(start: string, end?: string | null) {
    const startDate = new Date(start);
    const startStr = startDate.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    if (!end) {
        return startStr;
    }

    const endDate = new Date(end);
    const sameDay = startDate.toDateString() === endDate.toDateString();

    if (sameDay) {
        const timeRange = `${startDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
        return `${startStr} · ${timeRange}`;
    }

    const endStr = endDate.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    return `${startStr} - ${endStr}`;
}

export default function EventList({ items }: { items: EventSummary[] }) {
    if (!items.length) {
        return <p className="text-sm text-slate-500">Belum ada agenda.</p>;
    }

    const now = new Date();

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {items.map((event) => {
                const upcoming = new Date(event.start_at) >= now;
                return (
                    <Card key={event.slug} className="flex h-full flex-col p-5">
                        <Pill className={upcoming ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-600'}>
                            {upcoming ? 'Mendatang' : 'Selesai'}
                        </Pill>
                        <a
                            href={`/agenda/${event.slug}`}
                            className="mt-3 text-lg font-semibold text-slate-900 hover:underline"
                        >
                            {event.title}
                        </a>
                        <p className="mt-2 text-sm font-medium text-slate-600">{formatDateRange(event.start_at, event.end_at)}</p>
                        {event.location ? (
                            <p className="text-sm text-slate-500">Lokasi: {event.location}</p>
                        ) : null}
                        {event.description ? (
                            <p className="mt-3 text-sm text-slate-600 line-clamp-3">{event.description}</p>
                        ) : null}
                        <a
                            href={`/agenda/${event.slug}`}
                            className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-slate-900 hover:underline"
                        >
                            Detail agenda <span aria-hidden>?</span>
                        </a>
                    </Card>
                );
            })}
        </div>
    );
}
