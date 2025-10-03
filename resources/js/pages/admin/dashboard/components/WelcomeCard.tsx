interface WelcomeCardProps {
    name?: string;
    subtitle: string;
    stats: Array<{ label: string; value: string; pill?: string }>;
}

export function WelcomeCard({ name = 'Admin', subtitle, stats }: WelcomeCardProps) {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-600 text-white shadow-xl">
            <div className="absolute inset-y-0 left-0 w-40 -translate-x-12 rounded-full bg-white/25 blur-3xl" aria-hidden />
            <div className="absolute inset-y-0 right-0 w-64 translate-x-24 rounded-full bg-white/10 blur-3xl" aria-hidden />
            <div className="relative grid gap-8 px-10 py-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
                <div className="space-y-5">
                    <p className="text-sm uppercase tracking-widest text-white/80">Dashboard</p>
                    <h2 className="text-3xl font-extrabold tracking-tight">Hai, {name.split(' ')[0]}!</h2>
                    <p className="max-w-xl text-base text-white/90">{subtitle}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-3xl border border-white/30 bg-white/20 p-5 text-center shadow-lg backdrop-blur-md transition hover:scale-105 hover:shadow-2xl"
                        >
                            <p className="text-xs uppercase tracking-widest text-white/80">{stat.label}</p>
                            <p className="mt-3 text-xl font-extrabold">{stat.value}</p>
                            {stat.pill ? <p className="mt-1 text-sm text-white/90">{stat.pill}</p> : null}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
