import { Head, usePage } from '@inertiajs/react';
import AppShell from '@/layouts/AppShell';
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

export default function NewsIndex({ posts }: NewsIndexProps) {
    const { props } = usePage<PageProps>();
    const siteName = props?.settings?.site_name ?? 'SMK Negeri 10 Kuningan';

    return (
        <AppShell siteName={siteName}>
            <Head title={`Berita - ${siteName}`}>
                <meta name="description" content={`Berita dan artikel terkini dari ${siteName}.`} />
            </Head>

            <section className="bg-white">
                <div className="mx-auto w-full max-w-6xl px-4 py-10">
                    <Breadcrumbs items={[{ label: 'Berita', href: '/berita' }]} />
                    <header className="mt-4 border-b-4 border-[#1b57d6] pb-3">
                        <h1 className="text-xl font-semibold uppercase tracking-[0.2em] text-[#1b57d6]">SMK Negeri 10 Kuningan</h1>
                        <p className="mt-2 text-sm text-slate-600">Where Tomorrow's Leaders Come Together</p>
                    </header>

                    <div className="mt-6 grid gap-8 lg:grid-cols-[2fr_1fr]">
                        <div className="space-y-4">
                            {posts.data.length ? (
                                posts.data.map((post) => (
                                    <article
                                        key={post.slug}
                                        className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[220px_1fr]"
                                    >
                                        <div className="relative h-44 rounded-xl bg-slate-200">
                                            {post.cover_url ? (
                                                <img src={post.cover_url} alt={post.title} className="h-full w-full rounded-xl object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">400 x 250</div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-lg font-semibold text-slate-900">
                                                <a href={`/berita/${post.slug}`} className="hover:text-[#1b57d6]">
                                                    {post.title}
                                                </a>
                                            </h2>
                                            <p className="text-sm text-slate-600">{post.excerpt}</p>
                                            <div className="flex items-center justify-between text-xs text-slate-500">
                                                <span>
                                                    {new Date(post.published_at ?? post.created_at ?? '').toLocaleDateString('id-ID', {
                                                        day: '2-digit',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                                <a
                                                    href={`/berita/${post.slug}`}
                                                    className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b2b7a]"
                                                >
                                                    Baca
                                                </a>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                                    Belum ada berita yang dipublikasikan.
                                </p>
                            )}
                            <Pagination links={posts.links} />
                        </div>
                        <aside className="space-y-4">
                            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Kategori Populer</h3>
                                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                    {['Pengumuman', 'Prestasi', 'Event', 'PPDB'].map((tag) => (
                                        <span key={tag} className="rounded-full bg-[#1b57d6]/10 px-3 py-1 font-semibold text-[#1b57d6]">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Terbaru</h3>
                                <ul className="mt-3 space-y-3 text-sm text-slate-600">
                                    {posts.data.slice(0, 5).map((post) => (
                                        <li key={`recent-${post.slug}`} className="border-b border-dashed border-slate-200 pb-2 last:border-0">
                                            <a href={`/berita/${post.slug}`} className="font-semibold text-[#1b57d6]">
                                                {post.title}
                                            </a>
                                            <p className="text-xs text-slate-500">
                                                {new Date(post.published_at ?? post.created_at ?? '').toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </AppShell>
    );
}
