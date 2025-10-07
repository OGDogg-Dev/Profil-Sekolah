import { Head, Link, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import PublicLayout from '@/layouts/public/PublicLayout';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import type { Crumb } from '@/components/ui/Breadcrumbs';

type PageData = {
    title?: string;
    content?: string | null;
    slug?: string;
    excerpt?: string | null;
    meta_description?: string | null;
};

type PageProps = {
    settings?: {
        site_name?: string;
    };
};

type Heading = {
    level: number;
    text: string;
    slug: string;
};

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const slugify = (value: string) =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/[-\s]+/g, '-');

const enhanceContent = (rawHtml: string) => {
    const headings: Heading[] = [];
    const headingPattern = /<h([2-4])([^>]*)>([\s\S]*?)<\/h\1>/gi;

    const htmlWithAnchors = rawHtml.replace(headingPattern, (_match, level, rawAttrs, innerHtml) => {
        const textContent = stripHtml(innerHtml);
        const fallbackSlug = slugify(textContent || `bagian-${headings.length + 1}`);
        const idMatch = rawAttrs.match(/id="([^"]+)"/i);
        const existingId = idMatch?.[1];

        let slug = existingId ?? fallbackSlug;
        let suffix = 2;
        while (headings.some((heading) => heading.slug === slug)) {
            slug = `${fallbackSlug}-${suffix}`;
            suffix += 1;
        }

        headings.push({ level: Number(level), text: textContent, slug });

        const hasId = Boolean(existingId);
        const attrs = hasId ? rawAttrs : `${rawAttrs} id="${slug}"`;

        return `<h${level}${attrs}>${innerHtml}</h${level}>`;
    });

    return { html: htmlWithAnchors, headings };
};

export default function Profile({ page }: { page: PageData | null }) {
    const { props } = usePage<PageProps>();
    const siteName = props?.settings?.site_name ?? 'SMK Negeri 10 Kuningan';
    const title = page?.title ?? 'Profil Sekolah';
    const content = page?.content ?? '<p>Konten profil belum tersedia.</p>';

    const { html: enhancedContent, headings } = useMemo(() => enhanceContent(content), [content]);

    const introText = useMemo(() => {
        const source = page?.excerpt ?? stripHtml(content);
        const sentences = source.split(/(?<=[.!?])\s+/).filter(Boolean);
        const preview = sentences.slice(0, 2).join(' ');
        return preview || 'Membangun lingkungan belajar vokasional yang inklusif, adaptif, dan kolaboratif untuk setiap peserta didik.';
    }, [content, page?.excerpt]);

    const description = page?.meta_description ?? introText;

    const valueHighlights = [
        {
            title: 'Inklusif dan Adaptif',
            description:
                'Kami memastikan setiap peserta didik mendapatkan akses terhadap kurikulum yang relevan dengan dukungan yang sesuai kebutuhan.',
        },
        {
            title: 'Kolaborasi Industri',
            description:
                'Program kemitraan dengan dunia usaha dan dunia industri dirancang untuk menghadirkan pengalaman belajar kontekstual.',
        },
        {
            title: 'Budaya Sekolah Positif',
            description:
                'Lingkungan sekolah dibangun di atas rasa saling menghargai, keselamatan, dan pendampingan berkelanjutan.',
        },
    ];

    const servicePillars = [
        {
            label: 'Layanan Bimbingan Individual',
            detail: 'Pendampingan personal bagi peserta didik berkebutuhan khusus untuk merancang strategi belajar yang efektif.',
        },
        {
            label: 'Penguatan Kompetensi',
            detail: 'Pelatihan vokasional berbasis proyek dan praktik industri untuk membangun keterampilan siap kerja.',
        },
        {
            label: 'Komunitas Orang Tua',
            detail: 'Forum komunikasi intensif antara sekolah dan keluarga demi terciptanya kolaborasi pendidikan yang harmonis.',
        },
    ];

    const breadcrumbs: Crumb[] = [{ label: 'Profil', href: '/profil' }];

    return (
        <PublicLayout siteName={siteName}>
            <Head title={`${title} - ${siteName}`}>
                <meta name="description" content={description} />
            </Head>

            <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
                <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-14 lg:pt-20">
                    <Breadcrumbs items={breadcrumbs} variant="dark" className="text-slate-200" />
                    <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start">
                        <header className="space-y-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">Profil Sekolah</p>
                            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{title}</h1>
                            <p className="max-w-2xl text-base text-slate-100 sm:text-lg">{introText}</p>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/visi-misi"
                                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-200"
                                >
                                    Lihat Visi &amp; Misi ↗
                                </Link>
                                <Link
                                    href="/kontak"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/70 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    Terhubung dengan Kami
                                </Link>
                            </div>
                        </header>
                        <aside className="space-y-4 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">Sorotan Nilai</p>
                            <ul className="space-y-4 text-sm text-slate-100">
                                {valueHighlights.map((highlight) => (
                                    <li key={highlight.title} className="space-y-1">
                                        <p className="font-semibold text-white">{highlight.title}</p>
                                        <p>{highlight.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </aside>
                    </div>
                </div>
            </section>

            <section className="bg-slate-50">
                <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-16 pt-12 lg:grid-cols-[1fr_280px]">
                    <article
                        className="prose prose-slate max-w-none rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
                        dangerouslySetInnerHTML={{ __html: enhancedContent }}
                    />
                    <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Navigasi Cepat</p>
                            {headings.length > 0 ? (
                                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                                    {headings.map((heading) => {
                                        const indentClass =
                                            heading.level === 2 ? 'pl-0' : heading.level === 3 ? 'pl-4' : 'pl-8';

                                        return (
                                            <li key={heading.slug} className={indentClass}>
                                                <a
                                                    href={`#${heading.slug}`}
                                                    className="inline-flex items-center gap-2 text-slate-700 transition hover:text-brand-600"
                                                >
                                                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden />
                                                    {heading.text}
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="mt-4 text-sm text-slate-500">Bagian profil akan diperbarui secara berkala.</p>
                            )}
                        </div>
                        <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Layanan Utama</p>
                            <ul className="space-y-3 text-sm text-slate-600">
                                {servicePillars.map((pillar) => (
                                    <li key={pillar.label} className="space-y-1">
                                        <p className="font-semibold text-slate-900">{pillar.label}</p>
                                        <p>{pillar.detail}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>
            </section>
        </PublicLayout>
    );
}
