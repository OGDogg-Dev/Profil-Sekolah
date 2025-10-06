import { Link } from '@inertiajs/react';
import { ChevronRight, Clock, MapPin } from 'lucide-react';

interface CardEventProps {
  dateBadge: string;
  title: string;
  location?: string | null;
  time?: string | null;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
}

export function CardEvent({
  dateBadge,
  title,
  location,
  time,
  ctaLabel = 'Tambah ke Kalender',
  ctaHref,
  onCtaClick,
}: CardEventProps) {
  const [day = '', date = ''] = dateBadge.split(' ');
  const showCta = Boolean(ctaHref || onCtaClick);
  const locationLabel = location ?? 'Lokasi menyusul';
  const timeLabel = time ?? 'Waktu menyusul';

  return (
    <article className="rounded-2xl border bg-white p-4 transition hover:shadow-md sm:p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
          <span className="text-xs font-medium uppercase">{day}</span>
          <span className="text-lg font-bold leading-none">{date}</span>
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 line-clamp-2">{title}</h3>
          <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
            <div className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" aria-hidden />
              <span>{locationLabel}</span>
            </div>
            <div className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" aria-hidden />
              <span>{timeLabel}</span>
            </div>
          </dl>
          {showCta ? (
            ctaHref ? (
              <Link
                href={ctaHref}
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:underline"
              >
                {ctaLabel} <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : (
              <button
                type="button"
                onClick={onCtaClick}
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:underline"
              >
                {ctaLabel} <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            )
          ) : null}
        </div>
      </div>
    </article>
  );
}
