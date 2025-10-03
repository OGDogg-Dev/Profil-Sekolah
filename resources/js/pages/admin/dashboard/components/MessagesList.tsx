interface MessageItem {
    id: number;
    name: string;
    message: string;
    time?: string | null;
    isRead?: boolean;
}

interface MessagesListProps {
    title: string;
    items: MessageItem[];
}

export function MessagesList({ title, items }: MessagesListProps) {
    const content = items.length
        ? items
        : [
              { id: 0, name: '—', message: 'Belum ada pesan masuk', time: null, isRead: true },
          ];

    return (
        <div className="flex h-full flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{title}</p>
            <div className="space-y-3">
                {content.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300"
                    >
                        <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-slate-900/90 text-xs font-semibold text-white dark:bg-slate-800">
                            {item.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                                {item.time ? <span className="text-xs text-slate-400">{item.time}</span> : null}
                            </div>
                            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{item.message}</p>
                        </div>
                        {!item.isRead ? <span className="mt-2 h-2 w-2 rounded-full bg-brand-500" aria-hidden /> : null}
                    </div>
                ))}
            </div>
        </div>
    );
}
