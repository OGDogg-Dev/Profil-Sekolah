import { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { PublicLayout } from '@/layouts/public/PublicLayout';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import type { PostSummary } from '@/features/content/types';

type PostDetail = PostSummary & {
    content?: string | null;
};

interface NewsDetailProps {
    post: PostDetail;
    related: Array<{
        slug: string;
        title: string;
        published_at?: string | null;
    }>;
}

type PageProps = {
    settings?: {
        site_name?: string;
    };
};

export default function NewsDetail({ post, related }: NewsDetailProps) {
    const { props } = usePage<PageProps>();
    const siteName = props?.settings?.site_name ?? 'SMK Negeri 10 Kuningan';
    const description = post.excerpt ?? post.title;
    const [shareUrl, setShareUrl] = useState('');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        setShareUrl(window.location.href);

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const total = scrollHeight - clientHeight;
            const value = total > 0 ? (scrollTop / total) * 100 : 0;
            setProgress(Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description,
        datePublished: post.published_at ?? undefined,
        image: post.cover_url ? [post.cover_url] : undefined,
    };

    const shareLinks = shareUrl
        ? [
              {
                  label: 'Facebook',
                  href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
              },
              {
                  label: 'X / Twitter',
                  href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`,
              },
              {
                  label: 'WhatsApp',
                  href: `https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`,
              },
          ]
        : [];

    return (
        <PublicLayout>
            <Head title={`${post.title} - ${siteName}`}>
                <meta name="description" content={description} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
            </Head>

            <div className="fixed inset-x-0 top-0 z-50 h-1 bg-[#1b57d6]/20">
                <div className="h-full bg-[#1b57d6] transition-[width] duration-200" style={{ width: `${progress}%` }} />
            </div>

            <section className="bg-white">
                <div className="mx-auto w-full max-w-6xl px-4 py-10">
                    <Breadcrumbs
                        items={[
                            { label: 'Berita', href: '/berita' },
                            { label: post.title },
                        ]}
                    />
                    <header className="mt-4 border-b-4 border-[#1b57d6] pb-3">
                        <h1 className="text-xl font-semibold uppercase tracking-[0.2em] text-[#1b57d6]">{post.title}</h1>
                        {post.published_at ? (
                            <p className="mt-1 text-xs text-slate-500">
                                Dipublikasikan {new Date(post.published_at).toLocaleDateString('id-ID', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </p>
                        ) : null}
                    </header>
                    <article className="mt-6 space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        {post.cover_url ? (
                            <img src={post.cover_url} alt={post.title} className="w-full rounded-xl border border-slate-200 object-cover" />
                        ) : null}
                        <div
                            className="prose max-w-none text-slate-700"
                            dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
                        />
                        {shareLinks.length ? (
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <span>Bagikan:</span>
                                {shareLinks.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="rounded-full border border-slate-200 px-3 py-1 transition hover:border-[#1b57d6] hover:text-[#1b57d6]"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        ) : null}
                    </article>

                    {related.length ? (
                        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold uppercase tracking-[0.2em] text-[#1b57d6]">Berita Lainnya</h2>
                            <div className="mt-4 grid gap-4 md:grid-cols-3">
                                {related.map((item) => (
                                    <div key={item.slug} className="space-y-2 rounded-xl border border-slate-200 p-4">
                                        {item.published_at ? (
                                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                                {new Date(item.published_at).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        ) : null}
                                        <a href={`/berita/${item.slug}`} className="text-sm font-semibold text-[#1b57d6]">
                                            {item.title}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>
        </PublicLayout>
    );
}
