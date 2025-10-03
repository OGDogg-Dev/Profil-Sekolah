import NewsCard from '@/components/NewsCard';
import type { PostSummary } from '@/features/content/types';

export default function PostList({ items }: { items: PostSummary[] }) {
    if (!items.length) {
        return (
            <p className="rounded-2xl border border-dashed border-slate-200/70 bg-white/70 p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
                Belum ada berita.
            </p>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((post) => (
                <NewsCard
                    key={post.slug}
                    data={{
                        slug: post.slug,
                        title: post.title,
                        cover: post.cover_url ?? undefined,
                        date: post.published_at ?? post.created_at ?? new Date().toISOString(),
                        excerpt: post.excerpt,
                    }}
                />
            ))}
        </div>
    );
}
