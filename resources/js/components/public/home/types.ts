export type HomeNewsItem = {
  slug: string;
  title: string;
  href: string;
  cover?: string | null;
  category?: string | null;
  publishedAt?: string | null;
  excerpt?: string | null;
};

export type HomeEventItem = {
  slug: string;
  title: string;
  startAt: string;
  endAt?: string | null;
  location?: string | null;
  href: string;
};

export type HomeAlbumItem = {
  slug: string;
  title: string;
  href: string;
  coverUrl?: string | null;
  mediaCount?: number | null;
  mediaUrls?: string[];
};

export type HomeHighlightItem = {
  title: string;
  description?: string | null;
  href?: string | null;
};

export type HomeStatItem = {
  label: string;
  value: string;
};

export type HomeTestimonial = {
  quote: string;
  name: string;
  role?: string;
};
