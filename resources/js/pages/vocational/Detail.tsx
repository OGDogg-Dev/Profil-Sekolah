import { Head, usePage } from '@inertiajs/react';
import AppShell from '@/layouts/AppShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Clock, Users, Calendar, Award, Wrench, UserCheck } from 'lucide-react';
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

  return (
    <AppShell siteName={siteName}>
      <Head title={`${program.title} - ${siteName}`} />

      <section className="bg-gray-50 py-12">
        <div className="mx-auto w-full max-w-7xl px-6">
          <Breadcrumbs
            items={[
              { label: 'Vokasional', href: '/vokasional' },
              { label: program.title, href: `/vokasional/${program.slug}` },
            ]}
          />

          <header className="mt-6 border-b-4 border-blue-700 pb-4">
            <h1 className="text-3xl font-extrabold uppercase tracking-widest text-blue-700">
              {program.title}
            </h1>
            <p className="mt-2 text-lg text-gray-700">Where Tomorrow's Leaders Come Together</p>
          </header>

          <div className="mt-10 grid gap-10 lg:grid-cols-3">
            {/* Program Info */}
            <div className="space-y-8 rounded-3xl bg-white p-8 shadow-lg">
              {program.description && (
                <p className="text-gray-700 text-lg leading-relaxed">{program.description}</p>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                {program.audience && (
                  <div className="flex items-center gap-4">
                    <Users className="h-6 w-6 text-blue-700" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Target Audience</p>
                      <p className="text-sm text-gray-600">{program.audience}</p>
                    </div>
                  </div>
                )}

                {program.duration && (
                  <div className="flex items-center gap-4">
                    <Clock className="h-6 w-6 text-blue-700" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Durasi</p>
                      <p className="text-sm text-gray-600">{program.duration}</p>
                    </div>
                  </div>
                )}

                {program.schedule && (
                  <div className="flex items-center gap-4">
                    <Calendar className="h-6 w-6 text-blue-700" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Jadwal</p>
                      <p className="text-sm text-gray-600">{program.schedule}</p>
                    </div>
                  </div>
                )}
              </div>

              {program.outcomes && program.outcomes.length > 0 && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Award className="h-5 w-5 text-blue-700" />
                    Hasil Pembelajaran
                  </h3>
                  <ul className="list-disc space-y-2 pl-5 text-gray-600">
                    {program.outcomes.map((outcome, index) => (
                      <li key={index}>{outcome}</li>
                    ))}
                  </ul>
                </div>
              )}

              {program.facilities && program.facilities.length > 0 && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Wrench className="h-5 w-5 text-blue-700" />
                    Fasilitas
                  </h3>
                  <ul className="list-disc space-y-2 pl-5 text-gray-600">
                    {program.facilities.map((facility, index) => (
                      <li key={index}>{facility}</li>
                    ))}
                  </ul>
                </div>
              )}

              {program.mentors && program.mentors.length > 0 && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <UserCheck className="h-5 w-5 text-blue-700" />
                    Mentor
                  </h3>
                  <ul className="list-disc space-y-2 pl-5 text-gray-600">
                    {program.mentors.map((mentor, index) => (
                      <li key={index}>{mentor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Media Gallery */}
            {media.length > 0 && (
              <div className="rounded-3xl bg-white p-6 shadow-lg">
                <h3 className="mb-6 text-xl font-semibold text-gray-900">Galeri</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  {media.map((item) => (
                    <div
                      key={item.id}
                      className="aspect-video overflow-hidden rounded-lg border border-gray-300"
                    >
                      <img
                        src={item.url}
                        alt={item.alt || program.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
