export type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url?: string | null;
    prev_page_url?: string | null;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
};
