import { FormEvent, useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';

import { UploadDropzone } from '@/components/admin/UploadDropzone';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';

interface HighlightItem {
  title: string;
  description: string;
  href?: string;
}

interface StatItem {
  label: string;
  value: string;
}

interface TestimonialItem {
  quote: string;
  name: string;
  role?: string | null;
}

interface MediaItem {
  id: number;
  collection: string;
  key: string;
  url: string;
  alt?: string | null;
  type: string;
}

interface HomeSettings {
  hero_eyebrow: string;
  hero_title: string;
  hero_description: string;
  hero_primary_label: string;
  hero_primary_link: string;
  hero_secondary_label: string;
  hero_secondary_link: string;
  highlights: HighlightItem[];
  stats: StatItem[];
  news_title: string;
  news_description: string;
  agenda_title: string;
  agenda_description: string;
  gallery_title: string;
  gallery_description: string;
  testimonials_title: string;
  testimonials_items: TestimonialItem[];
}

interface MediaSettings {
  home: {
    hero?: MediaItem | null;
  };
}

interface PublicContentProps {
  home: HomeSettings;
  media: MediaSettings;
  general?: Record<string, unknown>;
  profile?: Record<string, unknown>;
  vision?: Record<string, unknown>;
  contact?: Record<string, unknown>;
}

interface SharedPageProps {
  flash?: {
    success?: string;
  };
  [key: string]: unknown;
}

export default function PublicContentEdit({ home, media }: PublicContentProps) {
  const { props } = usePage<SharedPageProps>();
  const flash = props?.flash;

  const homeForm = useForm<HomeSettings>({
    ...home,
    highlights: home.highlights ?? [],
    stats: home.stats ?? [],
    testimonials_items: home.testimonials_items ?? [],
    news_description: home.news_description ?? '',
    agenda_description: home.agenda_description ?? '',
    gallery_description: home.gallery_description ?? '',
  });

  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroAlt, setHeroAlt] = useState(media.home.hero?.alt ?? '');

  const submitHome = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    homeForm.transform((data) => ({ section: 'home', data }));
    homeForm.post('/admin/public-content', {
      preserveScroll: true,
      onFinish: () => homeForm.transform((data) => data),
    });
  };

  const uploadHero = () => {
    if (!heroFile) {
      return;
    }

    const payload = {
      collection: 'home',
      key: 'hero',
      file: heroFile,
      alt: heroAlt,
    };

    router.post('/admin/public-content/media', payload, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setHeroFile(null);
      },
    });
  };

  const removeHero = () => {
    router.delete('/admin/public-content/media', {
      preserveScroll: true,
      data: {
        collection: 'home',
        key: 'hero',
      },
      onSuccess: () => {
        setHeroFile(null);
        setHeroAlt('');
      },
    });
  };

  const addHighlight = () => {
    homeForm.setData('highlights', [
      ...homeForm.data.highlights,
      { title: '', description: '', href: '' },
    ]);
  };

  const updateHighlight = (index: number, field: keyof HighlightItem, value: string) => {
    const next = [...homeForm.data.highlights];
    next[index] = { ...next[index], [field]: value };
    homeForm.setData('highlights', next);
  };

  const removeHighlight = (index: number) => {
    const next = [...homeForm.data.highlights];
    next.splice(index, 1);
    homeForm.setData('highlights', next);
  };

  const addStat = () => {
    homeForm.setData('stats', [...homeForm.data.stats, { label: '', value: '' }]);
  };

  const updateStat = (index: number, field: keyof StatItem, value: string) => {
    const next = [...homeForm.data.stats];
    next[index] = { ...next[index], [field]: value };
    homeForm.setData('stats', next);
  };

  const removeStat = (index: number) => {
    const next = [...homeForm.data.stats];
    next.splice(index, 1);
    homeForm.setData('stats', next);
  };

  const addTestimonial = () => {
    homeForm.setData('testimonials_items', [
      ...homeForm.data.testimonials_items,
      { quote: '', name: '', role: '' },
    ]);
  };

  const updateTestimonial = (index: number, field: keyof TestimonialItem, value: string) => {
    const next = [...homeForm.data.testimonials_items];
    next[index] = { ...next[index], [field]: value };
    homeForm.setData('testimonials_items', next);
  };

  const removeTestimonial = (index: number) => {
    const next = [...homeForm.data.testimonials_items];
    next.splice(index, 1);
    homeForm.setData('testimonials_items', next);
  };

  return (
    <AdminLayout title="Konten Halaman Publik">
      <Head title="Konten Publik" />

      {flash?.success ? (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {flash.success}
        </div>
      ) : null}

      <section className="space-y-8">
        <article className="rounded-2xl border bg-white p-6 shadow-sm">
          <header className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Halaman Beranda</h2>
            <p className="text-sm text-slate-500">Kelola konten hero, highlight, statistik, dan testimoni yang tampil di beranda.</p>
          </header>

          <form onSubmit={submitHome} className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Hero Eyebrow"
                value={homeForm.data.hero_eyebrow}
                onChange={(value) => homeForm.setData('hero_eyebrow', value)}
              />
              <TextField
                label="Hero Title"
                value={homeForm.data.hero_title}
                onChange={(value) => homeForm.setData('hero_title', value)}
              />
              <TextAreaField
                label="Hero Description"
                value={homeForm.data.hero_description}
                onChange={(value) => homeForm.setData('hero_description', value)}
                rows={3}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Tombol Utama (label)"
                  value={homeForm.data.hero_primary_label}
                  onChange={(value) => homeForm.setData('hero_primary_label', value)}
                />
                <TextField
                  label="Tombol Utama (link)"
                  value={homeForm.data.hero_primary_link}
                  onChange={(value) => homeForm.setData('hero_primary_link', value)}
                />
                <TextField
                  label="Tombol Sekunder (label)"
                  value={homeForm.data.hero_secondary_label}
                  onChange={(value) => homeForm.setData('hero_secondary_label', value)}
                />
                <TextField
                  label="Tombol Sekunder (link)"
                  value={homeForm.data.hero_secondary_link}
                  onChange={(value) => homeForm.setData('hero_secondary_link', value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">Media Hero</h3>
              <UploadDropzone
                label="File Hero"
                description="Format JPG/PNG/WEBP, maksimal 5MB."
                file={heroFile}
                existingUrl={!heroFile ? media.home.hero?.url ?? null : null}
                onSelect={setHeroFile}
              />
              <TextField
                label="Hero Alt Text"
                value={heroAlt}
                onChange={setHeroAlt}
                helperText="Deskripsi singkat untuk pembaca layar."
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={uploadHero}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                  disabled={!heroFile}
                >
                  Unggah Media
                </button>
                {media.home.hero ? (
                  <button
                    type="button"
                    onClick={removeHero}
                    className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                  >
                    Hapus Media
                  </button>
                ) : null}
              </div>
            </div>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Highlight</h3>
                <button type="button" onClick={addHighlight} className="text-sm text-slate-600 hover:text-slate-900">
                  + Tambah Highlight
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {homeForm.data.highlights.map((item, index) => (
                  <div key={`highlight-${index}`} className="space-y-3 rounded-xl border p-4">
                    <TextField
                      label="Judul"
                      value={item.title}
                      onChange={(value) => updateHighlight(index, 'title', value)}
                    />
                    <TextAreaField
                      label="Deskripsi"
                      value={item.description}
                      onChange={(value) => updateHighlight(index, 'description', value)}
                      rows={2}
                    />
                    <TextField
                      label="Link (opsional)"
                      value={item.href ?? ''}
                      onChange={(value) => updateHighlight(index, 'href', value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Hapus Highlight
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Statistik</h3>
                <button type="button" onClick={addStat} className="text-sm text-slate-600 hover:text-slate-900">
                  + Tambah Statistik
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {homeForm.data.stats.map((item, index) => (
                  <div key={`stat-${index}`} className="space-y-3 rounded-xl border p-4">
                    <TextField
                      label="Label"
                      value={item.label}
                      onChange={(value) => updateStat(index, 'label', value)}
                    />
                    <TextField
                      label="Nilai"
                      value={item.value}
                      onChange={(value) => updateStat(index, 'value', value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeStat(index)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Hapus Statistik
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Testimoni</h3>
                <button type="button" onClick={addTestimonial} className="text-sm text-slate-600 hover:text-slate-900">
                  + Tambah Testimoni
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {homeForm.data.testimonials_items.map((item, index) => (
                  <div key={`testimonial-${index}`} className="space-y-3 rounded-xl border p-4">
                    <TextAreaField
                      label="Kutipan"
                      value={item.quote}
                      onChange={(value) => updateTestimonial(index, 'quote', value)}
                      rows={3}
                    />
                    <TextField
                      label="Nama"
                      value={item.name}
                      onChange={(value) => updateTestimonial(index, 'name', value)}
                    />
                    <TextField
                      label="Peran"
                      value={item.role ?? ''}
                      onChange={(value) => updateTestimonial(index, 'role', value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeTestimonial(index)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Hapus Testimoni
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid gap-4 md:grid-cols-3">
              <TextField
                label="Judul Seksi Berita"
                value={homeForm.data.news_title}
                onChange={(value) => homeForm.setData('news_title', value)}
              />
              <TextField
                label="Judul Seksi Agenda"
                value={homeForm.data.agenda_title}
                onChange={(value) => homeForm.setData('agenda_title', value)}
              />
              <TextField
                label="Judul Seksi Galeri"
                value={homeForm.data.gallery_title}
                onChange={(value) => homeForm.setData('gallery_title', value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <TextAreaField
                label="Deskripsi Berita"
                value={homeForm.data.news_description}
                onChange={(value) => homeForm.setData('news_description', value)}
                rows={2}
              />
              <TextAreaField
                label="Deskripsi Agenda"
                value={homeForm.data.agenda_description}
                onChange={(value) => homeForm.setData('agenda_description', value)}
                rows={2}
              />
              <TextAreaField
                label="Deskripsi Galeri"
                value={homeForm.data.gallery_description}
                onChange={(value) => homeForm.setData('gallery_description', value)}
                rows={2}
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                disabled={homeForm.processing}
              >
                Simpan Beranda
              </button>
            </div>
          </form>
        </article>
      </section>
    </AdminLayout>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  helperText?: string;
};

function TextField({ label, value, onChange, error, type = 'text', helperText }: TextFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-700">
      <span className="font-medium text-slate-900">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
      />
      {helperText ? <span className="text-xs text-slate-500">{helperText}</span> : null}
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </label>
  );
}

type TextAreaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  error?: string;
};

function TextAreaField({ label, value, onChange, rows = 4, error }: TextAreaFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-700">
      <span className="font-medium text-slate-900">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
      />
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </label>
  );
}


