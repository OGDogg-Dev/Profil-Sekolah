import React from 'react';
import { Head } from '@inertiajs/react';
import A11yToolbar from '@/components/layout/A11yToolbar';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/card';
import Pill from '@/components/ui/Pill';
import ProgramGrid from '@/components/vocational/ProgramGrid';
import AlbumPreview from '@/components/home/AlbumPreview';
import EventList from '@/components/home/EventList';
import PostList from '@/components/home/PostList';
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
    };
    programs: VocationalProgram[];
    posts: PostSummary[];
    events: EventSummary[];
    albums: AlbumSummary[];
}

export default function Home({ settings, profile, programs, posts, events, albums }: HomeProps) {
    const siteName = settings?.site_name ?? 'Vokasional Disabilitas';
    const tagline = settings?.tagline ?? 'Pelatihan vokasi inklusif — belajar, berkarya, berdaya';

    const organizationJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteName,
        description: tagline,
        url: 'https://contoh-sekolah.test',
    };

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Head title={`Beranda - ${siteName}`}>
                <meta name="description" content={tagline} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
            </Head>
            <A11yToolbar />
            <Navbar schoolName={siteName} activeId="beranda" />
            <main id="main-content" className="space-y-16">
                <Section id="hero" className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
                    <div className="space-y-5">
                        <Pill className="border-slate-200 bg-slate-100 text-slate-700">Portal Sekolah Inklusif</Pill>
                        <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
                            {siteName}
                        </h1>
                        <p className="text-lg text-slate-600 md:text-xl">{tagline}</p>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="/profil"
                                className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                            >
                                Tentang Kami
                            </a>
                            <a
                                href="/vokasional"
                                className="rounded-xl border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
                            >
                                Lihat Program Vokasional
                            </a>
                        </div>
                    </div>
                    <Card className="space-y-4 border-dashed p-6">
                        <h2 className="text-lg font-semibold text-slate-900">Profil Singkat</h2>
                        <p className="text-sm text-slate-600">{profile.excerpt ?? 'Profil sekolah belum tersedia.'}</p>
                        <a
                            href="/profil"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:underline"
                        >
                            Baca Profil <span aria-hidden>?</span>
                        </a>
                    </Card>
                </Section>

                <Section id="program" title="Program Vokasional">
                    <div className="flex items-center justify-between pb-6">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">Program Vokasi Unggulan</h2>
                            <p className="text-sm text-slate-500">Enam jurusan siap kerja dengan pendampingan aksesibel.</p>
                        </div>
                        <a href="/vokasional" className="text-sm font-semibold text-slate-900 hover:underline">
                            Lihat semua
                        </a>
                    </div>
                    <ProgramGrid items={programs} />
                </Section>

                <Section id="berita" title="Berita Terbaru" gray>
                    <div className="flex items-center justify-between pb-6">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">Aktivitas &amp; Prestasi</h2>
                            <p className="text-sm text-slate-500">Sorotan terbaru dari komunitas vokasional kami.</p>
                        </div>
                        <a href="/berita" className="text-sm font-semibold text-slate-900 hover:underline">
                            Lihat semua
                        </a>
                    </div>
                    <PostList items={posts} />
                </Section>

                <Section id="agenda" title="Agenda Terdekat">
                    <div className="flex items-center justify-between pb-6">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">Agenda &amp; Kegiatan</h2>
                            <p className="text-sm text-slate-500">Jangan lewatkan jadwal penting bersama kami.</p>
                        </div>
                        <a href="/agenda" className="text-sm font-semibold text-slate-900 hover:underline">
                            Lihat semua
                        </a>
                    </div>
                    <EventList items={events} />
                </Section>

                <Section id="galeri" title="Galeri" gray>
                    <div className="flex items-center justify-between pb-6">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">Dokumentasi Kegiatan</h2>
                            <p className="text-sm text-slate-500">Momen inspiratif dari peserta dan mentor.</p>
                        </div>
                        <a href="/galeri" className="text-sm font-semibold text-slate-900 hover:underline">
                            Lihat semua
                        </a>
                    </div>
                    <AlbumPreview items={albums} />
                </Section>
            </main>
            <Footer siteName={siteName} />
        </div>
    );
}
