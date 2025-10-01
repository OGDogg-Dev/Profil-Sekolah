import React from 'react';
import Card from '@/components/ui/card';
import Pill from '@/components/ui/Pill';
import type { PostSummary } from '@/features/content/types';

export default function PostList({ items }: { items: PostSummary[] }) {
    if (!items.length) {
        return <p className="text-sm text-slate-500">Belum ada berita.</p>;
    }

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {items.map((post) => (
                <Card key={post.slug} className="overflow-hidden">
                    {post.cover_url ? (
                        <a href={`/berita/${post.slug}`}>
                            <img
                                src={post.cover_url}
                                alt={post.title}
                                className="h-40 w-full object-cover"
                                loading="lazy"
                            />
                        </a>
                    ) : null}
                    <div className="space-y-3 p-5">
                        {post.published_at ? (
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                {new Date(post.published_at).toLocaleDateString('id-ID', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </p>
                        ) : null}
                        <a
                            href={`/berita/${post.slug}`}
                            className="text-base font-semibold text-slate-900 hover:underline"
                        >
                            {post.title}
                        </a>
                        {post.excerpt ? (
                            <p className="text-sm text-slate-600 line-clamp-3">{post.excerpt}</p>
                        ) : null}
                        <a
                            href={`/berita/${post.slug}`}
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 hover:underline"
                        >
                            Baca selengkapnya <span aria-hidden>?</span>
                        </a>
                    </div>
                </Card>
            ))}
        </div>
    );
}
