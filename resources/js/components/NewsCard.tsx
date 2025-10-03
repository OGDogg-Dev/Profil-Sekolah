import { Link } from '@inertiajs/react';

export type NewsCardData = {
    slug: string;
    title: string;
    cover?: string | null;
    date: string;
    excerpt?: string | null;
};

const FALLBACK_COVER = 'https://placehold.co/800x450?text=Berita';

export default function NewsCard({ data }: { data: NewsCardData }) {
    const cover = data.cover && data.cover.length > 0 ? data.cover : FALLBACK_COVER;
    const formattedDate = new Date(data.date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <Link
            href={`/berita/${data.slug}`}
            className="group block overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
        >
            <div className="aspect-[16/9] overflow-hidden">
                <img
                    src={cover}
                    alt={data.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                />
            </div>
            <div className="space-y-1.5 p-5">
                <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{formattedDate}</span>
                <h3 className="line-clamp-2 text-base font-semibold text-slate-900 transition group-hover:text-brand-600 dark:text-slate-100 dark:group-hover:text-brand-400">
                    {data.title}
                </h3>
                {data.excerpt && (
                    <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{data.excerpt}</p>
                )}
            </div>
        </Link>
    );
}
