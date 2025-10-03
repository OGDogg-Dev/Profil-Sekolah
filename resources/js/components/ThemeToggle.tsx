import { useEffect, useMemo, useState } from 'react';
import type { SVGProps } from 'react';
import { useAppearance } from '@/hooks/use-appearance';

function SunIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path
                d="M12 4.5V2m0 20v-2.5M4.5 12H2m20 0h-2.5M5.636 5.636 4.222 4.222M19.778 19.778l-1.414-1.414M18.364 5.636l1.414-1.414M5.636 18.364 4.222 19.778"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="4" fill="currentColor" />
        </svg>
    );
}

function MoonIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" fill="currentColor" />
        </svg>
    );
}

const prefersDark = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

export default function ThemeToggle() {
    const { appearance, updateAppearance } = useAppearance();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = useMemo(() => {
        if (appearance === 'dark') {
            return true;
        }

        if (appearance === 'light') {
            return false;
        }

        if (mounted && typeof window !== 'undefined') {
            return prefersDark();
        }

        if (typeof document !== 'undefined') {
            return document.documentElement.classList.contains('dark');
        }

        return false;
    }, [appearance, mounted]);

    const handleToggle = () => {
        updateAppearance(isDark ? 'light' : 'dark');
    };

    return (
        <button
            type="button"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={isDark}
            onClick={handleToggle}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/60 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
            <span className="relative block h-5 w-5">
                <SunIcon
                    className={`absolute inset-0 h-5 w-5 transition-opacity ${isDark ? 'opacity-0' : 'opacity-100'}`}
                />
                <MoonIcon
                    className={`absolute inset-0 h-5 w-5 transition-opacity ${isDark ? 'opacity-100' : 'opacity-0'}`}
                />
            </span>
        </button>
    );
}
