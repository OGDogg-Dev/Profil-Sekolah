import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import A11yToolbar from '@/components/layout/A11yToolbar';

interface AdminLayoutProps extends React.PropsWithChildren {
    title: string;
}

const NAV = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/pages', label: 'Pages' },
    { href: '/admin/posts', label: 'Berita' },
    { href: '/admin/events', label: 'Agenda' },
    { href: '/admin/vocational-programs', label: 'Vokasional' },
    { href: '/admin/albums', label: 'Galeri' },
    { href: '/admin/settings', label: 'Settings' },
    { href: '/admin/contacts', label: 'Kontak' },
];

export default function AdminLayout({ title, children }: AdminLayoutProps) {
    const { url, props } = usePage();
    const flash = (props as any)?.flash as { success?: string; error?: string } | undefined;

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <A11yToolbar />
            <div className="md:grid md:grid-cols-[240px_1fr]">
                <aside className="border-r bg-white p-4">
                    <div className="mb-4 text-lg font-bold">Admin Panel</div>
                    <nav className="space-y-1 text-sm">
                        {NAV.map((item) => {
                            const active = url === item.href || url.startsWith(`${item.href}/`);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`block rounded-xl px-3 py-2 font-medium transition ${
                                        active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>
                <main id="main-content" className="space-y-4 bg-slate-50 p-6">
                    <header className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
                    </header>
                    {flash?.success ? (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                            {flash.success}
                        </div>
                    ) : null}
                    {flash?.error ? (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
                            {flash.error}
                        </div>
                    ) : null}
                    <div className="space-y-4">{children}</div>
                </main>
            </div>
        </div>
    );
}
