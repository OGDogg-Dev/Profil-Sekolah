export type PostSummary = {
    slug: string;
    title: string;
    excerpt?: string | null;
    cover_url?: string | null;
    published_at?: string | null;
    created_at?: string | null;
};

export type EventSummary = {
    slug: string;
    title: string;
    description?: string | null;
    start_at: string;
    end_at?: string | null;
    location?: string | null;
    cover_url?: string | null;
};

export type AlbumMediaSummary = {
    id: number;
    type: 'image' | 'video';
    url: string;
    caption?: string | null;
    poster?: string | null;
    track_vtt?: string | null;
};

export type AlbumSummary = {
    id: number;
    slug: string;
    title: string;
    cover_url?: string | null;
    description?: string | null;
    media_count?: number;
    media?: AlbumMediaSummary[];
};
