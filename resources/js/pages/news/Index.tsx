import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarDays, Newspaper, Sparkles } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Pagination from '@/components/ui/Pagination';
import type { PostSummary } from '@/features/content/types';
import type { Paginated } from '@/features/common/types';

interface NewsIndexProps {
    posts: Paginated<PostSummary>;
}

type PageProps = {
    settings?: {
        site_name?: string;
    };
};

function parseDate(value?: string | null) {
    if (!value) {
        return null;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return parsed;
}

function formatDate(value?: string | null, options?: Intl.DateTimeFormatOptions) {
    const parsed = parseDate(value);

    if (!parsed) {
        return null;
    }

    return new Intl.DateTimeFormat('id-ID', options ?? {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(parsed);
}

const stopWords = new Set([
    'dan',
    'yang',
    'untuk',
    'dari',
    'pada',
    'dengan',
    'para',
    'serta',
    'dalam',
    'akan',
    'kami',
    'anda',
    'oleh',
    'ini',
    'itu',
    'sekolah',
    'smk',
    'negeri',
]);

export default function NewsIndex({ posts }: NewsIndexProps) {
    const { props } = usePage<PageProps>();
    const siteName = props?.settings?.site_name ?? 'SMK Negeri 10 Kuningan';

    const allPosts = posts.data ?? [];
    const [featuredPost, ...otherPosts] = allPosts;
    const summaryExcerpt = featuredPost?.excerpt ?? featuredPost?.title ?? `Berita dan artikel terkini dari ${siteName}.`;

    const validDates = allPosts
        .map((post) => parseDate(post.published_at ?? post.created_at ?? ''))
        .filter((value): value is Date => Boolean(value));

    const stats = validDates.reduce(
        (acc, date) => {
            if (!acc.latest || date > acc.latest) {
                acc.latest = date;
            }

            if (!acc.earliest || date < acc.earliest) {
                acc.earliest = date;
            }

            acc.months.add(new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date));
            return acc;
        },
        { latest: null as Date | null, earliest: null as Date | null, months: new Set<string>() },
    );

    const latestLabel = stats.latest ? formatDate(stats.latest.toISOString()) : null;
    const coverageRangeLabel =
        stats.earliest && stats.latest
            ? `${formatDate(stats.earliest.toISOString(), { month: 'short', year: 'numeric' })} - ${formatDate(stats.latest.toISOString(), { month: 'short', year: 'numeric' })}`
            : null;

    const keywordCounts = new Map<string, number>();
    allPosts.forEach((post) => {
        const tokens = `${post.title} ${post.excerpt ?? ''}`
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, ' ')
            .split(/\s+/)
            .map((token) => token.trim())
            .filter((token) => token.length >= 4 && !stopWords.has(token));

        tokens.forEach((token) => {
            keywordCounts.set(token, (keywordCounts.get(token) ?? 0) + 1);
        });
    });

    const trendingTopics = Array.from(keywordCounts.entries())
        .sort((a, b) => {
            if (b[1] === a[1]) {
                return a[0].localeCompare(b[0]);
            }
            return b[1] - a[1];
        })
        .slice(0, 6)
        .map(([token]) => token)
        .map((token) => token.replace(/\b\w/g, (char) => char.toUpperCase()));

    const fallbackTopics = ['Pembelajaran Inklusif', 'Prestasi Siswa', 'Kemitraan Industri', 'Kegiatan Sekolah'];
    const topicsToDisplay = trendingTopics.length > 0 ? trendingTopics : fallbackTopics;

    const quickPeekPosts = otherPosts.slice(0, 3);

    const postsForGrid = featuredPost ? otherPosts : allPosts;

    return (
        <PublicLayout siteName={siteName}>
            <Head title={`Berita - ${siteName}`}>
                <meta name="description" content={summaryExcerpt} />
            </Head>

            <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
                <div className="pointer-events-none absolute inset-0 opacity-40">
                    <div className="absolute -left-24 top-16 h-48 w-48 rounded-full bg-amber-400/30 blur-3xl" />
                    <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
                </div>
                <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-14 lg:pt-20">
                    <Breadcrumbs items={[{ label: 'Berita', href: '/berita' }]} variant="dark" className="text-slate-200" />
                    <div className="mt-10 grid gap-12 lg:grid-cols-[1.45fr_1fr] lg:items-start">
                        <header className="space-y-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Berita & Cerita</p>
                            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">Rangkuman Perjalanan Sekolah</h1>
                            <p className="max-w-2xl text-base text-slate-100 sm:text-lg">
                                {summaryExcerpt || `Ikuti kabar terbaru, cerita inspiratif, serta agenda penting dari ${siteName}.`}
                            </p>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                                    <div className="flex items-center gap-3 text-sm text-slate-100/80">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/20 text-amber-100">
                                            <Newspaper className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.3em] text-slate-200">Artikel</p>
                                            <p className="text-lg font-semibold text-white">{posts.total ?? allPosts.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                                    <div className="flex items-center gap-3 text-sm text-slate-100/80">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-100">
                                            <CalendarDays className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.3em] text-slate-200">Liputan Terbaru</p>
                                            <p className="text-lg font-semibold text-white">{latestLabel ?? 'Segera'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                                    <div className="flex items-center gap-3 text-sm text-slate-100/80">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-400/20 text-sky-100">
                                            <Sparkles className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.3em] text-slate-200">Kilas Balik</p>
                                            <p className="text-lg font-semibold text-white">{coverageRangeLabel ?? 'Menanti Arsip'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>
                        <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Sorotan Topik</p>
                                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-white/90">
                                    {topicsToDisplay.map((topic) => (
                                        <span key={topic} className="rounded-full border border-white/20 bg-white/10 px-3 py-1">
                                            #{topic}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Rentang Peliputan</p>
                                <p className="mt-3 text-sm text-slate-100">
                                    {stats.months.size > 0
                                        ? `Arsip berita mencakup ${stats.months.size} bulan berbeda dengan update terakhir ${latestLabel ?? 'segera hadir'}.`
                                        : 'Menanti publikasi perdana untuk mengisi arsip berita sekolah.'}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/profil"
                                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-200"
                                >
                                    Kenali Sekolah Lebih Dekat ↗
                                </Link>
                                <Link
                                    href="/kontak"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/60 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    Kolaborasi Peliputan
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <section className="bg-slate-50">
                <div className="mx-auto w-full max-w-6xl px-4 py-16">
                    {featuredPost ? (
                        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:items-start">
                            <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                                {featuredPost.cover_url ? (
                                    <div className="relative h-72 w-full bg-slate-200">
                                        <img
                                            src={featuredPost.cover_url}
                                            alt={featuredPost.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-72 w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
                                        Dokumentasi segera menyusul
                                    </div>
                                )}
                                <div className="space-y-4 px-6 pb-8 pt-6">
                                    <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-brand-600">
                                        <span className="rounded-full bg-brand-100 px-3 py-1 text-brand-700">Sorotan Utama</span>
                                        {formatDate(featuredPost.published_at ?? featuredPost.created_at ?? null, {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        }) ? (
                                            <span className="text-slate-500">
                                                {formatDate(featuredPost.published_at ?? featuredPost.created_at ?? null)}
                                            </span>
                                        ) : null}
                                    </div>
                                    <h2 className="text-2xl font-semibold text-slate-900">
                                        <Link href={`/berita/${featuredPost.slug}`} className="transition hover:text-brand-600">
                                            {featuredPost.title}
                                        </Link>
                                    </h2>
                                    {featuredPost.excerpt ? (
                                        <p className="text-base text-slate-600">{featuredPost.excerpt}</p>
                                    ) : null}
                                    <div className="flex flex-wrap gap-3">
                                        <Link
                                            href={`/berita/${featuredPost.slug}`}
                                            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                                        >
                                            Baca Selengkapnya
                                        </Link>
                                        <Link
                                            href="/agenda"
                                            className="inline-flex items-center gap-2 rounded-full border border-brand-200 px-5 py-2 text-sm font-semibold text-brand-600 transition hover:bg-brand-50"
                                        >
                                            Lihat Agenda Terkait
                                        </Link>
                                    </div>
                                </div>
                            </article>
                            <aside className="space-y-6">
                                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Sorotan Singkat</p>
                                    <ul className="mt-4 space-y-4 text-sm text-slate-600">
                                        {(quickPeekPosts.length > 0 ? quickPeekPosts : allPosts.slice(0, 3)).map((post) => (
                                            <li key={`quick-${post.slug}`} className="group space-y-1 border-b border-dashed border-slate-200 pb-3 last:border-0 last:pb-0">
                                                <Link href={`/berita/${post.slug}`} className="block font-semibold text-brand-600 transition group-hover:text-brand-700">
                                                    {post.title}
                                                </Link>
                                                {formatDate(post.published_at ?? post.created_at ?? null, {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                }) ? (
                                                    <p className="text-xs text-slate-500">
                                                        {formatDate(post.published_at ?? post.created_at ?? null, {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </p>
                                                ) : null}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-brand-50 via-white to-white p-6 shadow-sm">
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Butuh Publikasi?</p>
                                    <p className="mt-3 text-sm text-slate-600">
                                        Tim redaksi siap mendampingi unit dan komunitas sekolah untuk mendokumentasikan kegiatan penting.
                                    </p>
                                    <Link
                                        href="/kontak"
                                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                                    >
                                        Hubungi Kami
                                    </Link>
                                </div>
                            </aside>
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
                            <h2 className="text-lg font-semibold text-slate-700">Belum ada kabar terbaru</h2>
                            <p className="mt-3 text-sm">
                                Tim redaksi sedang menghimpun cerita terbaik. Silakan kembali dalam waktu dekat atau hubungi kami untuk kolaborasi.
                            </p>
                            <div className="mt-6 flex justify-center gap-3">
                                <Link
                                    href="/profil"
                                    className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                                >
                                    Telusuri Profil Sekolah
                                </Link>
                                <Link
                                    href="/kontak"
                                    className="inline-flex items-center gap-2 rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-600 transition hover:bg-brand-50"
                                >
                                    Ajukan Publikasi
                                </Link>
                            </div>
                        </div>
                    )}

                    {postsForGrid.length > 0 ? (
                        <div className="mt-16 space-y-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h3 className="text-2xl font-semibold text-slate-900">Artikel Terbaru</h3>
                                    <p className="text-sm text-slate-600">Kumpulan kabar yang siap dibagikan ke komunitas sekolah.</p>
                                </div>
                                <Link
                                    href="/agenda"
                                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 transition hover:border-brand-300 hover:text-brand-600"
                                >
                                    Lihat Agenda Sekolah
                                </Link>
                            </div>
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {postsForGrid.map((post) => (
                                    <article key={post.slug} className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                                        {post.cover_url ? (
                                            <div className="mb-4 h-44 overflow-hidden rounded-2xl bg-slate-100">
                                                <img src={post.cover_url} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                                            </div>
                                        ) : (
                                            <div className="mb-4 flex h-44 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-xs uppercase tracking-[0.3em] text-slate-400">
                                                Dokumentasi belum tersedia
                                            </div>
                                        )}
                                        <div className="flex flex-1 flex-col">
                                            {formatDate(post.published_at ?? post.created_at ?? null, {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                            }) ? (
                                                <p className="text-xs uppercase tracking-[0.3em] text-brand-600">
                                                    {formatDate(post.published_at ?? post.created_at ?? null)}
                                                </p>
                                            ) : null}
                                            <h4 className="mt-2 text-lg font-semibold text-slate-900">
                                                <Link href={`/berita/${post.slug}`} className="transition hover:text-brand-600">
                                                    {post.title}
                                                </Link>
                                            </h4>
                                            {post.excerpt ? <p className="mt-3 text-sm text-slate-600">{post.excerpt}</p> : null}
                                            <div className="mt-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
                                                <Link href={`/berita/${post.slug}`} className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-brand-700 transition hover:bg-brand-100">
                                                    Baca Artikel ↗
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <div className="mt-10">
                        <Pagination links={posts.links} />
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
