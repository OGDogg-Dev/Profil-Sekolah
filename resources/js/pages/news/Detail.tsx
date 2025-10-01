import React from 'react';
import { Head } from '@inertiajs/react';
import A11yToolbar from '@/components/layout/A11yToolbar';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/card';
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

export default function NewsDetail({ post, related }: NewsDetailProps) {
    const siteName = 'Vokasional Disabilitas';
    const description = post.excerpt ?? post.title;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://example.com/berita/${post.slug}`;

    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description,
        datePublished: post.published_at ?? undefined,
        image: post.cover_url ? [post.cover_url] : undefined,
    };

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Head title={`${post.title} - ${siteName}`}>
                <meta name="description" content={description} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
            </Head>
            <A11yToolbar />
            <Navbar schoolName={siteName} activeId="berita" />
            <main id="main-content" className="space-y-12">
                <Section id="berita-detail" className="space-y-8">
                    <Breadcrumbs
                        items={[
                            { label: 'Berita', href: '/berita' },
                            { label: post.title },
                        ]}
                    />
                    <article className="space-y-6">
                        <header className="space-y-3">
                            <h1 className="text-3xl font-bold leading-tight text-slate-900">{post.title}</h1>
                            {post.published_at ? (
                                <p className="text-sm text-slate-500">
                                    Dipublikasikan{' '}
                                    {new Date(post.published_at).toLocaleDateString('id-ID', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            ) : null}
                        </header>
                        {post.cover_url ? (
                            <img src={post.cover_url} alt={post.title} className="w-full rounded-2xl object-cover" />
                        ) : null}
                        <div
                            className="prose max-w-none text-slate-700"
                            dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
                        />
                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                            <span>Bagikan:</span>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                className="rounded-lg px-3 py-1 hover:bg-slate-100"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Facebook
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                                className="rounded-lg px-3 py-1 hover:bg-slate-100"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                X / Twitter
                            </a>
                            <a
                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`}
                                className="rounded-lg px-3 py-1 hover:bg-slate-100"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </article>
                    {related.length ? (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-slate-900">Berita Lainnya</h2>
                            <div className="grid gap-3 md:grid-cols-3">
                                {related.map((item) => (
                                    <Card key={item.slug} className="p-4">
                                        {item.published_at ? (
                                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                                {new Date(item.published_at).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        ) : null}
                                        <a
                                            href={`/berita/${item.slug}`}
                                            className="mt-2 block text-sm font-semibold text-slate-900 hover:underline"
                                        >
                                            {item.title}
                                        </a>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </Section>
            </main>
            <Footer siteName={siteName} />
        </div>
    );
}
