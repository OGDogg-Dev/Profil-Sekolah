import { Head, usePage } from '@inertiajs/react';
import AppShell from '@/layouts/AppShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import MediaGallery from '@/components/vocational/MediaGallery';
import type { AlbumSummary } from '@/features/content/types';

interface GalleryDetailProps {
    album: AlbumSummary;
}

type PageProps = {
    settings?: {
        site_name?: string;
    };
};

export default function GalleryDetail({ album }: GalleryDetailProps) {
    const { props } = usePage<PageProps>();
    const siteName = props?.settings?.site_name ?? 'SMK Negeri 10 Kuningan';
    const description = album.description ?? `Album ${album.title} dari ${siteName}.`;

    return (
        <AppShell siteName={siteName}>
            <Head title={`${album.title} - ${siteName}`}>
                <meta name="description" content={description} />
            </Head>

            <section className="bg-white">
                <div className="mx-auto w-full max-w-6xl px-4 py-10">
                    <Breadcrumbs
                        items={[
                            { label: 'Galeri', href: '/galeri' },
                            { label: album.title },
                        ]}
                    />
                    <header className="mt-4 border-b-4 border-[#1b57d6] pb-3">
                        <h1 className="text-xl font-semibold uppercase tracking-[0.2em] text-[#1b57d6]">{album.title}</h1>
                    </header>
                    {album.description ? (
                        <p className="mt-4 text-sm text-slate-600">{album.description}</p>
                    ) : null}
                    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <MediaGallery items={album.media ?? []} />
                    </div>
                </div>
            </section>
        </AppShell>
    );
}
