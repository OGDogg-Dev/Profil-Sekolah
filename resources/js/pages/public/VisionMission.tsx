import React from 'react';
import { Head } from '@inertiajs/react';
import A11yToolbar from '@/components/layout/A11yToolbar';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/card';

interface VisionMissionProps {
    page: {
        title?: string;
        content?: string | null;
    } | null;
    vision?: string | null;
    missions?: string[];
}

export default function VisionMission({ page, vision, missions = [] }: VisionMissionProps) {
    const title = page?.title ?? 'Visi & Misi';
    const siteName = 'Vokasional Disabilitas';

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Head title={`${title} - ${siteName}`} />
            <A11yToolbar />
            <Navbar schoolName={siteName} activeId="visi-misi" />
            <main id="main-content">
                <Section id="visi-misi" className="space-y-10">
                    <Breadcrumbs items={[{ label: 'Visi & Misi', href: '/visi-misi' }]} />
                    <header className="space-y-3">
                        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
                        <p className="text-slate-600">
                            Menjadi pusat vokasional inklusif yang memberdayakan peserta didik dengan berbagai kebutuhan khusus.
                        </p>
                    </header>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card className="space-y-3 border-emerald-100 bg-emerald-50 p-6">
                            <h2 className="text-xl font-semibold text-emerald-900">Visi</h2>
                            <p className="text-slate-700">{vision ?? 'Visi belum tersedia.'}</p>
                        </Card>
                        <Card className="space-y-4 p-6">
                            <h2 className="text-xl font-semibold text-slate-900">Misi</h2>
                            {missions.length ? (
                                <ol className="space-y-2 text-slate-700">
                                    {missions.map((mission, index) => (
                                        <li key={index} className="flex gap-3">
                                            <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                                                {index + 1}
                                            </span>
                                            <span>{mission}</span>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="text-sm text-slate-500">Misi belum tersedia.</p>
                            )}
                        </Card>
                    </div>
                </Section>
            </main>
            <Footer siteName={siteName} />
        </div>
    );
}
