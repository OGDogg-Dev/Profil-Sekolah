import { useEffect, useMemo, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, Rss, Search, X } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

interface AppShellProps {
    children: React.ReactNode;
    siteName?: string;
    tagline?: string;
}

type NavItem = {
    id: string;
    label: string;
    href: string;
};

const NAV_ITEMS: NavItem[] = [
    { id: 'home', label: 'Beranda', href: '/' },
    { id: 'profil', label: 'Profil', href: '/profil' },
    { id: 'visi', label: 'Visi & Misi', href: '/visi-misi' },
    { id: 'program', label: 'Direktori Program', href: '/vokasional' },
    { id: 'berita', label: 'Berita', href: '/berita' },
    { id: 'agenda', label: 'Agenda', href: '/agenda' },
    { id: 'galeri', label: 'Galeri', href: '/galeri' },
    { id: 'kontak', label: 'Hubungi Kami', href: '/hubungi-kami' },
];

const INFO = {
    phone: '0232 123456',
    email: 'info@profilsekolah.test',
    address: 'Jl. Pendidikan No. 11, Kecamatan Kadugede, Kuningan',
};

export default function AppShell({ children, siteName, tagline }: AppShellProps) {
    const { url, props } = usePage<Record<string, unknown>>();
    const currentPath = useMemo(() => url.split('?')[0], [url]);

    const resolvedSiteName = (siteName || (props.settings as { site_name?: string } | undefined)?.site_name) ?? 'SMK Negeri 10 Kuningan';
    const resolvedTagline = (tagline || (props.settings as { tagline?: string } | undefined)?.tagline) ??
        'Where Tomorrow\'s Leaders Come Together';

    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setMobileOpen(false);
    }, [currentPath]);

    const year = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <header className="shadow-sm">
                <div className="bg-[#0f3bb2] text-white">
                    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
                        <Link href="/" className="flex items-center gap-4" aria-label={`Beranda ${resolvedSiteName}`}>
                            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
                                <span className="text-xl font-bold text-[#0f3bb2]">{resolvedSiteName.slice(0, 1)}</span>
                            </span>
                            <div>
                                <p className="text-lg font-semibold uppercase tracking-[0.12em]">{resolvedSiteName}</p>
                                <p className="text-[13px] font-medium text-white/80">{resolvedTagline}</p>
                            </div>
                        </Link>
                        <div className="flex flex-1 flex-col gap-3 text-sm text-white/90 md:flex-row md:items-center md:justify-end md:gap-6">
                            <span>Telp: <strong>{INFO.phone}</strong></span>
                            <span>Email: <strong>{INFO.email}</strong></span>
                            <Link href="#" className="inline-flex items-center gap-1 uppercase tracking-[0.2em] text-white/80 transition hover:text-white">
                                <Rss className="h-4 w-4" /> RSS
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#0f3bb2]/20 bg-[#1b57d6] text-white">
                    <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
                        <nav className="hidden flex-1 items-center gap-1 text-[13px] font-semibold uppercase tracking-[0.2em] md:flex">
                            {NAV_ITEMS.map((item) => {
                                const active = item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        data-active={active}
                                        className="rounded-md px-3 py-2 transition hover:bg-white/15 data-[active=true]:bg-white data-[active=true]:text-[#0f3bb2]"
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="hidden items-center gap-3 md:flex">
                            <form className="relative">
                                <input
                                    type="search"
                                    placeholder="Pencarian..."
                                    className="h-9 rounded-full border border-white/40 bg-white/20 px-9 text-xs font-medium text-white placeholder:text-white/70 focus:border-white focus:bg-white/30 focus:outline-none"
                                />
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/80" aria-hidden />
                            </form>
                            <ThemeToggle />
                        </div>
                        <button
                            type="button"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/30 bg-white/10 md:hidden"
                            onClick={() => setMobileOpen((prev) => !prev)}
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-nav"
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                    {mobileOpen ? (
                        <div id="mobile-nav" className="border-t border-white/20 bg-[#1b57d6] px-4 py-3 text-sm">
                            <nav className="space-y-1">
                                {NAV_ITEMS.map((item) => {
                                    const active = item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href);
                                    return (
                                        <Link
                                            key={item.id}
                                            href={item.href}
                                            data-active={active}
                                            className="block rounded-md px-3 py-2 font-semibold uppercase tracking-[0.2em] transition hover:bg-white/10 data-[active=true]:bg-white data-[active=true]:text-[#0f3bb2]"
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    ) : null}
                </div>
            </header>

            <main id="main-content" className="bg-white">
                {children}
            </main>

            <footer className="mt-12 border-t border-slate-200/80 bg-[#0f3bb2] text-white">
                <div className="bg-[#183b9b]">
                    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <p className="text-lg font-semibold uppercase tracking-[0.2em]">{resolvedSiteName}</p>
                            <p className="mt-3 text-sm text-white/80">{resolvedTagline}</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold uppercase tracking-[0.2em]">Alamat</p>
                            <p className="mt-3 text-sm text-white/80">{INFO.address}</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold uppercase tracking-[0.2em]">PPDB 2025</p>
                            <p className="mt-3 text-sm text-white/80">Dibuka untuk peserta baru. Klik tombol di bawah.</p>
                            <Link
                                href="#"
                                className="mt-4 inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-[#0f3bb2] shadow hover:bg-amber-300"
                            >
                                Daftar Sekarang
                            </Link>
                        </div>
                        <div>
                            <p className="text-lg font-semibold uppercase tracking-[0.2em]">Hubungi Kami</p>
                            <ul className="mt-3 space-y-2 text-sm text-white/80">
                                <li>Telp: {INFO.phone}</li>
                                <li>Fax: {INFO.phone}</li>
                                <li>Email: {INFO.email}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="bg-[#0b2b7a]">
                    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 text-sm text-white/80 md:grid-cols-4">
                        <div>
                            <p className="font-semibold uppercase tracking-[0.2em]">Hubungi Kami</p>
                            <p className="mt-3 text-xs leading-relaxed">Tersedia Senin-Jumat pukul 08.00-16.00 WIB.</p>
                        </div>
                        <div>
                            <p className="font-semibold uppercase tracking-[0.2em]">Tags</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {['Pengumuman', 'Sekilas Info', 'Berita'].map((tag) => (
                                    <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold uppercase tracking-[0.2em]">Ikuti Kami</p>
                            <div className="mt-3 flex gap-3 text-white">
                                {['facebook', 'twitter', 'instagram', 'youtube'].map((network) => (
                                    <span
                                        key={network}
                                        className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-xs uppercase tracking-[0.2em]"
                                    >
                                        {network.slice(0, 2)}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold uppercase tracking-[0.2em]">Berlangganan</p>
                            <form className="mt-3 space-y-3 text-xs">
                                <input
                                    type="email"
                                    placeholder="Alamat Email..."
                                    className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/60 focus:border-white focus:outline-none"
                                />
                                <button className="w-full rounded-md bg-amber-400 py-2 font-semibold uppercase tracking-[0.2em] text-[#0b2b7a] transition hover:bg-amber-300">
                                    Kirim
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="bg-[#081e5c] py-4 text-center text-xs text-white/60">
                    COPYRIGHT � {year} {resolvedSiteName}. Powered by Profil Sekolah.
                </div>
            </footer>
        </div>
    );
}
