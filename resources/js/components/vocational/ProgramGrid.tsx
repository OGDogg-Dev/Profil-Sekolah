import React from 'react';
import ProgramCard from '@/components/vocational/ProgramCard';
import type { VocationalProgram } from '@/features/vocational/types';

type ProgramGridProps = {
    items: VocationalProgram[];
};

export default function ProgramGrid({ items }: ProgramGridProps) {
    if (!items?.length) {
        return <p className="text-sm text-slate-500">Belum ada program yang ditampilkan.</p>;
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
                <ProgramCard key={item.slug} program={item} />
            ))}
        </div>
    );
}
