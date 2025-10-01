import React from 'react';
import { MapPin } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import type { NavLink } from '@/components/layout/navigation-links';
import { NAV_LINKS } from '@/components/layout/navigation-links';

type NavbarProps = {
    schoolName: string;
    activeId?: string;
};

function isLinkActive(link: NavLink, currentPath: string, activeId?: string) {
    if (activeId) {
        return activeId === link.id;
    }

    if (link.href === '/') {
        return currentPath === '/';
    }

    return currentPath === link.href || currentPath.startsWith(`${link.href}/`);
}

export default function Navbar({ schoolName, activeId }: NavbarProps) {
    const initial = schoolName?.slice(0, 1).toUpperCase() || 'V';
    const { url } = usePage();
    const currentPath = url.split('?')[0];

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                <a href="/" className="flex items-center gap-3" aria-label="Beranda">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 font-bold text-white" aria-hidden>
                        {initial}
                    </div>
                    <span className="font-semibold text-slate-800">{schoolName}</span>
                </a>
                <nav className="hidden items-center gap-3 text-sm md:flex" aria-label="Navigasi utama">
                    {NAV_LINKS.map((item) => {
                        const active = isLinkActive(item, currentPath, activeId);
                        return (
                            <a
                                key={item.id}
                                href={item.href}
                                className={`rounded-xl px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                                    active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                {item.label}
                            </a>
                        );
                    })}
                </nav>
                <a
                    href="/hubungi-kami"
                    className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 md:hidden"
                >
                    <MapPin className="mr-2 inline" size={14} aria-hidden /> Hubungi Kami
                </a>
            </div>
        </header>
    );
}
