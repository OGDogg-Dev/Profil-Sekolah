import React from 'react';
import { Home } from 'lucide-react';
import { cn } from '@/lib/cn';

export type Crumb = {
    label: string;
    href?: string;
};

type BreadcrumbsProps = {
    items: Crumb[];
    className?: string;
};

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    if (!items.length) {
        return null;
    }

    return (
        <nav
            aria-label="Breadcrumb"
            className={cn('flex items-center gap-2 text-sm text-slate-500', className)}
        >
            <a
                href="/"
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
                <Home size={14} aria-hidden />
                <span>Beranda</span>
            </a>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                    <React.Fragment key={`${item.label}-${index}`}>
                        <span aria-hidden="true">/</span>
                        {isLast || !item.href ? (
                            <span className="text-slate-700">{item.label}</span>
                        ) : (
                            <a
                                href={item.href}
                                className="rounded-lg px-2 py-1 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                            >
                                {item.label}
                            </a>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}
