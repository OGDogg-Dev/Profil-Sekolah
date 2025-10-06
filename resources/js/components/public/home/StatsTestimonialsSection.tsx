import { CardTestimonial } from '@/components/public/CardTestimonial';
import { CardStat } from '@/components/public/CardStat';
import { Container } from '@/components/ui/Container';

import type { HomeStatItem, HomeTestimonial } from './types';
import { Image as ImageIcon, School, Sparkles, Star, Users } from 'lucide-react';

interface StatsTestimonialsSectionProps {
  stats?: HomeStatItem[];
  testimonials?: HomeTestimonial[];
}

const DEFAULT_STATS: HomeStatItem[] = [
  { label: 'Siswa', value: '1.200+' },
  { label: 'Tenaga Pendidik', value: '85' },
  { label: 'Akreditasi', value: 'A' },
  { label: 'Dokumentasi', value: '+500' },
];

const DEFAULT_TESTIMONIALS: HomeTestimonial[] = [
  {
    quote: 'Anak saya lebih percaya diri; guru pendamping sangat suportif dan programnya jelas.',
    name: 'Ibu Sari',
    role: 'Orang tua',
  },
  {
    quote: 'Lab komputer aksesibel membuat saya berani melanjutkan belajar koding.',
    name: 'Rafi',
    role: 'Alumni',
  },
];

const STAT_ICONS = [Users, School, Star, ImageIcon];

export function StatsTestimonialsSection({ stats, testimonials = DEFAULT_TESTIMONIALS }: StatsTestimonialsSectionProps) {
  const statItems = stats && stats.length ? stats : DEFAULT_STATS;

  return (
    <section className="mt-12">
      <Container>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 grid grid-cols-12 gap-6 lg:col-span-7">
            {statItems.map((item, index) => {
              const IconComponent = STAT_ICONS[index % STAT_ICONS.length] ?? Sparkles;
              return (
                <div key={`${item.label}-${index}`} className="col-span-6">
                  <CardStat icon={IconComponent} label={item.label} value={item.value} />
                </div>
              );
            })}
          </div>
          <div className="col-span-12 grid gap-4 lg:col-span-5">
            {testimonials.map((item) => (
              <CardTestimonial key={`${item.name}-${item.quote}`} quote={item.quote} name={item.name} role={item.role} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
