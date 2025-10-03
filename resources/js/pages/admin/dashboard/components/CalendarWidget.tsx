const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export function CalendarWidget() {
    const now = new Date();
    const monthName = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const today = now.getDate();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const leadingEmpty = start.getDay();
    const days = Array.from({ length: end.getDate() }, (_, index) => index + 1);

    return (
        <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Kalender</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{monthName}</p>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs">
                {DAYS.map((day) => (
                    <span key={day} className="font-semibold text-slate-400 dark:text-slate-500">
                        {day}
                    </span>
                ))}
                {Array.from({ length: leadingEmpty }).map((_, index) => (
                    <span key={`empty-${index}`} />
                ))}
                {days.map((day) => {
                    const isToday = day === today;
                    return (
                        <span
                            key={day}
                            className={`block rounded-full py-1 text-sm ${
                                isToday
                                    ? 'bg-brand-500 text-white'
                                    : 'text-slate-600 dark:text-slate-300'
                            }`}
                        >
                            {day}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
