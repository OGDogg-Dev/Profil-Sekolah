import React from 'react';
import { NAV_LINKS } from '@/components/layout/navigation-links';

type FooterProps = {
    siteName?: string;
};

export default function Footer({ siteName = 'Vokasional Disabilitas' }: FooterProps) {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 text-sm text-slate-600 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                    <p className="text-base font-semibold text-slate-800">{siteName}</p>
                    <p className="text-slate-500">&copy; {year} {siteName}. Semua hak dilindungi.</p>
                    <p className="text-slate-400">Portal informasi vokasional inklusif untuk penyandang disabilitas.</p>
                </div>
                <nav aria-label="Tautan cepat" className="text-slate-600">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Tautan Cepat</p>
                    <ul className="grid gap-1 sm:grid-cols-2 md:grid-cols-1">
                        {NAV_LINKS.map((link) => (
                            <li key={link.id}>
                                <a
                                    href={link.href}
                                    className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-slate-600 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </footer>
    );
}
