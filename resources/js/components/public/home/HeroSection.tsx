import { Link } from '@inertiajs/react';
import { Image as ImageIcon } from 'lucide-react';

interface HeroSectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  media?: { src?: string | null; alt?: string; type?: string };
}

const DEFAULT_EYEBROW = 'Sekolah Inklusif - Ramah Disabilitas';
const DEFAULT_TITLE = 'Setiap Anak Berhak Tumbuh & Berprestasi';
const DEFAULT_DESCRIPTION = 'Lingkungan belajar yang aman, aksesibel, dan menyenangkan dengan dukungan guru pendamping, terapi, serta teknologi asistif.';
const DEFAULT_PRIMARY = { href: '/ppdb', label: 'Daftar PPDB' };
const DEFAULT_SECONDARY = { href: '/hubungi-kami', label: 'Hubungi Kami' };

export function HeroSection({
  eyebrow = DEFAULT_EYEBROW,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  primaryCta = DEFAULT_PRIMARY,
  secondaryCta = DEFAULT_SECONDARY,
  media,
}: HeroSectionProps) {
  return (
    <section id="home" className="pt-10 sm:pt-14">
      <div className="mx-auto grid max-w-[1200px] grid-cols-12 items-center gap-6 px-4 sm:px-6 lg:px-8">
        <div className="col-span-12 space-y-4 lg:col-span-7">
          <span className="inline-flex items-center gap-2 rounded bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
            {eyebrow}
          </span>
          <h1 className="max-w-2xl text-2xl font-bold leading-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-prose text-sm text-slate-600 sm:text-base">{description}</p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            {primaryCta ? (
              <Link href={primaryCta.href} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">
                {primaryCta.label}
              </Link>
            ) : null}
            {secondaryCta ? (
              <Link href={secondaryCta.href} className="rounded-xl border px-4 py-2.5 text-sm font-semibold text-slate-900">
                {secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-100 to-indigo-100">
            {media?.src ? (
              media.type === 'video' ? (
                <video src={media.src} className="h-full w-full object-cover" autoPlay muted loop />
              ) : (
                <img src={media.src} alt={media.alt ?? ''} className="h-full w-full object-cover" />
              )
            ) : (
              <div className="flex flex-col items-center text-sm text-slate-500">
                <ImageIcon className="h-10 w-10" aria-hidden />
                <span className="mt-2">Ilustrasi atau video hero</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

