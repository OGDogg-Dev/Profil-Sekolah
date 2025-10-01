import React from 'react';
import type { MediaItem } from '@/features/vocational/types';

function toYoutubeEmbed(url: string): string {
    try {
        const parsed = new URL(url);
        if (parsed.hostname.includes('youtu.be')) {
            return `https://www.youtube.com/embed/${parsed.pathname.substring(1)}`;
        }
        if (parsed.hostname.includes('youtube.com')) {
            const videoId = parsed.searchParams.get('v');
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
            if (parsed.pathname.startsWith('/embed/')) {
                return url;
            }
        }
    } catch {
        // ignore malformed URL
    }
    return url;
}

export default function AccessibleVideo({ item }: { item: MediaItem }) {
    const title = item.caption || item.alt || 'Video program vokasional';
    const isYoutube = /youtube\.com|youtu\.be/.test(item.url);

    return (
        <div className="w-full overflow-hidden rounded-2xl border">
            {isYoutube ? (
                <iframe
                    src={toYoutubeEmbed(item.url)}
                    title={title}
                    className="h-56 w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                <video className="w-full" controls poster={item.poster ?? undefined}>
                    <source src={item.url} />
                    {item.track_vtt ? <track src={item.track_vtt} kind="captions" label="Teks" default /> : null}
                    Browser Anda tidak mendukung video.
                </video>
            )}
            {item.caption ? (
                <p className="px-3 py-2 text-xs text-slate-600">{item.caption}</p>
            ) : null}
        </div>
    );
}
