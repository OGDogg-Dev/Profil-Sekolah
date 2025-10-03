import { Head, usePage } from '@inertiajs/react';
import AppShell from '@/layouts/AppShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

interface VisionMissionProps {
    page: {
        title?: string;
        content?: string | null;
    } | null;
    vision?: string | null;
    missions?: string[];
}

type PageProps = {
    settings?: {
        site_name?: string;
    };
};

export default function VisionMission({ page, vision, missions = [] }: VisionMissionProps) {
    const { props } = usePage<PageProps>();
    const siteName = props?.settings?.site_name ?? 'SMK Negeri 10 Kuningan';
    const title = page?.title ?? 'Visi & Misi';

    return (
        <AppShell siteName={siteName}>
            <Head title={`${title} - ${siteName}`} />

            <section className="bg-white">
                <div className="mx-auto w-full max-w-6xl px-4 py-10">
                    <Breadcrumbs items={[{ label: 'Visi & Misi', href: '/visi-misi' }]} />
                    <header className="mt-4 border-b-4 border-[#1b57d6] pb-3">
                        <h1 className="text-xl font-semibold uppercase tracking-[0.2em] text-[#1b57d6]">{title}</h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Menjadi pusat vokasional inklusif yang memberdayakan peserta didik dengan berbagai kebutuhan khusus.
                        </p>
                    </header>
                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <div className="rounded-3xl border border-[#1b57d6]/30 bg-[#1b57d6]/5 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-[#1b57d6]">Visi</h2>
                            <p className="mt-3 leading-relaxed text-slate-700">{vision ?? 'Visi belum tersedia.'}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-[#1b57d6]">Misi</h2>
                            {missions.length ? (
                                <ol className="mt-3 space-y-3 text-slate-700">
                                    {missions.map((mission, index) => (
                                        <li key={index} className="flex gap-3">
                                            <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1b57d6] text-xs font-semibold text-white">
                                                {index + 1}
                                            </span>
                                            <span className="leading-relaxed">{mission}</span>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="mt-3 text-sm text-slate-500">Misi belum tersedia.</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </AppShell>
    );
}
