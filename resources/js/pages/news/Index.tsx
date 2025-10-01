import React from 'react';
import { Head } from '@inertiajs/react';
import A11yToolbar from '@/components/layout/A11yToolbar';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Pagination from '@/components/ui/Pagination';
import Section from '@/components/ui/Section';
import PostList from '@/components/home/PostList';
import type { PostSummary } from '@/features/content/types';
import type { Paginated } from '@/features/common/types';

interface NewsIndexProps {
    posts: Paginated<PostSummary>;
}

export default function NewsIndex({ posts }: NewsIndexProps) {
    const siteName = 'Vokasional Disabilitas';

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Head title={`Berita - ${siteName}`}>
                <meta name="description" content={`Berita dan artikel terkini dari ${siteName}.`} />
            </Head>
            <A11yToolbar />
            <Navbar schoolName={siteName} activeId="berita" />
            <main id="main-content" className="space-y-12">
                <Section id="berita" className="space-y-6">
                    <Breadcrumbs items={[{ label: 'Berita', href: '/berita' }]} />
                    <header className="space-y-3">
                        <h1 className="text-3xl font-bold text-slate-900">Berita &amp; Artikel</h1>
                        <p className="text-slate-600">Update terbaru seputar kegiatan, prestasi, dan informasi resmi Vokasional Disabilitas.</p>
                    </header>
                    <PostList items={posts.data} />
                    <Pagination links={posts.links} />
                </Section>
            </main>
            <Footer siteName={siteName} />
        </div>
    );
}
