import { Head, Link, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import AppShell from '@/layouts/AppShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

interface VisionMissionProps {
    page: {
        title?: string;
        content?: string | null;
        excerpt?: string | null;
        meta_description?: string | null;
    } | null;
    vision?: string | null;
    missions?: string[];
}

type PageProps = {
    settings?: {
        site_name?: string;
    };
};

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const removeSectionByHeading = (html: string, heading: string) => {
    const pattern = new RegExp(`<h[23][^>]*>\\s*${heading}[\\s\\S]*?(?=<h[23][^>]*>|$)`, 'i');
    return html.replace(pattern, '').trim();
};

export default function VisionMission({ page, vision, missions = [] }: VisionMissionProps) {
    const { props } = usePage<PageProps>();
    const siteName = props?.settings?.site_name ?? 'SMK Negeri 10 Kuningan';
    const title = page?.title ?? 'Visi & Misi';

    const defaultVision =
        'Menjadi pusat vokasional yang memerdekakan potensi setiap peserta didik melalui pembelajaran inklusif, kolaboratif, dan berdaya saing global.';
    const displayedVision = vision?.trim() || defaultVision;

    const defaultMissions = [
        'Menyelenggarakan layanan pendidikan yang adaptif terhadap kebutuhan setiap peserta didik.',
        'Membangun jejaring kolaborasi dengan dunia usaha, dunia industri, dan komunitas untuk memperkuat pengalaman belajar.',
        'Menciptakan budaya sekolah yang aman, suportif, dan menumbuhkan kemandirian.',
        'Mengintegrasikan teknologi serta pendekatan pembelajaran diferensiatif untuk mengoptimalkan potensi.',
    ];

    const missionItems = missions.length ? missions : defaultMissions;

    const heroSummary = (() => {
        const excerpt = page?.excerpt ?? '';
        const summary = stripHtml(excerpt) ||
            'Haluan visi dan misi kami berfokus pada pemberdayaan peserta didik berkebutuhan khusus agar siap berkiprah di masyarakat dan dunia kerja.';
        return summary;
    })();

    const description = page?.meta_description?.trim() || heroSummary;

    const additionalContent = useMemo(() => {
        if (!page?.content) {
            return null;
        }

        let cleaned = page.content;
        cleaned = removeSectionByHeading(cleaned, 'Visi');
        cleaned = removeSectionByHeading(cleaned, 'Misi');

        const textPreview = stripHtml(cleaned);
        if (!textPreview) {
            return null;
        }

        return cleaned;
    }, [page?.content]);

    const focusAreas = [
        {
            title: 'Pembelajaran Personal',
            description:
                'Pendekatan diferensiatif, asesmen autentik, dan dukungan interdisipliner memastikan setiap peserta didik bergerak sesuai ritmenya.',
        },
        {
            title: 'Sinergi Industri & Komunitas',
            description:
                'Kolaborasi intensif dengan mitra usaha, lembaga layanan, dan komunitas memfasilitasi praktik kerja serta penguatan soft skills.',
        },
        {
            title: 'Budaya Sekolah Inklusif',
            description:
                'Lingkungan yang aman, menghargai keberagaman, dan mengedepankan kesejahteraan menjadi pondasi tumbuhnya karakter mandiri.',
        },
    ];

    return (
        <AppShell siteName={siteName}>
            <Head title={`${title} - ${siteName}`}>
                <meta name="description" content={description} />
            </Head>

            <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
                <div className="pointer-events-none absolute inset-0 opacity-40">
                    <div className="absolute -left-20 top-10 h-40 w-40 rounded-full bg-emerald-400/30 blur-3xl" />
                    <div className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl" />
                </div>
                <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-14 lg:pt-20">
                    <Breadcrumbs
                        items={[{ label: 'Visi & Misi', href: '/visi-misi' }]}
                        variant="dark"
                        className="text-slate-200"
                    />
                    <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start">
                        <header className="space-y-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">Arah Pendidikan</p>
                            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{title}</h1>
                            <p className="max-w-2xl text-base text-slate-100 sm:text-lg">{heroSummary}</p>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/profil"
                                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-200"
                                >
                                    Telusuri Profil Sekolah ↗
                                </Link>
                                <Link
                                    href="/kontak"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/70 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    Kolaborasi dengan Kami
                                </Link>
                            </div>
                        </header>
                        <aside className="space-y-4 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">Pernyataan Visi</p>
                            <p className="text-lg font-semibold text-white">{displayedVision}</p>
                            <p className="text-sm text-slate-100/90">
                                Visi menjadi kompas dalam setiap program pembelajaran, layanan bimbingan, dan kemitraan strategis yang sekolah
                                hadirkan.
                            </p>
                        </aside>
                    </div>
                </div>
            </section>

            <section className="bg-white">
                <div className="mx-auto w-full max-w-6xl px-4 py-16">
                    <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">Misi Sekolah</h2>
                            <p className="mt-3 max-w-2xl text-base text-slate-600">
                                Misi berikut menjadi langkah nyata dalam mewujudkan visi sekolah melalui pembelajaran yang relevan dan dukungan yang
                                menyeluruh bagi peserta didik.
                            </p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600">Ikhtisar</p>
                            <p className="mt-3 text-sm text-slate-600">
                                {missions.length
                                    ? 'Data misi diambil langsung dari dokumen visi & misi sekolah dan diperbarui oleh tim pengelola konten.'
                                    : 'Daftar misi berikut merupakan gambaran umum arah kebijakan sekolah ketika konten resmi belum tersedia.'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 grid gap-6 md:grid-cols-2">
                        {missionItems.map((mission, index) => (
                            <div
                                key={`${index}-${mission.slice(0, 12)}`}
                                className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg font-semibold text-white">
                                    {index + 1}
                                </span>
                                <p className="text-base leading-relaxed text-slate-700">{mission}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-slate-50">
                <div className="mx-auto w-full max-w-6xl px-4 py-16">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {focusAreas.map((area) => (
                            <div key={area.title} className="flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="space-y-3">
                                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600">Fokus Implementasi</p>
                                    <h3 className="text-lg font-semibold text-slate-900">{area.title}</h3>
                                    <p className="text-sm text-slate-600">{area.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {additionalContent && (
                <section className="bg-white">
                    <div className="mx-auto w-full max-w-6xl px-4 py-16">
                        <article
                            className="prose prose-slate max-w-none rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
                            dangerouslySetInnerHTML={{ __html: additionalContent }}
                        />
                    </div>
                </section>
            )}
        </AppShell>
    );
}
