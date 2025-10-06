import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { Image as ImageIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type CardProgramProps = {
  cover?: string | null;
  title: string;
  badge?: string;
  items?: string[];
  detailHref?: string;
  applyHref?: string;
  actions?: ReactNode;
  className?: string;
};

export function CardProgram({
  cover,
  title,
  badge,
  items = [],
  detailHref,
  applyHref,
  actions,
  className = '',
}: CardProgramProps) {
  return (
    <article className={cn('group overflow-hidden rounded-2xl border bg-white transition hover:shadow-md', className)}>
      <div className="aspect-[16/10] bg-slate-100">
        {cover ? (
          <img
            src={cover}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
            <ImageIcon className="h-10 w-10" aria-hidden />
            <span className="text-xs">Belum ada foto</span>
          </div>
        )}
      </div>
      <div className="p-4 sm:p-5">
        {badge ? <span className="mb-2 inline-flex items-center rounded bg-emerald-50 px-2 py-1 text-xs text-emerald-700">{badge}</span> : null}
        <h3 className="text-base font-semibold text-slate-900 line-clamp-2 sm:text-lg">{title}</h3>
        {items.length ? (
          <ul className="mt-3 space-y-1 text-sm text-slate-600">
            {items.slice(0, 3).map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden>-</span>
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-3">
          {actions ? (
            actions
          ) : (
            <>
              {detailHref ? (
                <Link href={detailHref} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white">
                  Detail
                </Link>
              ) : null}
              {applyHref ? (
                <Link href={applyHref} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">
                  Daftar
                </Link>
              ) : null}
            </>
          )}
        </div>
      </div>
    </article>
  );
}


