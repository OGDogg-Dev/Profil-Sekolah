import { Head, Link, usePage } from '@inertiajs/react';
import { PublicLayout } from '@/layouts/public/PublicLayout';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Clock, Users, Calendar, Award, Wrench, UserCheck, ArrowUpRight, ArrowLeft } from 'lucide-react';
import type { VocationalProgram } from '@/features/vocational/types';

interface VocationalDetailProps {
  program: VocationalProgram;
}

type PageProps = {
  settings?: {
    site_name?: string;
  };
};

export default function VocationalDetail({ program }: VocationalDetailProps) {
  const { props } = usePage<PageProps>();
  const siteName = props?.settings?.site_name ?? 'SMK Negeri 10 Kuningan';

  // Combine media from DB and fallback photos array if media is empty
  const media =
    program.media && program.media.length > 0
      ? program.media.map((item) => ({
          ...item,
          url: item.url.startsWith('http') ? item.url : `/storage/${item.url}`,
        }))
      : (program.photos || []).map((photo, index) => ({
          id: index + 1,
          type: 'image' as const,
          url: photo.startsWith('http') ? photo : `/storage/${photo}`,
          alt: program.title,
        }));

  const description = program.description ?? `Program vokasional ${program.title} di ${siteName} dirancang untuk mendukung kemandirian dan keterampilan peserta didik.`;

  return (
    <PublicLayout>
      <Head title={`${program.title} - ${siteName}`}>
        <meta name="description" content={description} />
      </Head>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-50">
          <div className="absolute -left-24 top-24 h-56 w-56 rounded-full bg-emerald-400/30 blur-3xl" />
          <div className="absolute -right-16 bottom-16 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-14 lg:pt-20">
          <Breadcrumbs
            items={[
              { label: 'Vokasional', href: '/vokasional' },
              { label: program.title },
            ]}
            variant="dark"
          />
          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-white/70">
            <Link
              href="/vokasional"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 font-semibold text-white transition hover:bg-white/10"
            >
              <ArrowLeft size={14} aria-hidden /> Kembali ke Vokasional
            </Link>
          </div>
          <header className="mt-10 space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">Program Vokasional</p>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{program.title}</h1>
            <p className="max-w-2xl text-base text-slate-100 sm:text-lg">{description}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/kontak"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300"
              >
                Daftar Program
                <ArrowUpRight size={16} aria-hidden />
              </Link>
              <Link
                href="/agenda"
                className="inline-flex items-center gap-2 rounded-full border border-white/60 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Lihat Agenda
              </Link>
            </div>
          </header>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-6xl px-4">

          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
            {/* Main Content */}
            <div className="space-y-10">
              {/* Program Overview */}
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="mb-6 text-2xl font-semibold text-slate-900">Tentang Program</h2>
                {program.description && (
                  <p className="text-slate-700 text-lg leading-relaxed">{program.description}</p>
                )}
              </div>

              {/* Program Details Grid */}
              <div className="grid gap-6 sm:grid-cols-2">
                {program.audience && (
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <Users className="h-8 w-8 text-emerald-600" />
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Target Audience</p>
                        <p className="text-lg font-semibold text-slate-900">{program.audience}</p>
                      </div>
                    </div>
                  </div>
                )}

                {program.duration && (
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <Clock className="h-8 w-8 text-emerald-600" />
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Durasi</p>
                        <p className="text-lg font-semibold text-slate-900">{program.duration}</p>
                      </div>
                    </div>
                  </div>
                )}

                {program.schedule && (
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <Calendar className="h-8 w-8 text-emerald-600" />
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Jadwal</p>
                        <p className="text-lg font-semibold text-slate-900">{program.schedule}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Outcomes */}
              {program.outcomes && program.outcomes.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <h3 className="mb-6 flex items-center gap-3 text-xl font-semibold text-slate-900">
                    <Award className="h-6 w-6 text-emerald-600" />
                    Hasil Pembelajaran
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {program.outcomes.map((outcome, index) => (
                      <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-slate-700">{outcome}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Facilities */}
              {program.facilities && program.facilities.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <h3 className="mb-6 flex items-center gap-3 text-xl font-semibold text-slate-900">
                    <Wrench className="h-6 w-6 text-emerald-600" />
                    Fasilitas
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {program.facilities.map((facility, index) => (
                      <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-slate-700">{facility}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mentors */}
              {program.mentors && program.mentors.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <h3 className="mb-6 flex items-center gap-3 text-xl font-semibold text-slate-900">
                    <UserCheck className="h-6 w-6 text-emerald-600" />
                    Mentor
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {program.mentors.map((mentor, index) => (
                      <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-slate-700">{mentor}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Media Gallery */}
              {media.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-6 text-lg font-semibold text-slate-900">Galeri Program</h3>
                  <div className="grid gap-4">
                    {media.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="aspect-video overflow-hidden rounded-xl border border-slate-200"
                      >
                        <img
                          src={item.url}
                          alt={item.alt || program.title}
                          className="h-full w-full object-cover transition hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                  {media.length > 4 && (
                    <p className="mt-4 text-sm text-slate-500">
                      +{media.length - 4} foto lainnya tersedia
                    </p>
                  )}
                </div>
              )}

              {/* Call to Action */}
              <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-slate-50 p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Siap Bergabung?</h3>
                <p className="mb-6 text-sm text-slate-600">
                  Daftar sekarang dan mulai perjalanan kemandirian Anda bersama program vokasional kami.
                </p>
                <Link
                  href="/kontak"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Daftar Sekarang
                  <ArrowUpRight size={16} aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
