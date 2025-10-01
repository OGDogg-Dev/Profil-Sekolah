import React from 'react';
import { useA11y } from '@/features/vocational/hooks/useA11y';

export default function A11yToolbar({ targetId = 'main-content' }: { targetId?: string }) {
    const { decreaseFont, increaseFont, resetFont, toggleContrast, highContrast } = useA11y();

    return (
        <div className="z-50 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-2 text-sm">
            <a
                href={`#${targetId}`}
                className="rounded-lg px-3 py-1 font-medium text-slate-700 underline focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
                Lewati ke konten utama
            </a>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={decreaseFont}
                    className="rounded-lg border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                    A-
                </button>
                <button
                    type="button"
                    onClick={resetFont}
                    className="rounded-lg border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                    Reset
                </button>
                <button
                    type="button"
                    onClick={increaseFont}
                    className="rounded-lg border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                    A+
                </button>
                <button
                    type="button"
                    onClick={toggleContrast}
                    aria-pressed={highContrast}
                    className={`rounded-lg border px-3 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-400 ${
                        highContrast ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                >
                    Kontras
                </button>
            </div>
        </div>
    );
}
