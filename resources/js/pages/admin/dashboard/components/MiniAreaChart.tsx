import { useId } from 'react';

interface MiniAreaChartProps {
    title: string;
    data: Array<{ label: string; value: number }>;
    highlight?: string;
    footer?: string;
}

export function MiniAreaChart({ title, data, highlight, footer }: MiniAreaChartProps) {
    const safeData = data.length ? data : [{ label: 'Jan', value: 0 }];
    const max = Math.max(...safeData.map((item) => item.value), 1);
    const points = safeData
        .map((item, index) => {
            const x = safeData.length === 1 ? 0 : (index / (safeData.length - 1)) * 100;
            const y = 100 - (item.value / max) * 80 - 10;
            return `${x},${Math.min(100, Math.max(0, y))}`;
        })
        .join(' ');

    const areaPoints = `${points} 100,100 0,100`;
    const gradientId = useId();

    return (
        <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{title}</p>
                    {highlight ? <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{highlight}</p> : null}
                </div>
            </div>
            <div className="mt-4 h-36 w-full">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                    <defs>
                        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="rgb(29 78 216)" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="rgb(29 78 216)" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <polyline
                        points={areaPoints}
                        fill={`url(#${gradientId})`}
                        stroke="none"
                    />
                    <polyline
                        points={points}
                        fill="none"
                        stroke="rgb(29 78 216)"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex gap-2">
                    {safeData.map((item) => (
                        <span key={item.label} className="uppercase tracking-[0.3em]">
                            {item.label}
                        </span>
                    ))}
                </div>
                {footer ? <span>{footer}</span> : null}
            </div>
        </div>
    );
}
