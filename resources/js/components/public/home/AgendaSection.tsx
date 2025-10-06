import { Link } from '@inertiajs/react';
import { CardEvent } from '@/components/public/CardEvent';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';

import type { HomeEventItem } from './types';

interface AgendaSectionProps {
  events: HomeEventItem[];
  heading?: {
    eyebrow?: string;
    title?: string;
    description?: string;
  };
}

const WEEKDAY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export function AgendaSection({ events, heading }: AgendaSectionProps) {
  const today = new Date();
  const highlights = new Set<number>();
  const agendaCards = events.slice(0, 3).map((event) => {
    const startDate = new Date(event.startAt);
    if (!Number.isNaN(startDate.getTime()) && isSameMonth(startDate, today)) {
      highlights.add(startDate.getDate());
    }

    const badge = formatDateBadge(event.startAt);
    const timeLabel = formatTimeRange(event.startAt, event.endAt);

    return {
      key: event.slug,
      title: event.title,
      location: event.location ?? 'Lokasi menyusul',
      badge,
      time: timeLabel,
      href: event.href,
    };
  });

  const calendarCells = buildCalendarCells(today, highlights);

  return (
    <section id="agenda" className="mt-12">
      <Container>
        <SectionHeader
          eyebrow={heading?.eyebrow ?? 'Kalender'}
          title={heading?.title ?? 'Agenda Terdekat'}
          desc={heading?.description}
          action={<Link href="/agenda" className="hover:underline">Lihat semua</Link>}
        />
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-5">
            <div className="rounded-2xl border bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-medium">{formatMonth(today)}</span>
                <span className="text-sm text-slate-500">Kalender</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500">
                {WEEKDAY_LABELS.map((label) => (
                  <span key={label} className="py-1">
                    {label}
                  </span>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-7 gap-1">
                {calendarCells.map((cell, index) => (
                  <span
                    key={index}
                    className={`flex aspect-square items-center justify-center rounded-lg border text-xs font-semibold ${
                      cell.label
                        ? cell.highlighted
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 text-slate-500'
                        : 'border-transparent'
                    }`}
                  >
                    {cell.label}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-500">Tanggal dengan sorotan menandai adanya agenda pada bulan ini.</p>
            </div>
          </div>
          <div className="col-span-12 space-y-4 lg:col-span-7">
            {agendaCards.length ? (
              agendaCards.map((event) => (
                <CardEvent
                  key={event.key}
                  dateBadge={event.badge}
                  title={event.title}
                  location={event.location}
                  time={event.time}
                  ctaLabel="Detail Agenda"
                  ctaHref={event.href}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed bg-white p-6 text-sm text-slate-500">
                Belum ada agenda terdekat.
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}


function formatMonth(date: Date) {
  return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
}

function isSameMonth(a: Date, b: Date) {
  return a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

function formatDateBadge(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '???';
  }
  const weekday = new Intl.DateTimeFormat('id-ID', { weekday: 'short' })
    .format(date)
    .replace('.', '')
    .slice(0, 3);
  const day = date.getDate().toString().padStart(2, '0');
  return `${weekday} ${day}`;
}

function formatTimeRange(startString: string, endString?: string | null) {
  const start = new Date(startString);
  if (Number.isNaN(start.getTime())) {
    return undefined;
  }

  if (!endString) {
    return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(start);
  }

  const end = new Date(endString);
  if (Number.isNaN(end.getTime())) {
    return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(start);
  }

  const startTime = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(start);
  const endTime = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(end);
  return `${startTime} - ${endTime}`;
}

function buildCalendarCells(reference: Date, highlights: Set<number>) {
  const year = reference.getFullYear();
  const month = reference.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (firstDay.getDay() + 6) % 7; // shift so Monday is first column

  return Array.from({ length: 35 }).map((_, index) => {
    const dayNumber = index - offset + 1;
    const inMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
    return {
      label: inMonth ? dayNumber.toString().padStart(2, '0') : '',
      highlighted: inMonth && highlights.has(dayNumber),
    };
  });
}
