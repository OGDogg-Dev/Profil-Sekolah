interface RadialProgressProps {
    value: number;
    label: string;
    subtitle?: string;
}

export function RadialProgress({ value, label, subtitle }: RadialProgressProps) {
    const safeValue = Math.min(100, Math.max(0, Math.round(value)));
    const conic = `conic-gradient(var(--color-brand-500, #1d4ed8) ${safeValue * 3.6}deg, rgba(148, 163, 184, 0.2) 0deg)`;

    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200/70 bg-white/90 p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <div
                className="grid h-28 w-28 place-items-center rounded-full bg-white dark:bg-slate-900"
                style={{ backgroundImage: conic }}
            >
                <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                    <span className="text-2xl font-bold">{safeValue}%</span>
                </div>
            </div>
            <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
                {subtitle ? <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
            </div>
        </div>
    );
}
