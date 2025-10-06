import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type CardNewsProps = PropsWithChildren<{
  cover?: string | null;
  category?: string | null;
  title: string;
  excerpt?: string | null;
  date?: string | null;
  href?: string;
  className?: string;
}>;

export function CardNews({
  cover,
  category,
  title,
  excerpt,
  date,
  href,
  className = '',
  children,
}: CardNewsProps) {
  const Wrapper = href ? Link : 'div';
  const wrapperProps = href ? { href } : {};

  return (
    <article className={cn('group overflow-hidden rounded-2xl border bg-white transition hover:shadow-md', className)}>
      <div className="aspect-[4/3] bg-slate-100">
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
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
          {category ? <span className="inline-flex rounded bg-blue-50 px-2 py-1 text-blue-700">{category}</span> : null}
          {date ? <span className="text-slate-500">{date}</span> : null}
        </div>
        <h3 className="text-base font-semibold text-slate-900 line-clamp-2 sm:text-lg">{title}</h3>
        {excerpt ? <p className="mt-2 text-sm text-slate-600 line-clamp-2">{excerpt}</p> : null}
        {children}
        {href ? (
          <Wrapper
            {...wrapperProps}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline"
          >
            Baca selengkapnya <ArrowRight className="h-4 w-4" aria-hidden />
          </Wrapper>
        ) : null}
      </div>
    </article>
  );
}


