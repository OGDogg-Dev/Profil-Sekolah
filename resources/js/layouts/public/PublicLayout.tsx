import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    Home,
    Image as ImageIcon,
    Layers,
    LucideIcon,
    Mail,
    MapPin,
    Menu,
    MessageCircle,
    Newspaper,
    Phone,
    Target,
    User,
    X,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

interface PublicLayoutProps {
    children: ReactNode;
    siteName?: string | null;
    tagline?: string | null;
}

type SocialLink = {
    label?: string | null;
    url?: string | null;
    icon?: string | null;
};

type FooterHour = {
    day?: string | null;
    label?: string | null;
    open?: string | null;
    close?: string | null;
    value?: string | null;
};

type SharedSettings = {
    name?: string | null;
    tagline?: string | null;
    logo_url?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    email?: string | null;
    address?: string | null;
    social?: SocialLink[] | null;
    footer_hours?: FooterHour[] | null;
};

type SharedProps = {
    settings?: SharedSettings | null;
};

type NavItem = {
    id: string;
    label: string;
    href: string;
    icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
    { id: 'home', label: '', href: '/', icon: Home },
    { id: 'profil', label: '', href: '/profil', icon: User },
    { id: 'visi', label: '', href: '/visi-misi', icon: Target },
    { id: 'program', label: '', href: '/vokasional', icon: Layers },
    { id: 'berita', label: '', href: '/berita', icon: Newspaper },
    { id: 'agenda', label: '', href: '/agenda', icon: CalendarDays },
    { id: 'galeri', label: '', href: '/galeri', icon: ImageIcon },
    
];

