import React from 'react';
import { cn } from '@/lib/cn';

type SectionProps = React.PropsWithChildren<{
    id: string;
    title?: string;
    className?: string;
    gray?: boolean;
}>;

export default function Section({ id, title, className = '', gray = false, children }: SectionProps) {
    return (
        <section id={id} className={cn('scroll-mt-24', gray ? 'bg-slate-50' : '')}>
            <div className="mx-auto max-w-7xl px-4 py-12">
                {title && <h2 className="mb-6 text-2xl font-semibold">{title}</h2>}
                <div className={className}>{children}</div>
            </div>
        </section>
    );
}
