import type { ComponentType, SVGProps } from 'react';
import { Archive, FileText, Images, MonitorPlay } from 'lucide-react';

export type ResourceItem = {
    type: string;
    total: number;
};

const ICON_MAP: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
    video: MonitorPlay,
    videos: MonitorPlay,
    image: Images,
    images: Images,
    photo: Images,
    photos: Images,
    document: FileText,
    documents: FileText,
};

const COLORS = ['bg-brand-500/10 text-brand-600', 'bg-emerald-500/10 text-emerald-600', 'bg-violet-500/10 text-violet-600', 'bg-amber-500/10 text-amber-600'];

interface ResourceTilesProps {
    title: string;
    items: ResourceItem[];
}

export function ResourceTiles({ title, items }: ResourceTilesProps) {
    const fallback: ResourceItem[] = items.length
        ? items
        : [
              { type: 'documents', total: 0 },
              { type: 'videos', total: 0 },
              { type: 'images', total: 0 },
          ];

    return (
        <div className="flex h-full flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{title}</p>
            <div className="grid gap-3 sm:grid-cols-3">
                {fallback.map((item, index) => {
                    const key = item.type.toLowerCase();
                    const Icon = ICON_MAP[key] ?? Archive;
                    const color = COLORS[index % COLORS.length];

                    return (
                        <div
                            key={`${key}-${index}`}
                            className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
                        >
                            <div className={`mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl ${color}`}>
                                <Icon className="h-5 w-5" aria-hidden />
                            </div>
                            <p className="text-sm font-semibold text-slate-900 capitalize dark:text-white">{item.type}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{item.total} item</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
