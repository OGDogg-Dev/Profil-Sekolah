import React from 'react';
import { Head } from '@inertiajs/react';
import A11yToolbar from '@/components/layout/A11yToolbar';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/card';
import MediaGallery from '@/components/vocational/MediaGallery';
import type { AlbumSummary } from '@/features/content/types';

interface GalleryDetailProps {
    album: AlbumSummary;
}

export default function GalleryDetail({ album }: GalleryDetailProps) {
    const siteName = 'Vokasional Disabilitas';
    const description = album.description ?? `Album ${album.title} dari ${siteName}.`;

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Head title={`${album.title} - ${siteName}`}>
                <meta name="description" content={description} />
            </Head>
            <A11yToolbar />
            <Navbar schoolName={siteName} activeId="galeri" />
            <main id="main-content" className="space-y-12">
                <Section id="galeri-detail" className="space-y-6">
                    <Breadcrumbs
                        items={[
                            { label: 'Galeri', href: '/galeri' },
                            { label: album.title },
                        ]}
                    />
                    <header className="space-y-3">
                        <h1 className="text-3xl font-bold text-slate-900">{album.title}</h1>
                        {album.description ? (
                            <Card className="border-slate-200 bg-slate-50/60 p-5 text-sm text-slate-600">
                                {album.description}
                            </Card>
                        ) : null}
                    </header>
                    <MediaGallery items={album.media ?? []} />
                </Section>
            </main>
            <Footer siteName={siteName} />
        </div>
    );
}
