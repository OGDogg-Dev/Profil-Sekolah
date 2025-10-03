import { Head, usePage } from '@inertiajs/react';
import AppShell from '@/layouts/AppShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import type { Crumb } from '@/components/ui/Breadcrumbs';

type PageData = {
    title?: string;
    content?: string | null;
    slug?: string;
};

type PageProps = {
    settings?: {
        site_name?: string;
    };
};

export default function Profile({ page }: { page: PageData | null }) {
    const { props } = usePage<PageProps>();
    const siteName = props?.settings?.site_name ?? 'SMK Negeri 10 Kuningan';
    const title = page?.title ?? 'Profil Sekolah';
    const content = page?.content ?? '<p>Konten profil belum tersedia.</p>';

    const breadcrumbs: Crumb[] = [{ label: 'Profil', href: '/profil' }];

    return (
        <AppShell siteName={siteName}>
            <Head title={`${title} - ${siteName}`} />

            <section className="bg-white">
                <div className="mx-auto w-full max-w-6xl px-4 py-10">
                    <Breadcrumbs items={breadcrumbs} />
                    <header className="mt-4 border-b-4 border-[#1b57d6] pb-3">
                        <h1 className="text-xl font-semibold uppercase tracking-[0.2em] text-[#1b57d6]">{title}</h1>
                    </header>
                    <article
                        className="prose mt-6 max-w-none rounded-3xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </div>
            </section>
        </AppShell>
    );
}
