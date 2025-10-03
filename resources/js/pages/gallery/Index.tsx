import { Head, usePage } from '@inertiajs/react';
import AppShell from '@/layouts/AppShell';
import AlbumPreview from '@/components/home/AlbumPreview';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Pagination from '@/components/ui/Pagination';
import type { AlbumSummary } from '@/features/content/types';
import type { Paginated } from '@/features/common/types';

interface GalleryIndexProps {
    albums: Paginated<AlbumSummary>;
}

type PageProps = {
    settings?: {
        site_name?: string;
    };
};

export default function GalleryIndex({ albums }: GalleryIndexProps) {
    const { props } = usePage<PageProps>();
    const siteName = props?.settings?.site_name ?? 'SMK Negeri 10 Kuningan';

    return (
        <AppShell siteName={siteName}>
            <Head title={`Galeri - ${siteName}`}>
                <meta name="description" content={`Galeri foto dan dokumentasi kegiatan ${siteName}.`} />
            </Head>

            <section className="bg-white">
                <div className="mx-auto w-full max-w-6xl px-4 py-10">
                    <Breadcrumbs items={[{ label: 'Galeri', href: '/galeri' }]} />
                    <header className="mt-4 border-b-4 border-[#1b57d6] pb-3">
                        <h1 className="text-xl font-semibold uppercase tracking-[0.2em] text-[#1b57d6]">Galeri Kegiatan</h1>
                        <p className="mt-2 text-sm text-slate-600">Dokumentasi visual dari kelas, workshop, dan karya peserta vokasional.</p>
                    </header>
                    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <AlbumPreview items={albums.data} />
                    </div>
                    <div className="mt-6">
                        <Pagination links={albums.links} />
                    </div>
                </div>
            </section>
        </AppShell>
    );
}
