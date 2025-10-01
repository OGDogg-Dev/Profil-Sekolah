import React from 'react';
import { cn } from '@/lib/cn';

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginationProps = {
    links: PaginationLink[];
};

export default function Pagination({ links }: PaginationProps) {
    if (!links?.length || links.length <= 1) {
        return null;
    }

    return (
        <nav className="mt-6 flex flex-wrap items-center gap-2" aria-label="Pagination">
            {links.map((link, index) => {
                const label = link.label.replace('&laquo;', '«').replace('&raquo;', '»');
                const isDisabled = link.url === null;
                const isActive = link.active;

                return (
                    <a
                        key={`${label}-${index}`}
                        href={link.url ?? '#'}
                        className={cn(
                            'min-w-[2.5rem] rounded-lg border px-3 py-1 text-center text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400',
                            isActive && 'border-slate-900 bg-slate-900 text-white',
                            isDisabled && !isActive && 'cursor-not-allowed border-slate-200 text-slate-300',
                            !isActive && !isDisabled && 'border-slate-300 text-slate-700 hover:bg-slate-100',
                        )}
                        aria-current={isActive ? 'page' : undefined}
                        aria-disabled={isDisabled && !isActive}
                    >
                        {label}
                    </a>
                );
            })}
        </nav>
    );
}
