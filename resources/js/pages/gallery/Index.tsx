import React from 'react';
import { Head } from '@inertiajs/react';
import A11yToolbar from '@/components/layout/A11yToolbar';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Pagination from '@/components/ui/Pagination';
import Section from '@/components/ui/Section';
import AlbumPreview from '@/components/home/AlbumPreview';
import type { AlbumSummary } from '@/features/content/types';
import type { Paginated } from '@/features/common/types';

interface GalleryIndexProps {
    albums: Paginated<AlbumSummary>;
}

export default function GalleryIndex({ albums }: GalleryIndexProps) {
    const siteName = 'Vokasional Disabilitas';

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Head title={`Galeri - ${siteName}`}>
                <meta name="description" content={`Galeri foto dan video kegiatan ${siteName}.`} />
            </Head>
            <A11yToolbar />
            <Navbar schoolName={siteName} activeId="galeri" />
            <main id="main-content" className="space-y-12">
                <Section id="galeri" className="space-y-6">
                    <Breadcrumbs items={[{ label: 'Galeri', href: '/galeri' }]} />
                    <header className="space-y-3">
                        <h1 className="text-3xl font-bold text-slate-900">Galeri Kegiatan</h1>
                        <p className="text-slate-600">Dokumentasi visual dari kelas, workshop, dan karya peserta vokasional.</p>
                    </header>
                    <AlbumPreview items={albums.data} />
                    <Pagination links={albums.links} />
                </Section>
            </main>
            <Footer siteName={siteName} />
        </div>
    );
}
