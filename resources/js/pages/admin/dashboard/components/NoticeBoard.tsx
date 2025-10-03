import { Link } from '@inertiajs/react';
import { CalendarDays, Clock, MapPin } from 'lucide-react';

export type Notice = {
    title: string;
    date?: string | null;
    time?: string | null;
    location?: string | null;
    url?: string;
};

interface NoticeBoardProps {
    title: string;
    items: Notice[];
}

export function NoticeBoard({ title, items }: NoticeBoardProps) {
    const content = items.length
        ? items
        : [
              { title: 'Belum ada agenda terbaru', date: null, time: null, location: null },
          ];

    return (
        <div className="flex h-full flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{title}</p>
            <div className="space-y-4">
                {content.map((item, index) => {
                    const shared = (
                        <>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                {item.date ? (
                                    <span className="inline-flex items-center gap-1">
                                        <CalendarDays className="h-3.5 w-3.5" aria-hidden /> {item.date}
                                    </span>
                                ) : null}
                                {item.time ? (
                                    <span className="inline-flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" aria-hidden /> {item.time}
                                    </span>
                                ) : null}
                                {item.location ? (
                                    <span className="inline-flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" aria-hidden /> {item.location}
                                    </span>
                                ) : null}
                            </div>
                        </>
                    );

                    if (item.url) {
                        return (
                            <Link
                                key={`${item.title}-${index}`}
                                href={item.url}
                                className="block rounded-2xl border border-slate-200/70 bg-white/80 p-4 transition hover:border-brand-300 hover:bg-brand-50/60 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-brand-400/50"
                            >
                                {shared}
                            </Link>
                        );
                    }

                    return (
                        <div
                            key={`${item.title}-${index}`}
                            className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/60"
                        >
                            {shared}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
