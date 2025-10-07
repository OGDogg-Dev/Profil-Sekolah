interface SectionHeadingProps {
    title: string;
    desc?: string;
    align?: 'left' | 'center';
    eyebrow?: string;
}

export default function SectionHeading({ title, desc, align = 'left', eyebrow }: SectionHeadingProps) {
    const alignment = align === 'center' ? 'text-center mx-auto' : '';

    return (
        <header className={`mx-auto max-w-[1100px] px-4 ${alignment}`}>
            {eyebrow && (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500 dark:text-brand-400">
                    {eyebrow}
                </p>
            )}
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{title}</h2>
            {desc && <p className="mt-3 text-base text-slate-600 dark:text-slate-300">{desc}</p>}
        </header>
    );
}
