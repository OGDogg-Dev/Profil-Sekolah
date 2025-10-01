import React from 'react';
import Card from '@/components/ui/card';
import AccessibleVideo from '@/components/vocational/AccessibleVideo';
import type { MediaItem } from '@/features/vocational/types';

export default function MediaGallery({ items }: { items: MediaItem[] }) {
    if (!items?.length) {
        return null;
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
                <figure key={item.id} className="space-y-2">
                    {item.type === 'video' ? (
                        <AccessibleVideo item={item} />
                    ) : (
                        <Card className="overflow-hidden">
                            <img
                                src={item.url}
                                alt={item.alt || item.caption || 'Dokumentasi program vokasional'}
                                className="h-56 w-full object-cover"
                            />
                        </Card>
                    )}
                    {item.caption ? <figcaption className="text-xs text-slate-500">{item.caption}</figcaption> : null}
                </figure>
            ))}
        </div>
    );
}
