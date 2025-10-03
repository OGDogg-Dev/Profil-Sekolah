import React from 'react';
import Card from '@/components/ui/card';
import Pill from '@/components/ui/Pill';
import type { VocationalProgram } from '@/features/vocational/types';

export default function ProgramCard({ program }: { program: VocationalProgram }) {
    return (
        <Card className="flex h-full flex-col gap-4 p-6">
            <div>
                <h3 className="text-lg font-semibold text-slate-900">{program.title}</h3>
                {program.description && (
                    <p className="mt-2 line-clamp-3 text-sm text-slate-600">{program.description}</p>
                )}
            </div>
            {program.media && program.media.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                    {program.media.map((mediaItem) => (
                        mediaItem.type === 'image' ? (
                            <img
                                key={mediaItem.id}
                                src={mediaItem.url}
                                alt={mediaItem.alt ?? 'Media image'}
                                className="rounded-md object-cover w-full h-24"
                            />
                        ) : null
                    ))}
                </div>
            )}
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                {program.duration ? <Pill>Durasi: {program.duration}</Pill> : null}
                {program.schedule ? <Pill>Jadwal: {program.schedule}</Pill> : null}
            </div>
            <div className="mt-auto">
                <a
                    href={`/vokasional/${program.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:underline"
                >
                    Lihat detail
                    <span aria-hidden>?</span>
                </a>
            </div>
        </Card>
    );
}
