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
    variant?: 'light' | 'dark';
};

export default function Breadcrumbs({ items, className, variant = 'light' }: BreadcrumbsProps) {
    if (!items.length) {
        return null;
    }

    const navClass = cn(
        'flex items-center gap-2 text-sm text-slate-500',
        variant === 'dark' && 'text-slate-200',
        className,
    );

    const linkClass = cn(
        'inline-flex items-center gap-1 rounded-lg px-2 py-1 transition focus-visible:outline-none focus-visible:ring-2',
        variant === 'dark'
            ? 'text-white hover:bg-white/10 focus-visible:ring-white/40'
            : 'hover:bg-slate-100 focus-visible:ring-slate-400',
    );

    const crumbLinkClass = cn(
        'rounded-lg px-2 py-1 transition focus-visible:outline-none focus-visible:ring-2',
        variant === 'dark'
            ? 'text-slate-100 hover:bg-white/10 focus-visible:ring-white/40'
            : 'hover:bg-slate-100 focus-visible:ring-slate-400',
    );

    const lastCrumbClass = variant === 'dark' ? 'text-white' : 'text-slate-700';

    return (
        <nav aria-label="Breadcrumb" className={navClass}>
            <a href="/" className={linkClass}>
                <Home size={14} aria-hidden />
                <span>Beranda</span>
            </a>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                    <React.Fragment key={`${item.label}-${index}`}>
                        <span aria-hidden="true">/</span>
                        {isLast || !item.href ? (
                            <span className={lastCrumbClass}>{item.label}</span>
                        ) : (
                            <a
                                href={item.href}
                                className={crumbLinkClass}
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
