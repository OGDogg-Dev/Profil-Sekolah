import { Link } from '@inertiajs/react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';

import type { HomeAlbumItem } from './types';

interface GallerySectionProps {
  albums: HomeAlbumItem[];
  heading?: {
    eyebrow?: string;
    title?: string;
    description?: string;
  };
}

const PLACEHOLDER_ALBUMS: HomeAlbumItem[] = Array.from({ length: 6 }).map((_, index) => ({
  slug: `placeholder-${index}`,
  title: `Album ${index + 1}`,
  href: '#',
  coverUrl: `https://picsum.photos/seed/album-${index}/800/600`,
  mediaCount: 18,
  mediaUrls: Array.from({ length: 3 }).map((__, inner) => `https://picsum.photos/seed/album-${index}-${inner}/600/400`),
}));

const PLACEHOLDER_IMAGES = Array.from({ length: 8 }).map((_, index) => `https://picsum.photos/seed/gallery-${index}/600/600`);

export function GallerySection({ albums, heading }: GallerySectionProps) {
  const featuredAlbums = (albums.length ? albums : PLACEHOLDER_ALBUMS).slice(0, 6);
  const displayAlbums = featuredAlbums.map((album, index) => {
    const fallback = PLACEHOLDER_ALBUMS[index % PLACEHOLDER_ALBUMS.length];
    const cover = album.coverUrl ?? album.mediaUrls?.[0] ?? fallback.coverUrl ?? PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
    const count = album.mediaCount ?? album.mediaUrls?.length ?? fallback.mediaCount ?? 0;
    return {
      key: album.slug,
      title: album.title,
      href: album.href ?? '#',
      cover,
      count,
    };
  });

  const masonrySources = albums[0]?.mediaUrls?.slice(0, 8) ?? PLACEHOLDER_IMAGES;

  return (
    <section id="galeri" className="mt-12">
      <Container>
        <SectionHeader
          eyebrow={heading?.eyebrow ?? 'Dokumentasi'}
          title={heading?.title ?? 'Galeri / Prestasi'}
          desc={heading?.description}
          action={<Link href="/galeri" className="hover:underline">Lihat semua</Link>}
        />
        <div className="grid grid-cols-12 gap-6">
          {displayAlbums.map((album) => (
            <div key={album.key} className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Link href={album.href} className="group block overflow-hidden rounded-2xl border bg-white transition hover:shadow-md">
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-slate-900">{album.title}</p>
                  <p className="text-sm text-slate-500">{album.count} foto</p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <p className="mb-3 text-sm text-slate-500">Cuplikan isi album (masonry)</p>
          <div className="columns-2 gap-4 md:columns-3 [&>img]:mb-4">
            {masonrySources.map((src, index) => (
              <img key={index} src={src} alt="Dokumentasi" className="w-full rounded-xl border" />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
