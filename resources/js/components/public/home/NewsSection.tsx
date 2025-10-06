import { Link } from '@inertiajs/react';
import { CardNews } from '@/components/public/CardNews';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';

import type { HomeNewsItem } from './types';

interface NewsSectionProps {
  items: HomeNewsItem[];
  heading?: {
    eyebrow?: string;
    title?: string;
    description?: string;
  };
}

const FALLBACK_NEWS: HomeNewsItem[] = [
  {
    slug: 'placeholder-1',
    title: 'Apa itu Pendidikan Inklusif?',
    href: '#',
    category: 'Edukasi',
    excerpt: 'Konsep sekolah yang mengakomodasi semua peserta didik dengan dukungan sesuai kebutuhan.',
    cover: 'https://picsum.photos/seed/news-headline/1200/700',
    publishedAt: '3 Okt 2025',
  },
  {
    slug: 'placeholder-2',
    title: 'Berita Sekolah',
    href: '#',
    category: 'Pengumuman',
    excerpt: 'Ringkasan 2-3 baris supaya rapi dan mudah dipindai.',
    cover: 'https://picsum.photos/seed/news-1/600/400',
    publishedAt: '1 Okt 2025',
  },
  {
    slug: 'placeholder-3',
    title: 'Kegiatan Mingguan',
    href: '#',
    category: 'Kegiatan',
    excerpt: 'Ringkasan 2-3 baris supaya rapi dan mudah dipindai.',
    cover: 'https://picsum.photos/seed/news-2/600/400',
    publishedAt: '28 Sep 2025',
  },
  {
    slug: 'placeholder-4',
    title: 'Prestasi Siswa',
    href: '#',
    category: 'Prestasi',
    excerpt: 'Ringkasan 2-3 baris supaya rapi dan mudah dipindai.',
    cover: 'https://picsum.photos/seed/news-3/600/400',
    publishedAt: '20 Sep 2025',
  },
];

export function NewsSection({ items, heading }: NewsSectionProps) {
  const news = items.length ? items : FALLBACK_NEWS;
  const headline = news[0];
  const secondary = news.slice(1, 4);

  return (
    <section id="news" className="mt-12">
      <Container>
        <SectionHeader
          eyebrow={heading?.eyebrow ?? 'Update'}
          title={heading?.title ?? 'Berita Terbaru'}
          desc={heading?.description}
          action={<Link href="/berita" className="hover:underline">Lihat semua</Link>}
        />
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6">
            <CardNews
              cover={headline.cover}
              category={headline.category}
              title={headline.title}
              excerpt={headline.excerpt}
              date={headline.publishedAt}
              href={headline.href}
              className="h-full"
            />
          </div>
          <div className="col-span-12 grid grid-cols-12 gap-6 lg:col-span-6">
            {secondary.map((item) => (
              <div key={item.slug} className="col-span-12 sm:col-span-6 lg:col-span-4">
                <CardNews
                  cover={item.cover}
                  category={item.category}
                  title={item.title}
                  excerpt={item.excerpt}
                  date={item.publishedAt}
                  href={item.href}
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
