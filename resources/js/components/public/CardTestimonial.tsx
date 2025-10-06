import { Star } from 'lucide-react';

interface CardTestimonialProps {
  quote: string;
  name: string;
  role?: string;
}

export function CardTestimonial({ quote, name, role }: CardTestimonialProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 sm:p-6">
      <div className="flex items-center gap-1 text-amber-500" aria-hidden>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="mt-3 text-slate-700">&ldquo;{quote}&rdquo;</p>
      <div className="mt-4 text-sm text-slate-500">
        {role ? `${name} - ${role}` : name}
      </div>
    </div>
  );
}
