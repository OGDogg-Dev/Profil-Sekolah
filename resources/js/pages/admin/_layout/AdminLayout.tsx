import { useMemo, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    BriefcaseBusiness,
    CalendarDays,
    FileText,
    Image as ImageIcon,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageCircle,
    Newspaper,
    Settings,
    X,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { cn } from '@/lib/cn';

interface AdminLayoutProps extends React.PropsWithChildren {
    title: string;
}

type NavItem = {
    href: string;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const NAV_ITEMS: NavItem[] = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/pages', label: 'Pages', icon: FileText },
    { href: '/admin/posts', label: 'Berita', icon: Newspaper },
    { href: '/admin/events', label: 'Agenda', icon: CalendarDays },
    { href: '/admin/vocational-programs', label: 'Vokasional', icon: BriefcaseBusiness },
    { href: '/admin/albums', label: 'Galeri', icon: ImageIcon },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
    { href: '/admin/contacts', label: 'Kontak', icon: MessageCircle },
];

export default function AdminLayout({ title, children }: AdminLayoutProps) {
    const {
        url,
        props,
    } = usePage<{
        auth?: { user?: { name?: string; email?: string } };
        flash?: { success?: string; error?: string };
    }>();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const flash = props?.flash;
    const user = props?.auth?.user;

    const handleLogout = () => {
        router.post('/logout');
    };

    const isActive = useMemo(() => {
        return (href: string) => {
            // For Dashboard, only active if exact match
            if (href === '/admin') {
                return url === href;
            }
            // For other nav items, active if url equals or starts with href + '/'
            return url === href || url.startsWith(`${href}/`);
        };
    }, [url]);

    const renderNavItem = (item: NavItem) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                            active
                                ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900'
                                : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white',
                        )}
                    >
                        <Icon className="h-4 w-4" aria-hidden />
                        <span>{item.label}</span>
                    </Link>
        );
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white">
            <div className="flex min-h-screen overflow-hidden">
                <aside
                    className={cn(
                        'fixed inset-y-0 left-0 z-40 w-72 translate-x-[-100%] bg-slate-100 text-slate-900 p-6 shadow-xl transition-transform lg:static lg:translate-x-0 dark:bg-slate-950/98 dark:text-slate-100',
                        sidebarOpen && 'translate-x-0',
                    )}
                >
                    <div className="flex h-full flex-col gap-8">
                        <div className="flex items-center justify-between">
                            <Link href="/admin" className="flex items-center gap-3">
                                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-lg font-semibold text-slate-950">
                                    PS
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 dark:text-slate-300">
                                        Profil Sekolah
                                    </span>
                                    <span className="text-base font-semibold text-slate-900 dark:text-white">Admin Panel</span>
                                </div>
                            </Link>
                            <button
                                type="button"
                                className="p-2 text-slate-400 hover:text-slate-900 lg:hidden dark:text-slate-400 dark:hover:text-white"
                                onClick={() => setSidebarOpen(false)}
                                aria-label="Tutup menu"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <nav className="flex-1 space-y-1.5">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-500">Menu</p>
                            {NAV_ITEMS.map(renderNavItem)}
                        </nav>
                        <div className="space-y-4">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                                <p className="font-semibold text-slate-900 dark:text-white">Pusat Bantuan</p>
                                <p className="mt-2 leading-relaxed">
                                    Butuh dukungan? Hubungi tim kami atau baca dokumentasi internal.
                                </p>
                                <Link
                                    href="mailto:support@profilsekolah.test"
                                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white"
                                >
                                    support@profilsekolah.test
                                </Link>
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/15"
                            >
                                <LogOut className="h-4 w-4" aria-hidden /> Keluar
                            </button>
                        </div>
                    </div>
                </aside>

                {sidebarOpen ? (
                    <div
                        className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                        aria-hidden
                    />
                ) : null}

                <div className="relative flex flex-1 flex-col">
                    <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-slate-700/60 dark:bg-slate-800/80 dark:supports-[backdrop-filter]:bg-slate-800/70">
                        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-4">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200/70 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 lg:hidden dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                                onClick={() => setSidebarOpen(true)}
                                aria-label="Buka menu"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                            <div className="hidden flex-col lg:flex">
                                <span className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Admin</span>
                                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h1>
                            </div>
                            <div className="flex flex-1 items-center justify-end gap-3">
                                <div className="hidden w-full max-w-sm items-center gap-2 rounded-2xl border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm lg:flex dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="h-4 w-4"
                                        aria-hidden
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                                    </svg>
                                    <input
                                        type="search"
                                        placeholder="Cari modul atau konten"
                                        className="flex-1 bg-transparent outline-none"
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                                    aria-label="Notifikasi"
                                >
                                    <Bell className="h-5 w-5" />
                                </button>
                                <ThemeToggle />
                                <div className="hidden items-center gap-3 rounded-full border border-slate-200/70 bg-white px-3 py-1.5 shadow-sm lg:flex dark:border-slate-600 dark:bg-slate-700">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
                                        {user?.name ? user.name.slice(0, 1).toUpperCase() : 'A'}
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-semibold text-slate-900 dark:text-white">{user?.name ?? 'Admin'}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email ?? 'admin@example.com'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <main className="flex-1">
                        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                            {flash?.success ? (
                                <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/80 dark:text-emerald-300">
                                    {flash.success}
                                </div>
                            ) : null}
                            {flash?.error ? (
                                <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 dark:border-rose-700 dark:bg-rose-900/80 dark:text-rose-300">
                                    {flash.error}
                                </div>
                            ) : null}
                            <div className="space-y-6">{children}</div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
