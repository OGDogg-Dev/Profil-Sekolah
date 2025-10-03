import { Head } from '@inertiajs/react';
import AppShell from '@/layouts/AppShell';
import ProgramGrid from '@/components/vocational/ProgramGrid';
import AlbumPreview from '@/components/home/AlbumPreview';
import EventList from '@/components/home/EventList';
import type { AlbumSummary, EventSummary, PostSummary } from '@/features/content/types';
import type { VocationalProgram } from '@/features/vocational/types';

interface HomeProps {
    settings: {
        site_name?: string;
        tagline?: string;
    } | null;
    profile: {
        title: string;
        excerpt?: string | null;
        content?: string | null;
    };
    programs: VocationalProgram[];
    posts: PostSummary[];
    events: EventSummary[];
    albums: AlbumSummary[];
}

const placeholderImage = 'https://placehold.co/950x400?text=950+x+400';

export default function Home({ settings, profile, programs, posts, events, albums }: HomeProps) {
    const siteName = settings?.site_name ?? 'SMK Negeri 10 Kuningan';
    const tagline = settings?.tagline ?? "Where Tomorrow's Leaders Come Together";

    const featuredPost = posts[0];
    const otherPosts = posts.slice(1, 6);
    const quote =
        'Pendidikan merupakan tiket untuk masa depan. Hari esok untuk orang-orang yang telah mempersiapkan dirinya hari ini.';

    return (
        <AppShell siteName={siteName} tagline={tagline}>
            <Head title={`Beranda - ${siteName}`}>
                <meta name="description" content={tagline} />
            </Head>

            <section className="border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
                <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[2.2fr_1fr]">
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-xl animate-in fade-in duration-700">
                        <div
                            className="relative aspect-[19/8] w-full bg-slate-200"
                            style={
                                featuredPost?.cover_url
                                    ? { backgroundImage: `url(${featuredPost.cover_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                                    : { backgroundImage: `url(${placeholderImage})`, backgroundSize: 'cover' }
                            }
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>
                        <div className="space-y-3 bg-gradient-to-r from-[#1b57d6] to-[#0f3bb2] p-6 text-white">
                            <p className="text-[13px] uppercase tracking-[0.3em] text-white/70">Sorotan Utama</p>
                            <h2 className="text-2xl font-semibold leading-tight">
                                {featuredPost?.title ?? 'Selamat datang di portal resmi sekolah'}
                            </h2>
                            <p className="text-sm text-white/80">
                                {featuredPost?.excerpt ??
                                    'Temukan informasi terbaru seputar kegiatan, layanan, dan prestasi sekolah kami.'}
                            </p>
                            {featuredPost ? (
                                <a
                                    href={`/berita/${featuredPost.slug}`}
                                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-300 hover:text-amber-200 transition-colors"
                                >
                                    Baca selengkapnya ?
                                </a>
                            ) : null}
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Agenda Terdekat</h3>
                        {events.length ? (
                            <ul className="space-y-3 text-sm text-slate-600">
                                {events.slice(0, 5).map((event) => (
                                    <li key={event.slug} className="rounded-md border border-slate-200 p-3">
                                        <p className="text-xs uppercase tracking-[0.3em] text-[#1b57d6]">
                                            {new Date(event.start_at ?? '').toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                        <a
                                            href={`/agenda/${event.slug}`}
                                            className="mt-1 block text-sm font-semibold text-slate-900"
                                        >
                                            {event.title}
                                        </a>
                                        {event.location ? (
                                            <p className="text-xs text-slate-500">{event.location}</p>
                                        ) : null}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-500">Belum ada agenda terbaru.</p>
                        )}
                    </div>
                </div>
            </section>

            <section className="border-y border-[#1b57d6] bg-[#1b57d6]">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
                    <span className="rounded-full bg-amber-400 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#0b2b7a]">
                        Kutipan
                    </span>
                    <p className="flex-1 text-center text-sm font-medium text-white">{quote} � Anonim</p>
                </div>
            </section>

            <section className="bg-white">
                <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[2fr_1fr]">
                    <div>
                        <header className="border-b-4 border-[#1b57d6] pb-3">
                            <h2 className="text-xl font-semibold uppercase tracking-[0.2em] text-[#1b57d6]">Tulisan Terbaru</h2>
                        </header>
                        <div className="mt-6 space-y-4">
                            {otherPosts.map((post) => (
                                <article
                                    key={post.slug}
                                    className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[200px_1fr]"
                                >
                                    <div className="relative h-40 rounded-xl bg-slate-200">
                                        {post.cover_url ? (
                                            <img
                                                src={post.cover_url}
                                                alt={post.title}
                                                className="h-full w-full rounded-xl object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
                                                400 x 250
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-slate-900">
                                            <a href={`/berita/${post.slug}`} className="hover:text-[#1b57d6]">
                                                {post.title}
                                            </a>
                                        </h3>
                                        <p className="text-sm text-slate-600">{post.excerpt}</p>
                                        <div className="flex items-center justify-between text-[13px] text-slate-500">
                                            <span>
                                                {new Date(post.published_at ?? post.created_at ?? '').toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                            <a
                                                href={`/berita/${post.slug}`}
                                                className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b2b7a]"
                                            >
                                                Baca
                                            </a>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                    <aside className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="h-24 w-24 rounded-full bg-slate-200" />
                                <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-[#1b57d6]">Kepala Sekolah</p>
                                    <h3 className="text-lg font-semibold text-slate-900">Anton Sofyan</h3>
                                    <p className="text-xs text-slate-500">Sambutan singkat kepala sekolah</p>
                                </div>
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                {profile.excerpt ?? 'Selamat datang di portal resmi kami. Mari bersinergi untuk pendidikan inklusif dan unggul.'}
                            </p>
                            <a
                                href="/profil"
                                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1b57d6]"
                            >
                                Selengkapnya ?
                            </a>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Tautan</h3>
                            <ul className="mt-3 space-y-2 text-sm text-[#1b57d6]">
                                <li>
                                    <a href="/profil" className="hover:underline">
                                        Profil Sekolah
                                    </a>
                                </li>
                                <li>
                                    <a href="/vokasional" className="hover:underline">
                                        Direktori Program
                                    </a>
                                </li>
                                <li>
                                    <a href="/berita" className="hover:underline">
                                        Informasi PPDB 2025
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Paling Dikomentari</h3>
                            <ul className="mt-3 space-y-3 text-sm text-slate-600">
                                {posts.slice(0, 3).map((post) => (
                                    <li key={post.slug} className="border-b border-dashed border-slate-200 pb-2 last:border-0">
                                        <a href={`/berita/${post.slug}`} className="font-semibold text-[#1b57d6]">
                                            {post.title}
                                        </a>
                                        <p className="text-xs text-slate-500">
                                            {new Date(post.published_at ?? post.created_at ?? '').toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Berlangganan</h3>
                            <p className="mt-2 text-xs text-slate-500">Dapatkan informasi terbaru langsung ke email Anda.</p>
                            <form className="mt-3 space-y-3 text-xs">
                                <input
                                    type="email"
                                    placeholder="Alamat Email..."
                                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-600 focus:border-[#1b57d6] focus:outline-none"
                                />
                                <button className="w-full rounded-md bg-[#1b57d6] py-2 font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#0f3bb2]">
                                    Daftar
                                </button>
                            </form>
                        </div>
                    </aside>
                </div>
            </section>

            <section className="border-t border-slate-200 bg-slate-50">
                <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-[#1b57d6]">Program Vokasional</h3>
                        <p className="mt-2 text-sm text-slate-600">
                            Program unggulan dengan pendampingan aksesibel dan kurikulum adaptif.
                        </p>
                        <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                            <ProgramGrid items={programs} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-[#1b57d6]">Agenda Terbaru</h3>
                        <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                            <EventList items={events} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-t border-slate-200 bg-white">
                <div className="mx-auto w-full max-w-6xl px-4 py-10">
                    <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-[#1b57d6]">Galeri Terbaru</h3>
                    <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <AlbumPreview items={albums} />
                    </div>
                </div>
            </section>
        </AppShell>
    );
}
