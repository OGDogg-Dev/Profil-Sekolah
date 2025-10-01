import React from 'react';
import { cn } from '@/lib/cn';

type PillProps = React.PropsWithChildren<{ className?: string }>;

export default function Pill({ children, className = '' }: PillProps) {
    return (
        <span className={cn('inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700', className)}>
            {children}
        </span>
    );
}
