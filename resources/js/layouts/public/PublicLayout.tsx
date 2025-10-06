import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Circle,
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
  School,
  Search,
  Target,
  User,
  X,
} from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

type NavLink = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

type PublicLayoutProps = {
  children: ReactNode;
  navLinks?: NavLink[];
  showSearch?: boolean;
};

type SharedSettings = {
  site_name?: string;
  tagline?: string;
  address?: string;
  phone?: string;
  email?: string;
};

type SharedPageProps = {
  settings?: SharedSettings;
};

const DEFAULT_NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/profil', label: 'Profil', icon: User },
  { href: '/visi-misi', label: 'Visi & Misi', icon: Target },
  { href: '/vokasional', label: 'Direktori Program', icon: Layers },
  { href: '/berita', label: 'Berita', icon: Newspaper },
  { href: '/agenda', label: 'Agenda', icon: CalendarDays },
  { href: '/galeri', label: 'Galeri', icon: ImageIcon },
  { href: '/hubungi-kami', label: 'Hubungi Kami', icon: MessageCircle },
];

const FALLBACK_CONTACT = {
  address: 'Jl. Rampa Akses 01, Surakarta',
  phone: '+62-812-0000-0000',
  email: 'halo@sekolahinklusi.sch.id',
};

export function PublicLayout({ children, navLinks = DEFAULT_NAV_LINKS, showSearch = true }: PublicLayoutProps) {
  const page = usePage<SharedPageProps>();
  const { url } = page;
  const settings = page.props.settings ?? {};

  const [mobileOpen, setMobileOpen] = useState(false);

  const siteName = settings.site_name ?? 'Profil-Sekolah';
  const address = settings.address ?? FALLBACK_CONTACT.address;
  const phone = settings.phone ?? FALLBACK_CONTACT.phone;
  const email = settings.email ?? FALLBACK_CONTACT.email;
  const whatsappHref = buildWhatsAppLink(settings.phone ?? FALLBACK_CONTACT.phone);

  const activeHref = useMemo(() => {
    const [path] = url.split('?');
    return path;
  }, [url]);

  useEffect(() => {
    setMobileOpen(false);
  }, [activeHref]);

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <Container className="flex items-center gap-3 py-3">
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
            <School className="h-6 w-6" aria-hidden /> {siteName}
          </Link>
          <nav className="ml-auto hidden items-center gap-2 md:flex">
            {navLinks.map((item) => {
              const normalized = item.href.replace(/#.*/, '');
              const isActive =
                activeHref === normalized ||
                (normalized !== '/' && activeHref.startsWith(`${normalized}/`));
              const IconComponent = item.icon ?? Circle;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl border text-sm transition',
                    isActive
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900',
                  )}
                >
                  <IconComponent className="h-5 w-5" aria-hidden />
                  <span className="sr-only">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          {showSearch ? (
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
              <input
                type="search"
                placeholder="Cari..."
                aria-label="Cari situs"
                className="h-10 rounded-xl border bg-white/70 py-2 pl-9 pr-3 text-sm"
              />
            </div>
          ) : null}
          <Link
            href={whatsappHref}
            className="hidden items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 md:hidden"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </Container>
        {mobileOpen ? (
          <div className="md:hidden border-t bg-white shadow-sm">
            <Container className="py-3">
              <div className="grid grid-cols-4 gap-3">
                {navLinks.map((item) => {
                  const normalized = item.href.replace(/#.*/, '');
                  const isActive =
                    activeHref === normalized ||
                    (normalized !== '/' && activeHref.startsWith(`${normalized}/`));
                  const IconComponent = item.icon ?? Circle;
                  return (
                    <Link
                      key={`mobile-${item.href}`}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex flex-col items-center gap-1 rounded-xl border px-2 py-2 text-xs font-medium transition',
                        isActive
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900',
                      )}
                    >
                      <IconComponent className="h-5 w-5" aria-hidden />
                      <span className="text-[11px] leading-none">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
              <Link
                href={whatsappHref}
                onClick={() => setMobileOpen(false)}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
              >
                <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
              </Link>
            </Container>
          </div>
        ) : null}
      </header>

      <main>{children}</main>

      <footer className="mt-20 border-t">
        <Container className="grid grid-cols-12 gap-6 py-10">
          <div className="col-span-12 md:col-span-5">
            <p className="flex items-center gap-2 font-semibold text-slate-900">
              <School className="h-5 w-5" aria-hidden /> {siteName}
            </p>
            {settings.tagline ? (
              <p className="mt-2 max-w-prose text-sm text-slate-600">{settings.tagline}</p>
            ) : (
              <p className="mt-2 max-w-prose text-sm text-slate-600">
                Sekolah inklusif yang mendukung bakat setiap anak melalui program akademik dan non-akademik.
              </p>
            )}
            <div className="mt-3 flex flex-col gap-1 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden /> {address}
              </span>
              <span className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4" aria-hidden /> {phone}
              </span>
              <span className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4" aria-hidden /> {email}
              </span>
            </div>
          </div>
          <div className="col-span-6 md:col-span-3">
            <p className="font-medium text-slate-900">Tautan</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {navLinks.slice(1).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-6 md:col-span-4">
            <p className="font-medium text-slate-900">Jam Layanan</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Sen-Jum: 07.00-15.00</li>
              <li>Sab: 08.00-12.00</li>
              <li>Min & Libur: Tutup</li>
            </ul>
          </div>
        </Container>
        <div className="border-t py-4 text-center text-xs text-slate-500">
          {'�'} {currentYear} {siteName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function buildWhatsAppLink(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : 'https://wa.me/6281334363019';
}

export { DEFAULT_NAV_LINKS };
