import { Head, usePage } from '@inertiajs/react';
import AppShell from '@/layouts/AppShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ProgramGrid from '@/components/vocational/ProgramGrid';
import type { VocationalProgram } from '@/features/vocational/types';

interface VocationalIndexProps {
    items: VocationalProgram[];
}

type PageProps = {
    settings?: {
        site_name?: string;
    };
};

export default function VocationalIndex({ items }: VocationalIndexProps) {
    const { props } = usePage<PageProps>();
    const siteName = props?.settings?.site_name ?? 'SMK Negeri 10 Kuningan';

    // Map photos array to media array for each vocational program
    const itemsWithMedia = items.map((item) => ({
        ...item,
        media: item.photos?.map((photo, index) => ({
            id: index + 1, // Using index as id
            type: 'image' as const,
            url: photo.startsWith('http') ? photo : `/storage/${photo}`,
            alt: item.title,
        })) ?? [],
    }));

    return (
        <AppShell siteName={siteName}>
            <Head title={`Program Vokasional - ${siteName}`} />

            <section className="bg-white">
                <div className="mx-auto w-full max-w-6xl px-4 py-10">
                    <Breadcrumbs items={[{ label: 'Vokasional', href: '/vokasional' }]} />
                    <header className="mt-4 border-b-4 border-[#1b57d6] pb-3">
                        <h1 className="text-xl font-semibold uppercase tracking-[0.2em] text-[#1b57d6]">SMK Negeri 10 Kuningan</h1>
                        <p className="mt-2 text-sm text-slate-600">Where Tomorrow's Leaders Come Together</p>
                    </header>
                    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <ProgramGrid items={itemsWithMedia} />
                    </div>
                </div>
            </section>
        </AppShell>
    );
}
