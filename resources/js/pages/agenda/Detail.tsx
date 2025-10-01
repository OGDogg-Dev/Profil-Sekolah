import React from 'react';
import { Head } from '@inertiajs/react';
import A11yToolbar from '@/components/layout/A11yToolbar';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/card';
import type { EventSummary } from '@/features/content/types';

interface AgendaDetailProps {
    event: EventSummary & {
        description?: string | null;
    };
}

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
    return `${dateStr} · ${timeStr}`;
}

export default function AgendaDetail({ event }: AgendaDetailProps) {
    const siteName = 'Vokasional Disabilitas';
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

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Head title={`${event.title} - ${siteName}`}>
                <meta name="description" content={event.description ?? event.title} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }} />
            </Head>
            <A11yToolbar />
            <Navbar schoolName={siteName} activeId="agenda" />
            <main id="main-content" className="space-y-12">
                <Section id="agenda-detail" className="space-y-6">
                    <Breadcrumbs
                        items={[
                            { label: 'Agenda', href: '/agenda' },
                            { label: event.title },
                        ]}
                    />
                    <header className="space-y-3">
                        <h1 className="text-3xl font-bold text-slate-900">{event.title}</h1>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                            <span>{formatDate(event.start_at)}</span>
                            {event.end_at ? <span>sampai {formatDate(event.end_at)}</span> : null}
                        </div>
                        {event.location ? (
                            <p className="text-sm font-medium text-slate-600">Lokasi: {event.location}</p>
                        ) : null}
                    </header>
                    <Card className="prose max-w-none bg-slate-50/60 p-6 text-slate-700">
                        {event.description ? (
                            <div dangerouslySetInnerHTML={{ __html: event.description }} />
                        ) : (
                            <p>Deskripsi agenda belum tersedia.</p>
                        )}
                    </Card>
                </Section>
            </main>
            <Footer siteName={siteName} />
        </div>
    );
}
