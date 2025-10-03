interface GradeListProps {
    title: string;
    items: Array<{ label: string; score: number }>;
}

export function GradeList({ title, items }: GradeListProps) {
    return (
        <div className="flex h-full flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{title}</p>
            </div>
            <div className="space-y-3">
                {items.map((item) => {
                    const value = Math.min(100, Math.max(0, Math.round(item.score)));
                    return (
                        <div key={item.label} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                                <span>{item.label}</span>
                                <span>{value}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-200/70 dark:bg-slate-800">
                                <div
                                    className="h-full rounded-full bg-brand-500 transition-[width]"
                                    style={{ width: `${value}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
