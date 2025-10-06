import { Head, Link } from '@inertiajs/react';

import { AgendaSection } from '@/components/public/home/AgendaSection';
import { GallerySection } from '@/components/public/home/GallerySection';
import { HeroSection } from '@/components/public/home/HeroSection';
import { HighlightsSection } from '@/components/public/home/HighlightsSection';
import { NewsSection } from '@/components/public/home/NewsSection';
import { StatsTestimonialsSection } from '@/components/public/home/StatsTestimonialsSection';
import type {
  HomeAlbumItem,
  HomeEventItem,
  HomeHighlightItem,
  HomeNewsItem,
  HomeStatItem,
  HomeTestimonial,
} from '@/components/public/home/types';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { AlbumSummary, EventSummary, PostSummary } from '@/features/content/types';
import type { VocationalProgram } from '@/features/vocational/types';
import { PublicLayout } from '@/layouts/public/PublicLayout';

interface HomeHero {
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  primary?: { label?: string | null; href?: string | null } | null;
  secondary?: { label?: string | null; href?: string | null } | null;
  media?: { src?: string | null; alt?: string | null; type?: string | null } | null;
}

interface HomeSectionsCopy {
  news?: { title?: string | null; description?: string | null };
  agenda?: { title?: string | null; description?: string | null };
  gallery?: { title?: string | null; description?: string | null };
}

interface HomeContentProps {
  hero?: HomeHero;
  highlights?: HomeHighlightItem[];
  stats?: HomeStatItem[];
  testimonials?: HomeTestimonial[];
  sections?: HomeSectionsCopy;
  layout?: string[];
}

interface HomeProps {
  settings: {
    site_name?: string;
    tagline?: string;
    address?: string;
    phone?: string;
    email?: string;
    footer_hours?: string;
  } | null;
  profile: {
    title: string;
    excerpt?: string | null;
    content?: string | null;
  };
  homeContent: HomeContentProps;
  programs: VocationalProgram[];
  posts: PostSummary[];
  events: EventSummary[];
  albums: AlbumSummary[];
}

const DEFAULT_TESTIMONIALS: HomeTestimonial[] = [
  {
    quote: 'Anak saya lebih percaya diri; guru pendamping sangat suportif dan programnya jelas.',
    name: 'Ibu Sari',
    role: 'Orang tua',
  },
  {
    quote: 'Lab komputer aksesibel membuat saya berani melanjutkan belajar koding.',
    name: 'Rafi',
    role: 'Alumni',
  },
];

export default function Home({ settings, profile, homeContent, programs, posts, events, albums }: HomeProps) {
  const siteName = settings?.site_name ?? 'SMK Negeri 10 Kuningan';
  const tagline = settings?.tagline ?? "Where Tomorrow's Leaders Come Together";

  const hero = homeContent.hero ?? {};
  const heroTitle = hero.title ?? profile.title ?? siteName;
  const heroDescription = hero.description ?? profile.excerpt ??
    'Lingkungan belajar yang aman, aksesibel, dan menyenangkan dengan dukungan guru pendamping, terapi, serta teknologi asistif.';
  const heroPrimary = hero.primary?.label && hero.primary?.href
    ? { href: hero.primary.href, label: hero.primary.label }
    : { href: '/ppdb', label: 'Daftar PPDB' };
  const heroSecondary = hero.secondary?.label && hero.secondary?.href
    ? { href: hero.secondary.href, label: hero.secondary.label }
    : { href: '/hubungi-kami', label: 'Hubungi Kami' };

  const heroMedia = hero.media?.src
    ? { src: hero.media.src ?? undefined, alt: hero.media.alt ?? undefined, type: hero.media.type ?? undefined }
    : undefined;

  const highlights = homeContent.highlights ?? [];
  const stats = homeContent.stats ?? [];
  const testimonials = (homeContent.testimonials && homeContent.testimonials.length)
    ? homeContent.testimonials
    : DEFAULT_TESTIMONIALS;

  const newsItems = mapPostsToNews(posts);
  const eventItems = mapEventsToAgenda(events);
  const albumItems = mapAlbumsToGallery(albums);

  const sections: Record<string, JSX.Element> = {
    hero: (
      <HeroSection
        key="hero"
        eyebrow={hero.eyebrow ?? 'Sekolah Inklusif - Ramah Disabilitas'}
        title={heroTitle}
        description={heroDescription}
        primaryCta={heroPrimary}
        secondaryCta={heroSecondary}
        media={heroMedia}
      />
    ),
    highlights: <HighlightsSection key="highlights" items={highlights} />,
    news: (
      <NewsSection
        key="news"
        items={newsItems}
        heading={{
          eyebrow: 'Update',
          title: homeContent.sections?.news?.title ?? 'Berita Terbaru',
          description: homeContent.sections?.news?.description ?? undefined,
        }}
      />
    ),
    agenda: (
      <AgendaSection
        key="agenda"
        events={eventItems}
        heading={{
          eyebrow: 'Kalender',
          title: homeContent.sections?.agenda?.title ?? 'Agenda Terdekat',
          description: homeContent.sections?.agenda?.description ?? undefined,
        }}
      />
    ),
    programs: (
      <section key="program" id="program" className="mt-12">
        <Container>
          <SectionHeader
            eyebrow="Direktori"
            title="Program Vokasi Inklusif"
            desc="Pilihan kompetensi dengan dukungan fasilitas aksesibel dan kurikulum adaptif."
            action={<Link href="/vokasional" className="hover:underline">Lihat semua</Link>}
          />
          <div className="grid grid-cols-12 gap-6">
            {programs.slice(0, 6).map((program) => (
              <div key={program.slug} className="col-span-12 sm:col-span-6 lg:col-span-4">
                <ProgramCard program={program} />
              </div>
            ))}
          </div>
        </Container>
      </section>
    ),
    gallery: (
      <GallerySection
        key="gallery"
        albums={albumItems}
        heading={{
          eyebrow: 'Dokumentasi',
          title: homeContent.sections?.gallery?.title ?? 'Galeri / Prestasi',
          description: homeContent.sections?.gallery?.description ?? undefined,
        }}
      />
    ),
    stats: <StatsTestimonialsSection key="stats" stats={stats} testimonials={testimonials} />,
  };

  const layout = homeContent.layout ?? ['hero', 'highlights', 'news', 'agenda', 'programs', 'gallery', 'stats'];

  return (
    <PublicLayout>
      <Head title={`Beranda - ${siteName}`}>
        <meta name="description" content={tagline} />
      </Head>

      {layout.map((sectionName) => sections[sectionName]).filter(Boolean)}
    </PublicLayout>
  );
}