export default function PublicLayout({ children, siteName, tagline }: PublicLayoutProps) {
    const { url, props } = usePage<SharedProps>();
    const currentPath = useMemo(() => url.split('?')[0], [url]);
    const sharedSettings = props.settings ?? undefined;

    const resolvedSiteName = siteName ?? sharedSettings?.name ?? 'Sekolah Inklusif';
    const resolvedTagline = tagline ?? sharedSettings?.tagline ?? 'Membangun masa depan yang ramah untuk semua.';
    const logoUrl = sharedSettings?.logo_url ?? null;

    const phone = sharedSettings?.phone ?? sharedSettings?.whatsapp ?? null;
    const email = sharedSettings?.email ?? null;
    const address = sharedSettings?.address ?? null;
    const socialLinks = (sharedSettings?.social ?? []).filter((link): link is SocialLink & { url: string } =>
        Boolean(link?.url)
    );
    const footerHours = (sharedSettings?.footer_hours ?? []).filter(Boolean);

    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setMobileOpen(false);
    }, [currentPath]);

    const whatsappNumber = sharedSettings?.whatsapp?.replace(/[^0-9]/g, '') ?? null;
    const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : '/hubungi-kami';
    const whatsappLabel = whatsappNumber ? 'WhatsApp' : 'Hubungi Kami';

    const year = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
                    <Link href="/" className="flex items-center gap-3" aria-label={`Beranda ${resolvedSiteName}`}>
                        <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
                            {logoUrl ? (
                                <img src={logoUrl} alt={`Logo ${resolvedSiteName}`} className="h-full w-full object-contain" />
                            ) : (
                                <span className="text-lg font-semibold text-emerald-600">{resolvedSiteName.slice(0, 1)}</span>
                            )}
                        </span>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Profil Sekolah</span>
                            <span className="text-lg font-semibold text-slate-900">{resolvedSiteName}</span>
                            <span className="text-xs text-slate-500">{resolvedTagline}</span>
                        </div>
                    </Link>
                    <div className="hidden items-center gap-8 md:flex">
                        <nav className="flex items-end gap-3">
                            {NAV_ITEMS.map((item) => {
                                const active = item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href);
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        aria-current={active ? 'page' : undefined}
                                        data-active={active}
                                        className="group flex flex-col items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 transition hover:text-emerald-600"
                                    >
                                        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition group-data-[active=true]:border-emerald-500 group-data-[active=true]:text-emerald-600 group-hover:border-emerald-400 group-hover:text-emerald-600">
                                            <Icon className="h-5 w-5" aria-hidden />
                                        </span>
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <Link
                                href={whatsappHref}
                                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                            >
                                <MessageCircle className="h-4 w-4" aria-hidden />
                                {whatsappLabel}
                            </Link>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 md:hidden"
                        onClick={() => setMobileOpen((prev) => !prev)}
                        aria-expanded={mobileOpen}
                        aria-controls="public-mobile-nav"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
                {mobileOpen ? (
                    <div id="public-mobile-nav" className="border-t border-slate-200 bg-white px-4 pb-4">
                        <nav className="grid grid-cols-2 gap-2 text-sm font-semibold text-slate-600">
                            {NAV_ITEMS.map((item) => {
                                const active = item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href);
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        data-active={active}
                                        className="group inline-flex flex-col items-start gap-2 rounded-md border border-slate-200 px-3 py-3 transition hover:border-emerald-400 hover:bg-emerald-50 data-[active=true]:border-emerald-500 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700"
                                    >
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-inner group-data-[active=true]:text-emerald-600">
                                            <Icon className="h-5 w-5" aria-hidden />
                                        </span>
                                        <span className="text-xs font-semibold uppercase tracking-[0.2em]">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                        <Link
                            href={whatsappHref}
                            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                        >
                            <MessageCircle className="h-4 w-4" aria-hidden />
                            {whatsappLabel}
                        </Link>
                    </div>
                ) : null}
            </header>

            <main id="main-content" className="bg-white">
                {children}
            </main>

            <footer className="mt-12 border-t border-slate-200/80 bg-slate-900 text-white">
                <div className="bg-slate-800/80">
                    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <p className="text-lg font-semibold uppercase tracking-[0.2em]">{resolvedSiteName}</p>
                            <p className="mt-3 text-sm text-white/80">{resolvedTagline}</p>
                            {address ? (
                                <p className="mt-4 inline-flex items-start gap-2 text-sm text-white/70">
                                    <MapPin className="mt-1 h-4 w-4 flex-shrink-0" />
                                    <span>{address}</span>
                                </p>
                            ) : null}
                        </div>
                        <div>
                            <p className="text-lg font-semibold uppercase tracking-[0.2em]">Kontak</p>
                            <div className="mt-3 space-y-2 text-sm text-white/80">
                                {phone ? (
                                    <a href={`tel:${phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 hover:text-white">
                                        <Phone className="h-4 w-4" />
                                        <span>{phone}</span>
                                    </a>
                                ) : null}
                                {sharedSettings?.whatsapp ? (
                                    <a
                                        href={`https://wa.me/${sharedSettings.whatsapp.replace(/[^0-9]/g, '')}`}
                                        className="flex items-center gap-2 hover:text-white"
                                    >
                                        <Phone className="h-4 w-4" />
                                        <span>WhatsApp {sharedSettings.whatsapp}</span>
                                    </a>
                                ) : null}
                                {email ? (
                                    <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-white">
                                        <Mail className="h-4 w-4" />
                                        <span>{email}</span>
                                    </a>
                                ) : null}
                            </div>
                        </div>
                        <div>
                            <p className="text-lg font-semibold uppercase tracking-[0.2em]">Jam Layanan</p>
                            <div className="mt-3 space-y-2 text-sm text-white/80">
                                {footerHours.length > 0 ? (
                                    footerHours.map((slot, index) => {
                                        const label = slot?.day ?? slot?.label ?? `Hari ${index + 1}`;
                                        const schedule = slot?.value ?? [slot?.open, slot?.close].filter(Boolean).join(' - ');
                                        return (
                                            <div key={`${label}-${index}`} className="space-y-1 rounded-md bg-white/5 p-3">
                                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">{label}</p>
                                                {schedule ? <p>{schedule}</p> : null}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p>Senin - Jumat, 07.00 - 15.00 WIB</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="text-lg font-semibold uppercase tracking-[0.2em]">Tetap Terhubung</p>
                            <p className="mt-3 text-sm text-white/80">
                                Ikuti pembaruan terbaru kami mengenai kegiatan belajar, dukungan orang tua, dan kolaborasi komunitas.
                            </p>
                            {socialLinks.length > 0 ? (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {socialLinks.map((link, index) => (
                                        <Link
                                            key={`${link.url}-${index}`}
                                            href={link.url ?? '#'}
                                            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-900 transition hover:bg-amber-300"
                                        >
                                            {link.label ?? 'Ikuti Kami'}
                                        </Link>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className="border-t border-white/10 bg-slate-950/80">
                    <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
                        <p>&copy; {year} {resolvedSiteName}. Hak cipta dilindungi.</p>
                        <div className="flex flex-wrap items-center gap-3">
                            <Link href="/kebijakan-privasi" className="hover:text-white">
                                Kebijakan Privasi
                            </Link>
                            <Link href="/sitemap" className="hover:text-white">
                                Peta Situs
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
