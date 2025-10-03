export type MediaType = 'image' | 'video';

export type MediaItem = {
    id: number;
    type: MediaType;
    url: string;
    poster?: string | null;
    alt?: string | null;
    caption?: string | null;
    track_vtt?: string | null;
};

export type VocationalProgram = {
    id?: number;
    slug: string;
    title: string;
    icon?: string | null;
    description?: string | null;
    audience?: string | null;
    duration?: string | null;
    schedule?: string | null;
    outcomes?: string[] | null;
    facilities?: string[] | null;
    mentors?: string[] | null;
    photos?: string[] | null;
    media?: MediaItem[];
};
