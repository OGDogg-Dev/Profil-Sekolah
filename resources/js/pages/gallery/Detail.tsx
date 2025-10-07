import { Head, Link, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { ArrowLeft, ArrowUpRight, Camera, ImageIcon } from 'lucide-react';
import AppShell from '@/layouts/AppShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import AccessibleVideo from '@/components/vocational/AccessibleVideo';
import Card from '@/components/ui/card';
import type { AlbumSummary, AlbumMediaSummary } from '@/features/content/types';
import type { MediaItem } from '@/features/vocational/types';

interface GalleryDetailProps {
    album: AlbumSummary;
}

type PageProps = {
    settings?: {
        site_name?: string;
    };
};

const mapToMediaItem = (item: AlbumMediaSummary, albumTitle: string): MediaItem => ({
    id: item.id,
    type: item.type,
    url: item.url,
    poster: item.poster ?? undefined,
    caption: item.caption ?? undefined,
    track_vtt: item.track_vtt ?? undefined,
    alt: item.caption ?? albumTitle,
});

export default function GalleryDetail({ album }: GalleryDetailProps) {
    const { props } = usePage<PageProps>();
    const siteName = props?.settings?.site_name ?? 'SMK Negeri 10 Kuningan';
    const description = album.description ?? `Album ${album.title} dari ${siteName}.`;
    const mediaItems = useMemo(
        () => (album.media ?? []).map((item) => mapToMediaItem(item, album.title)),
        [album.media, album.title],
    );
    const mediaCount = album.media_count ?? mediaItems.length;
    const coverImage = album.cover_url ?? mediaItems[0]?.url ?? null;
    const fallbackSummary =
        'Album ini merekam proses belajar, kolaborasi lintas pihak, dan momen penting bersama peserta didik di lingkungan sekolah.';
    const albumSummary = album.description ?? fallbackSummary;

    return (
        <AppShell siteName={siteName}>
            <Head title={`${album.title} - ${siteName}`}>
                <meta name="description" content={description} />
            </Head>

            <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white">
                <div className="pointer-events-none absolute inset-0 opacity-40">
                    <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-emerald-400/25 blur-3xl" />
                    <div className="absolute -right-10 bottom-10 h-56 w-56 rounded-full bg-sky-500/25 blur-3xl" />
                </div>
                <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-14 lg:pt-20">
                    <Breadcrumbs
                        items={[
                            { label: 'Galeri', href: '/galeri' },
                            { label: album.title },
                        ]}
                        variant="dark"
                    />
                    <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-white/70">
                        <Link
                            href="/galeri"
                            className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 font-semibold text-white transition hover:bg-white/10"
                        >
                            <ArrowLeft size={14} aria-hidden /> Kembali ke galeri
                        </Link>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2">
                            <Camera size={14} aria-hidden /> {mediaCount} dokumentasi
                        </span>
                    </div>
                    <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
                        <header className="space-y-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">Album Dokumentasi</p>
                            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{album.title}</h1>
                            <p className="max-w-2xl text-base text-slate-100 sm:text-lg">{albumSummary}</p>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/kontak"
                                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-200"
                                >
                                    Kolaborasi dokumentasi
                                    <ArrowUpRight size={16} aria-hidden />
                                </Link>
                                <Link
                                    href="/agenda"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/60 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    Cek agenda terkait
                                </Link>
                            </div>
                        </header>
                        <aside className="space-y-4 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">Ikhtisar Album</p>
                            <div className="space-y-4">
                                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                                    <p className="text-xs uppercase tracking-[0.25em] text-slate-200">Total Media</p>
                                    <p className="mt-2 text-2xl font-semibold text-white">{mediaCount}</p>
                                    <p className="mt-1 text-xs text-slate-200/80">Foto dan video yang siap diakses publik.</p>
                                </div>
                                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                                    <p className="text-xs uppercase tracking-[0.25em] text-slate-200">Penggunaan</p>
                                    <p className="mt-2 text-sm text-slate-100">
                                        Cocok untuk materi publikasi sekolah, laporan kegiatan, serta inspirasi belajar bagi komunitas.
                                    </p>
                                </div>
                                <Link
                                    href="/berita"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/40 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    Lihat liputan pendukung
                                    <ArrowUpRight size={16} aria-hidden />
                                </Link>
                            </div>
                        </aside>
                    </div>

                    {coverImage ? (
                        <figure className="mt-12 overflow-hidden rounded-[2rem] border border-white/20 bg-white/10">
                            <img
                                src={coverImage}
                                alt={album.title}
                                className="h-80 w-full object-cover"
                                loading="lazy"
                            />
                        </figure>
                    ) : null}
                </div>
            </section>

            <section className="bg-white">
                <div className="mx-auto w-full max-w-6xl px-4 py-16">
                    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-slate-900">Cerita di balik album</h2>
                            <p className="text-sm text-slate-600">
                                {album.description
                                    ? album.description
                                    : 'Tim dokumentasi merangkum momen-momen bermakna agar warga sekolah dan mitra dapat merasakan atmosfer kegiatan meskipun tidak hadir secara langsung.'}
                            </p>
                            <ul className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                                <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    • Setiap dokumentasi sudah melalui kurasi dan verifikasi izin publikasi.
                                </li>
                                <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    • Konten dapat dimanfaatkan kembali untuk materi promosi dan laporan kegiatan.
                                </li>
                                <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    • Apabila membutuhkan resolusi lebih tinggi, silakan hubungi pengelola dokumentasi.
                                </li>
                                <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    • Sertakan kredit {siteName} ketika menggunakan ulang dokumentasi.
                                </li>
                            </ul>
                        </div>
                        <Card className="rounded-3xl border-slate-200 bg-slate-50 p-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600">Butuh bantuan?</p>
                            <p className="mt-4 text-sm text-slate-600">
                                Hubungi kami untuk akses arsip lengkap, permintaan dokumentasi tambahan, atau pendampingan publikasi.
                            </p>
                            <Link
                                href="/kontak"
                                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                            >
                                Jadwalkan diskusi
                                <ArrowUpRight size={18} aria-hidden />
                            </Link>
                        </Card>
                    </div>

                    <div className="mt-12">
                        {mediaItems.length ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {mediaItems.map((item) => (
                                    <figure key={item.id} className="space-y-3">
                                        {item.type === 'video' ? (
                                            <AccessibleVideo item={item} />
                                        ) : (
                                            <div className="overflow-hidden rounded-3xl border border-slate-200">
                                                <img
                                                    src={item.url}
                                                    alt={item.alt ?? album.title}
                                                    className="h-56 w-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                        {item.caption ? (
                                            <figcaption className="text-xs text-slate-500">{item.caption}</figcaption>
                                        ) : null}
                                    </figure>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                                <ImageIcon size={32} className="text-slate-400" aria-hidden />
                                <p className="text-sm text-slate-600">
                                    Dokumentasi akan segera tersedia. Tim kami sedang melakukan proses kurasi akhir sebelum dipublikasikan.
                                </p>
                                <Link
                                    href="/kontak"
                                    className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                                >
                                    Minta pemberitahuan rilis
                                    <ArrowUpRight size={16} aria-hidden />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </AppShell>
    );
}