function ProgramCard({ program }: { program: VocationalProgram }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <SectionHeader
        title={program.title}
        desc={program.description ?? undefined}
        className="mb-4"
      />
      <div className="space-y-3 text-sm text-slate-600">
        {collectProgramHighlights(program).map((item, index) => (
          <p key={index} className="rounded-lg bg-slate-50 px-3 py-2">
            {item}
          </p>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href={`/vokasional/${program.slug}`} className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-900">
          Detail Program
        </Link>
        <Link href="/ppdb" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Daftar PPDB
        </Link>
      </div>
    </div>
  );
}

function mapPostsToNews(posts: PostSummary[]): HomeNewsItem[] {
  return posts.slice(0, 4).map((post, index) => ({
    slug: post.slug,
    title: post.title,
    href: `/berita/${post.slug}`,
    cover: resolveMediaUrl(post.cover_url),
    category: index === 0 ? 'Sorotan' : 'Berita',
    publishedAt: formatDate(post.published_at ?? post.created_at),
    excerpt: post.excerpt ?? undefined,
  }));
}

function mapEventsToAgenda(events: EventSummary[]): HomeEventItem[] {
  return events.slice(0, 4).map((event) => ({
    slug: event.slug,
    title: event.title,
    startAt: event.start_at,
    endAt: event.end_at ?? undefined,
    location: event.location ?? undefined,
    href: `/agenda/${event.slug}`,
  }));
}

function mapAlbumsToGallery(albums: AlbumSummary[]): HomeAlbumItem[] {
  return albums.slice(0, 6).map((album) => {
    const mediaUrls = (album.media ?? [])
      .map((item) => resolveMediaUrl(item.url))
      .filter((url): url is string => Boolean(url));

    return {
      slug: album.slug,
      title: album.title,
      href: `/galeri/${album.slug}`,
      coverUrl: resolveMediaUrl(album.cover_url ?? album.media?.[0]?.url),
      mediaCount: album.media_count ?? album.media?.length ?? null,
      mediaUrls: mediaUrls.length ? mediaUrls : undefined,
    };
  });
}

function collectProgramHighlights(program: VocationalProgram): string[] {
  if (program.outcomes?.length) {
    return program.outcomes.slice(0, 3);
  }
  if (program.facilities?.length) {
    return program.facilities.slice(0, 3);
  }
  if (program.mentors?.length) {
    return program.mentors.slice(0, 3);
  }
  return ['Pendampingan personal', 'Fasilitas aksesibel', 'Kolaborasi industri'];
}

function resolveMediaUrl(path?: string | null): string | undefined {
  if (!path) {
    return undefined;
  }
  return path.startsWith('http') ? path : `/storage/${path.replace(/^\/+/, '')}`;
}

function formatDate(value?: string | null): string | undefined {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}
