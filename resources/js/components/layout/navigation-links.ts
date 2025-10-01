export type NavLink = {
    id: string;
    label: string;
    href: string;
};

export const NAV_LINKS: NavLink[] = [
    { id: 'profil', label: 'Profil', href: '/profil' },
    { id: 'visi-misi', label: 'Visi & Misi', href: '/visi-misi' },
    { id: 'vokasional', label: 'Vokasional', href: '/vokasional' },
    { id: 'berita', label: 'Berita', href: '/berita' },
    { id: 'agenda', label: 'Agenda', href: '/agenda' },
    { id: 'galeri', label: 'Galeri', href: '/galeri' },
    { id: 'kontak', label: 'Hubungi Kami', href: '/hubungi-kami' },
];
