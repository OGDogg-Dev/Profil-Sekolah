import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, Camera, ImageIcon } from 'lucide-react';
import PublicLayout from '@/layouts/public/PublicLayout';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Pagination from '@/components/ui/Pagination';
import Card, { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { AlbumSummary } from '@/features/content/types';
import type { Paginated } from '@/features/common/types';

interface GalleryIndexProps {
    albums: Paginated<AlbumSummary>;
}

type PageProps = {
    settings?: {
        site_name?: string;
    };
};

const formatNumber = (value: number) =>
    new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(value);

const getAlbumCover = (album: AlbumSummary) => album.cover_url ?? album.media?.[0]?.url ?? null;

export default function GalleryIndex({ albums }: GalleryIndexProps) {
    const { props } = usePage<PageProps>();
    const siteName = props?.settings?.site_name ?? 'SMK Negeri 10 Kuningan';
    const albumItems = albums?.data ?? [];
    const totalAlbums = albums?.total ?? albumItems.length;
    const totalMedia = albumItems.reduce(
        (total, album) => total + (album.media_count ?? album.media?.length ?? 0),
        0,
    );
    const averagePerAlbum = albumItems.length ? Math.round(totalMedia / albumItems.length) : 0;
    const highlightedAlbums = albumItems.slice(0, 3);

    const description = `Kurasi dokumentasi kegiatan ${siteName} untuk merekam proses belajar, kolaborasi, dan karya terbaik.`;

    return (
        <PublicLayout siteName={siteName}>
            <Head title={`Galeri - ${siteName}`}>
                <meta name="description" content={description} />
            </Head>

            <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white">
                <div className="pointer-events-none absolute inset-0 opacity-40">
                    <div className="absolute -left-32 top-0 h-60 w-60 rounded-full bg-sky-500/30 blur-3xl" />
                    <div className="absolute -right-10 bottom-10 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
                </div>
                <div className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-14 lg:pt-20">
                    <Breadcrumbs items={[{ label: 'Galeri', href: '/galeri' }]} variant="dark" />
                    <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">
                        <header className="space-y-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">Dokumentasi Sekolah</p>
                            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">Galeri {siteName}</h1>
                            <p className="max-w-2xl text-base text-slate-100 sm:text-lg">
                                {description}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/kontak"
                                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-200"
                                >
                                    Ajukan Peliputan Kegiatan
                                    <ArrowUpRight size={16} aria-hidden />
                                </Link>
                                <Link
                                    href="/berita"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/60 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    Baca Liputan Pendukung
                                </Link>
                            </div>
                        </header>
                        <aside className="space-y-4 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">Ikhtisar Arsip</p>
                            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-xs uppercase tracking-[0.25em] text-slate-200">Album Aktif</p>
                                    <p className="mt-2 text-2xl font-semibold text-white">{formatNumber(totalAlbums)}</p>
                                    <p className="mt-1 text-xs text-slate-200/80">Total album yang siap diakses masyarakat.</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-xs uppercase tracking-[0.25em] text-slate-200">Media Tersimpan</p>
                                    <p className="mt-2 text-2xl font-semibold text-white">{formatNumber(totalMedia)}</p>
                                    <p className="mt-1 text-xs text-slate-200/80">Foto &amp; video pada halaman ini.</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-xs uppercase tracking-[0.25em] text-slate-200">Rata-rata Album</p>
                                    <p className="mt-2 text-2xl font-semibold text-white">{formatNumber(averagePerAlbum || 0)}</p>
                                    <p className="mt-1 text-xs text-slate-200/80">Dokumentasi per album (halaman ini).</p>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {highlightedAlbums.length ? (
                        <div className="mt-12 grid gap-4 sm:grid-cols-3">
                            {highlightedAlbums.map((album) => (
                                <Link
                                    key={album.slug}
                                    href={`/galeri/${album.slug}`}
                                    className="group flex flex-col gap-3 rounded-3xl border border-white/15 bg-white/5 p-4 text-white transition hover:bg-white/10"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                                            <Camera size={18} aria-hidden />
                                        </span>
                                        <p className="text-sm font-semibold leading-snug text-white/90 group-hover:text-white">
                                            {album.title}
                                        </p>
                                    </div>
                                    <p className="text-xs text-white/70 line-clamp-3">
                                        {album.description ?? 'Sorotan aktivitas terbaru yang kami dokumentasikan.'}
                                    </p>
                                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-200">
                                        {formatNumber(album.media_count ?? album.media?.length ?? 0)} dokumentasi
                                        <ArrowUpRight size={14} aria-hidden />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ) : null}
                </div>
            </section>

            <section className="bg-white">
                <div className="mx-auto w-full max-w-6xl px-4 py-16">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">Dokumentasi Terbaru</h2>
                            <p className="mt-2 max-w-2xl text-sm text-slate-600">
                                Setiap album merangkum perjalanan belajar, kolaborasi lintas pihak, hingga perayaan karya peserta didik.
                                Gunakan arsip ini untuk memahami ragam pengalaman di {siteName}.
                            </p>
                        </div>
                        <Link
                            href="/agenda"
                            className="inline-flex items-center gap-2 self-start rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
                        >
                            Lihat Agenda Terkini
                            <ArrowUpRight size={16} aria-hidden />
                        </Link>
                    </div>

                    {albumItems.length ? (
                        <div className="mt-10 grid gap-6 lg:grid-cols-3">
                            {albumItems.map((album) => {
                                const cover = getAlbumCover(album);
                                const mediaCount = album.media_count ?? album.media?.length ?? 0;
                                return (
                                    <Card
                                        key={album.slug}
                                        className="flex h-full flex-col overflow-hidden border-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <a href={`/galeri/${album.slug}`} className="block overflow-hidden">
                                            {cover ? (
                                                <img
                                                    src={cover}
                                                    alt={album.title}
                                                    className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="flex h-48 w-full items-center justify-center bg-slate-100 text-slate-400">
                                                    <ImageIcon size={32} aria-hidden />
                                                </div>
                                            )}
                                        </a>
                                        <CardHeader className="border-0 pb-0">
                                            <CardTitle className="text-lg font-semibold text-slate-900">
                                                <a href={`/galeri/${album.slug}`} className="hover:underline">
                                                    {album.title}
                                                </a>
                                            </CardTitle>
                                        </CardHeader>
                                        {album.description ? (
                                            <CardContent className="pt-3">
                                                <CardDescription className="line-clamp-4 text-sm text-slate-600">
                                                    {album.description}
                                                </CardDescription>
                                            </CardContent>
                                        ) : null}
                                        <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 text-xs text-slate-500">
                                            <span className="font-semibold uppercase tracking-[0.2em] text-brand-600">
                                                {formatNumber(mediaCount)} media
                                            </span>
                                            <a
                                                href={`/galeri/${album.slug}`}
                                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600"
                                            >
                                                Lihat Album
                                                <ArrowUpRight size={14} aria-hidden />
                                            </a>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                            <p className="text-lg font-semibold text-slate-700">Belum ada dokumentasi yang dipublikasikan.</p>
                            <p className="mt-2 text-sm text-slate-500">
                                Tim sedang mengkurasi album terbaru. Silakan hubungi kami apabila membutuhkan arsip khusus atau
                                peliputan kegiatan mendatang.
                            </p>
                            <Link
                                href="/kontak"
                                className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                            >
                                Hubungi Pengelola Dokumentasi
                                <ArrowUpRight size={16} aria-hidden />
                            </Link>
                        </div>
                    )}

                    <div className="mt-12">
                        <Pagination links={albums.links} />
                    </div>
                </div>
            </section>

            <section className="bg-slate-50">
                <div className="mx-auto w-full max-w-6xl px-4 py-16">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-slate-900">Butuh dokumentasi kolaboratif?</h3>
                            <p className="text-sm text-slate-600">
                                Tim dokumentasi {siteName} siap mendampingi pelaksanaan kegiatan, menyediakan dokumentasi aksesibel, hingga
                                membantu publikasi lanjutan di kanal resmi sekolah.
                            </p>
                            <ul className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                                <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                                    • Pendampingan liputan foto dan video.
                                </li>
                                <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                                    • Konsultasi perizinan publikasi peserta didik.
                                </li>
                                <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                                    • Penyediaan caption aksesibel &amp; narasi.
                                </li>
                                <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                                    • Integrasi dengan agenda &amp; berita sekolah.
                                </li>
                            </ul>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600">Hubungi Kami</p>
                            <p className="mt-4 text-sm text-slate-600">
                                Sampaikan kebutuhan dokumentasi Anda melalui formulir kontak. Tim kami akan menindaklanjuti dalam 2x24 jam
                                kerja.
                            </p>
                            <Link
                                href="/kontak"
                                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                            >
                                Buka Formulir Kolaborasi
                                <ArrowUpRight size={18} aria-hidden />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
