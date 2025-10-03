import type { ComponentType, SVGProps } from 'react';
import { cn } from '@/lib/cn';

export type StatsCardProps = {
    title: string;
    value: string;
    change?: string;
    icon?: ComponentType<SVGProps<SVGSVGElement>>;
    accent?: 'blue' | 'violet' | 'amber' | 'emerald' | 'rose';
    description?: string;
};

const ACCENT_MAP: Record<NonNullable<StatsCardProps['accent']>, string> = {
    blue: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
    violet: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
};

export function StatsCard({ title, value, change, description, icon: Icon, accent = 'blue' }: StatsCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex items-center justify-between gap-5">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">{title}</p>
                    <div className="mt-3 flex items-baseline gap-3">
                        <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</p>
                        {change ? (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-700 dark:text-emerald-100">
                                {change}
                            </span>
                        ) : null}
                    </div>
                    {description ? <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
                </div>
                {Icon ? (
                    <span
                        className={cn(
                            'grid h-14 w-14 place-items-center rounded-3xl text-lg',
                            ACCENT_MAP[accent],
                        )}
                    >
                        <Icon className="h-6 w-6" aria-hidden />
                    </span>
                ) : null}
            </div>
        </div>
    );
}
