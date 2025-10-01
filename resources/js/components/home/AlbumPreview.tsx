import React from 'react';
import Card from '@/components/ui/card';
import AccessibleVideo from '@/components/vocational/AccessibleVideo';
import type { AlbumSummary } from '@/features/content/types';

export default function AlbumPreview({ items }: { items: AlbumSummary[] }) {
    if (!items.length) {
        return <p className="text-sm text-slate-500">Belum ada galeri.</p>;
    }

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {items.map((album) => (
                <Card key={album.slug} className="overflow-hidden">
                    <a href={`/galeri/${album.slug}`} className="block">
                        {album.cover_url ? (
                            <img
                                src={album.cover_url}
                                alt={album.title}
                                className="h-40 w-full object-cover"
                                loading="lazy"
                            />
                        ) : album.media?.[0] ? (
                            album.media[0].type === 'image' ? (
                                <img
                                    src={album.media[0].url}
                                    alt={album.title}
                                    className="h-40 w-full object-cover"
                                />
                            ) : (
                                <AccessibleVideo item={album.media[0]} />
                            )
                        ) : null}
                    </a>
                    <div className="space-y-2 p-5">
                        <a
                            href={`/galeri/${album.slug}`}
                            className="text-base font-semibold text-slate-900 hover:underline"
                        >
                            {album.title}
                        </a>
                        {album.description ? (
                            <p className="text-sm text-slate-600 line-clamp-3">{album.description}</p>
                        ) : null}
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            {album.media_count ?? album.media?.length ?? 0} media
                        </p>
                    </div>
                </Card>
            ))}
        </div>
    );
}
