import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { ArrowRight, Calendar, Image as ImageIcon, Newspaper, School, Sparkles } from 'lucide-react';

import type { HomeHighlightItem } from './types';

interface HighlightView extends HomeHighlightItem {
  icon: ReactNode;
}

interface HighlightsSectionProps {
  items?: HomeHighlightItem[];
}

const DEFAULT_ITEMS: HighlightView[] = [
  {
    icon: <School className="h-5 w-5" aria-hidden />,
    title: 'Program Unggulan',
    description: 'Inklusi SD-SMA, terapi wicara dan okupasi, teknologi asistif serta koding.',
    href: '/vokasional',
  },
  {
    icon: <Newspaper className="h-5 w-5" aria-hidden />,
    title: 'Berita Terbaru',
    description: 'Sorotan kegiatan dan prestasi siswa setiap pekan.',
    href: '/berita',
  },
  {
    icon: <Calendar className="h-5 w-5" aria-hidden />,
    title: 'Agenda',
    description: 'Seminar orang tua, open house, dan perayaan inklusi nasional.',
    href: '/agenda',
  },
  {
    icon: <ImageIcon className="h-5 w-5" aria-hidden />,
    title: 'Galeri',
    description: 'Fasilitas aksesibel dan dokumentasi kegiatan siswa.',
    href: '/galeri',
  },
];

const ICON_ROTATION = [School, Newspaper, Calendar, ImageIcon];

export function HighlightsSection({ items }: HighlightsSectionProps) {
  const resolvedItems: HighlightView[] = (items && items.length
    ? items.map((item, index) => {
        const IconComponent = ICON_ROTATION[index % ICON_ROTATION.length] ?? Sparkles;
        return {
          ...item,
          icon: <IconComponent className="h-5 w-5" aria-hidden />,
        };
      })
    : DEFAULT_ITEMS);

  return (
    <section className="mt-12">
      <div className="mx-auto grid max-w-[1200px] grid-cols-12 gap-6 px-4 sm:px-6 lg:px-8">
        {resolvedItems.map((item) => (
          <div key={item.title} className="col-span-12 sm:col-span-6 lg:col-span-3">
            <div className="flex h-full flex-col gap-3 rounded-2xl border bg-white p-5 shadow-sm">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                {item.icon}
                {item.title}
              </span>
              {item.description ? <p className="text-sm text-slate-600">{item.description}</p> : null}
              {item.href ? (
                <Link
                  href={item.href}
                  className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:underline"
                >
                  Lihat
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              ) : (
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-emerald-600">
                  Lihat
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
