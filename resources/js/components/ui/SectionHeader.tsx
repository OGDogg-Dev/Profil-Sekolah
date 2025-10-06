import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  desc?: string;
  action?: ReactNode;
  className?: string;
};

export function SectionHeader({ eyebrow, title, desc, action, className = '' }: SectionHeaderProps) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8', className)}>
      <div>
        {eyebrow ? <div className="mb-1 text-xs uppercase tracking-wider text-slate-500">{eyebrow}</div> : null}
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">{title}</h2>
        {desc ? <p className="mt-1 max-w-prose text-slate-600">{desc}</p> : null}
      </div>
      {action ? <div className="text-sm text-slate-700">{action}</div> : null}
    </div>
  );
}
