import React from 'react';
import { Head } from '@inertiajs/react';
import A11yToolbar from '@/components/layout/A11yToolbar';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Section from '@/components/ui/Section';
import type { Crumb } from '@/components/ui/Breadcrumbs';

type PageData = {
    title?: string;
    content?: string | null;
    slug?: string;
};

export default function Profile({ page }: { page: PageData | null }) {
    const title = page?.title ?? 'Profil Sekolah';
    const content = page?.content ?? '<p>Konten profil belum tersedia.</p>';
    const siteName = 'Vokasional Disabilitas';

    const breadcrumbs: Crumb[] = [
        { label: 'Profil', href: '/profil' },
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Head title={`${title} - ${siteName}`} />
            <A11yToolbar />
            <Navbar schoolName={siteName} activeId="profil" />
            <main id="main-content">
                <Section id="profil" className="space-y-8">
                    <Breadcrumbs items={breadcrumbs} />
                    <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
                    <article
                        className="prose max-w-none text-slate-700"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </Section>
            </main>
            <Footer siteName={siteName} />
        </div>
    );
}
