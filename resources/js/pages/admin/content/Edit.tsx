import { useEffect, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';

type SectionKey = 'home' | 'profil' | 'visi';

type Highlight = {
    icon: string;
    title: string;
    description: string;
    link: string;
};

type Testimonial = {
    name: string;
    role: string;
    quote: string;
};

type HeroSettings = {
    title: string;
    subtitle: string;
    cta1_label: string;
    cta1_url: string;
    cta2_label: string;
    cta2_url: string;
    overlay: number;
};

type ContentSettings = {
    hero?: HeroSettings & { alt?: string };
    highlights?: Highlight[];
    newsMode?: 'auto' | 'manual';
    pins?: number[];
    agendaLimit?: number;
    galleryMode?: 'album' | 'manual';
    galleryAlbumId?: number | string | null;
    galleryManual?: number[];
    stats?: {
        students?: number;
        teachers?: number;
        accreditation?: string;
        photos?: number;
    };
    testimonials?: Testimonial[];
    showHighlights?: boolean;
    showStats?: boolean;
    showTestimonials?: boolean;
};

type PageProps = {
    section: SectionKey;
    settings?: ContentSettings | null;
    hero_url?: string | null;
    flash?: { success?: string };
    updateUrl?: string;
    availableNews?: Array<{ id: number; title: string }>;
    galleryAlbums?: Array<{ id: number; name: string }>;
};

type FormValues = {
    section: SectionKey;
    heroFile: File | null;
    heroAlt: string;
    hero: HeroSettings;
    highlights: Highlight[];
    showHighlights: boolean;
    newsMode: 'auto' | 'manual';
    pins: number[];
    agendaLimit: number;
    galleryMode: 'album' | 'manual';
    galleryAlbumId: string;
    galleryManual: string;
    stats: {
        students: string;
        teachers: string;
        accreditation: string;
        photos: string;
    };
    showStats: boolean;
    testimonials: Testimonial[];
    showTestimonials: boolean;
};

const DEFAULT_HERO: HeroSettings = {
    title: '',
    subtitle: '',
    cta1_label: '',
    cta1_url: '',
    cta2_label: '',
    cta2_url: '',
    overlay: 60,
};

const buildHighlights = (initial?: Highlight[]): Highlight[] => {
    const base = initial ?? [];
    return Array.from({ length: 4 }).map((_, index) => base[index] ?? { icon: '', title: '', description: '', link: '' });
};

const buildTestimonials = (initial?: Testimonial[]): Testimonial[] => {
    if (!initial || initial.length === 0) {
        return [
            {
                name: '',
                role: '',
                quote: '',
            },
        ];
    }

    return initial;
};

function Toast({ message }: { message: string }) {
    return (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl dark:bg-emerald-500">
            {message}
        </div>
    );
}

export default function ContentEdit() {
    const { props } = usePage<PageProps>();
    const section = props.section;
    const settings = props.settings ?? {};
    const availableNews = props.availableNews ?? [];
    const albums = props.galleryAlbums ?? [];

    const [toastMessage, setToastMessage] = useState<string | null>(props.flash?.success ?? null);
    const [heroPreview, setHeroPreview] = useState<string | null>(props.hero_url ?? null);
    const [heroWarning, setHeroWarning] = useState<string | null>(null);

    const { data, setData, post: submitRequest, processing, errors, reset, transform } = useForm<FormValues>({
        section,
        heroFile: null,
        heroAlt: settings.hero?.alt ?? '',
        hero: {
            title: settings.hero?.title ?? DEFAULT_HERO.title,
            subtitle: settings.hero?.subtitle ?? DEFAULT_HERO.subtitle,
            cta1_label: settings.hero?.cta1_label ?? DEFAULT_HERO.cta1_label,
            cta1_url: settings.hero?.cta1_url ?? DEFAULT_HERO.cta1_url,
            cta2_label: settings.hero?.cta2_label ?? DEFAULT_HERO.cta2_label,
            cta2_url: settings.hero?.cta2_url ?? DEFAULT_HERO.cta2_url,
            overlay: settings.hero?.overlay ?? DEFAULT_HERO.overlay,
        },
        highlights: buildHighlights(settings.highlights),
        showHighlights: settings.showHighlights ?? true,
        newsMode: settings.newsMode ?? 'auto',
        pins: settings.pins ?? [],
        agendaLimit: settings.agendaLimit ?? 3,
        galleryMode: settings.galleryMode ?? 'album',
        galleryAlbumId: settings.galleryAlbumId ? String(settings.galleryAlbumId) : '',
        galleryManual: settings.galleryManual?.join(', ') ?? '',
        stats: {
            students: settings.stats?.students != null ? String(settings.stats.students) : '',
            teachers: settings.stats?.teachers != null ? String(settings.stats.teachers) : '',
            accreditation: settings.stats?.accreditation ?? '',
            photos: settings.stats?.photos != null ? String(settings.stats.photos) : '',
        },
        showStats: settings.showStats ?? true,
        testimonials: buildTestimonials(settings.testimonials),
        showTestimonials: settings.showTestimonials ?? true,
    });

    const actionUrl = props.updateUrl ?? `/admin/content/${section}`;

    useEffect(() => {
        if (props.flash?.success) {
            setToastMessage(props.flash.success);
            const timeout = setTimeout(() => setToastMessage(null), 3500);
            return () => clearTimeout(timeout);
        }

        return undefined;
    }, [props.flash?.success]);

    useEffect(
        () => () => {
            if (heroPreview && heroPreview.startsWith('blob:')) {
                URL.revokeObjectURL(heroPreview);
            }
        },
        [heroPreview],
    );

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const handleHeroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setData('heroFile', file);

        if (!file) {
            if (heroPreview && heroPreview.startsWith('blob:')) {
                URL.revokeObjectURL(heroPreview);
            }
            setHeroPreview(props.hero_url ?? null);
            setHeroWarning(null);
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setHeroPreview(previewUrl);

        const image = new Image();
        image.onload = () => {
            if (image.width < 1600 || image.height < 900) {
                setHeroWarning('Resolusi hero minimal 1600x900 piksel. Unggah ulang untuk hasil terbaik.');
            } else {
                setHeroWarning(null);
            }
        };
        image.src = previewUrl;
    };

    const updateHighlight = (index: number, key: keyof Highlight, value: string) => {
        const next = [...data.highlights];
        next[index] = { ...next[index], [key]: value };
        setData('highlights', next);
    };

    const addTestimonial = () => {
        setData('testimonials', [...data.testimonials, { name: '', role: '', quote: '' }]);
    };

    const updateTestimonial = (index: number, key: keyof Testimonial, value: string) => {
        const next = [...data.testimonials];
        next[index] = { ...next[index], [key]: value };
        setData('testimonials', next);
    };

    const removeTestimonial = (index: number) => {
        const next = data.testimonials.filter((_, idx) => idx !== index);
        setData('testimonials', next.length > 0 ? next : [{ name: '', role: '', quote: '' }]);
    };

    const togglePin = (id: number) => {
        if (data.pins.includes(id)) {
            setData('pins', data.pins.filter((pin) => pin !== id));
        } else {
            setData('pins', [...data.pins, id]);
        }
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        transform((current) => {
            const payload: Record<string, unknown> = {
                section: current.section,
                hero: current.hero,
                hero_alt: current.heroAlt,
                showHighlights: current.showHighlights,
                highlights: current.highlights,
                newsMode: current.newsMode,
                pins: current.pins,
                agendaLimit: current.agendaLimit,
                galleryMode: current.galleryMode,
                galleryAlbumId: current.galleryAlbumId || null,
                galleryManual: current.galleryManual
                    .split(',')
                    .map((entry) => entry.trim())
                    .filter(Boolean)
                    .map((entry) => Number(entry)),
                stats: {
                    students: current.stats.students ? Number(current.stats.students) : null,
                    teachers: current.stats.teachers ? Number(current.stats.teachers) : null,
                    accreditation: current.stats.accreditation,
                    photos: current.stats.photos ? Number(current.stats.photos) : null,
                },
                showStats: current.showStats,
                testimonials: current.testimonials,
                showTestimonials: current.showTestimonials,
            };

            if (current.heroFile) {
                payload.hero_media = current.heroFile;
            }

            return payload;
        });

        submitRequest(actionUrl, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                showToast('Konten berhasil disimpan.');
                if (!data.heroFile) {
                    return;
                }
                reset('heroFile');
            },
            onFinish: () => {
                transform((formData) => formData);
            },
        });
    };

    const isHome = section === 'home';

    return (
        <AdminLayout title={`Pengaturan Konten: ${section === 'home' ? 'Beranda' : section === 'profil' ? 'Profil' : 'Visi & Misi'}`}>
            <form onSubmit={submit} className="mx-auto flex w-full max-w-5xl flex-col gap-6" encType="multipart/form-data">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-4 flex flex-col gap-2">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Hero Section</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Unggah hero berdimensi 16:9 minimal 1600x900 dan atur teks serta CTA.</p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-[minmax(0,320px)_1fr]">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="hero">Gambar Hero</label>
                            <input
                                id="hero"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleHeroChange}
                                className="block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:file:bg-slate-700"
                            />
                            {heroWarning ? <p className="text-xs text-amber-500">{heroWarning}</p> : null}
                            {errors.hero_media ? <p className="text-xs text-rose-500">{errors.hero_media}</p> : null}
                            <input
                                value={data.heroAlt}
                                onChange={(event) => setData('heroAlt', event.target.value)}
                                placeholder="Teks alternatif hero"
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            {errors.hero_alt ? <p className="text-xs text-rose-500">{errors.hero_alt}</p> : null}
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Overlay</label>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={data.hero.overlay}
                                onChange={(event) => setData('hero', { ...data.hero, overlay: Number(event.target.value) })}
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400">Overlay: {data.hero.overlay}%</p>
                        </div>
                        <div className="space-y-4">
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-900">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Pratinjau Hero</p>
                                <div className="mt-3 h-48 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
                                    {heroPreview ? (
                                        <img src={heroPreview} alt="Hero preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">Belum ada gambar hero.</div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <input
                                    value={data.hero.title}
                                    onChange={(event) => setData('hero', { ...data.hero, title: event.target.value })}
                                    placeholder="Judul hero"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                                <textarea
                                    value={data.hero.subtitle}
                                    onChange={(event) => setData('hero', { ...data.hero, subtitle: event.target.value })}
                                    rows={3}
                                    placeholder="Subjudul hero"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <input
                                            value={data.hero.cta1_label}
                                            onChange={(event) => setData('hero', { ...data.hero, cta1_label: event.target.value })}
                                            placeholder="Label CTA 1"
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                        />
                                        <input
                                            value={data.hero.cta1_url}
                                            onChange={(event) => setData('hero', { ...data.hero, cta1_url: event.target.value })}
                                            placeholder="https://..."
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <input
                                            value={data.hero.cta2_label}
                                            onChange={(event) => setData('hero', { ...data.hero, cta2_label: event.target.value })}
                                            placeholder="Label CTA 2"
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                        />
                                        <input
                                            value={data.hero.cta2_url}
                                            onChange={(event) => setData('hero', { ...data.hero, cta2_url: event.target.value })}
                                            placeholder="https://..."
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {isHome ? (
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <div className="mb-4 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Sorotan &amp; Statistik</h2>
                                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={data.showHighlights}
                                        onChange={(event) => setData('showHighlights', event.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                                    />
                                    Tampilkan sorotan
                                </label>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Isi sorotan utama untuk menjelaskan keunggulan sekolah secara singkat.</p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {data.highlights.map((highlight, index) => (
                                <div key={`highlight-${index}`} className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-900">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Sorotan {index + 1}</h3>
                                        <span className="text-xs text-slate-400">Icon library (mis. lucide)</span>
                                    </div>
                                    <input
                                        value={highlight.icon}
                                        onChange={(event) => updateHighlight(index, 'icon', event.target.value)}
                                        placeholder="Nama ikon"
                                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    />
                                    <input
                                        value={highlight.title}
                                        onChange={(event) => updateHighlight(index, 'title', event.target.value)}
                                        placeholder="Judul singkat"
                                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    />
                                    <textarea
                                        value={highlight.description}
                                        onChange={(event) => updateHighlight(index, 'description', event.target.value)}
                                        rows={3}
                                        placeholder="Deskripsi singkat"
                                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    />
                                    <input
                                        value={highlight.link}
                                        onChange={(event) => updateHighlight(index, 'link', event.target.value)}
                                        placeholder="https://..."
                                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-900">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Statistik</h3>
                                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={data.showStats}
                                        onChange={(event) => setData('showStats', event.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                                    />
                                    Tampilkan statistik
                                </label>
                            </div>
                            <div className="grid gap-3 md:grid-cols-4">
                                <input
                                    value={data.stats.students}
                                    onChange={(event) => setData('stats', { ...data.stats, students: event.target.value })}
                                    placeholder="Siswa"
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                                <input
                                    value={data.stats.teachers}
                                    onChange={(event) => setData('stats', { ...data.stats, teachers: event.target.value })}
                                    placeholder="Guru"
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                                <input
                                    value={data.stats.accreditation}
                                    onChange={(event) => setData('stats', { ...data.stats, accreditation: event.target.value })}
                                    placeholder="Akreditasi"
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                                <input
                                    value={data.stats.photos}
                                    onChange={(event) => setData('stats', { ...data.stats, photos: event.target.value })}
                                    placeholder="Dokumentasi"
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-900">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Berita Sorotan</h3>
                                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={data.newsMode === 'manual'}
                                        onChange={(event) => setData('newsMode', event.target.checked ? 'manual' : 'auto')}
                                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                                    />
                                    Gunakan pilihan manual
                                </label>
                            </div>
                            {data.newsMode === 'manual' ? (
                                <div className="grid gap-2">
                                    {availableNews.length === 0 ? (
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Belum ada berita untuk dipilih.</p>
                                    ) : (
                                        availableNews.map((news) => (
                                            <label key={news.id} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                                                <input
                                                    type="checkbox"
                                                    checked={data.pins.includes(news.id)}
                                                    onChange={() => togglePin(news.id)}
                                                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                                                />
                                                {news.title}
                                            </label>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-500 dark:text-slate-400">Mode otomatis akan menampilkan berita terbaru secara dinamis.</p>
                            )}
                        </div>

                        <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-900">
                            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Agenda &amp; Galeri</h3>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-300">Jumlah agenda yang tampil</label>
                            <input
                                type="number"
                                min={1}
                                value={data.agendaLimit}
                                onChange={(event) => setData('agendaLimit', Number(event.target.value) || 1)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            <div className="grid gap-2">
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-300">Sumber galeri</label>
                                <select
                                    value={data.galleryMode}
                                    onChange={(event) => setData('galleryMode', event.target.value as 'album' | 'manual')}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                >
                                    <option value="album">Gunakan album</option>
                                    <option value="manual">Manual (ID media)</option>
                                </select>
                            </div>
                            {data.galleryMode === 'album' ? (
                                <select
                                    value={data.galleryAlbumId}
                                    onChange={(event) => setData('galleryAlbumId', event.target.value)}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                >
                                    <option value="">Pilih album</option>
                                    {albums.map((album) => (
                                        <option key={album.id} value={album.id}>
                                            {album.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <textarea
                                    value={data.galleryManual}
                                    onChange={(event) => setData('galleryManual', event.target.value)}
                                    rows={3}
                                    placeholder="Masukkan ID media dipisahkan koma"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                            )}
                        </div>

                        <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-900">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Testimoni</h3>
                                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={data.showTestimonials}
                                        onChange={(event) => setData('showTestimonials', event.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                                    />
                                    Tampilkan testimoni
                                </label>
                            </div>
                            <div className="space-y-3">
                                {data.testimonials.map((testimonial, index) => (
                                    <div key={`testimonial-${index}`} className="grid gap-2 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-600 dark:bg-slate-800">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Testimoni {index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => removeTestimonial(index)}
                                                className="text-xs font-semibold text-rose-500 hover:text-rose-400"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                        <input
                                            value={testimonial.name}
                                            onChange={(event) => updateTestimonial(index, 'name', event.target.value)}
                                            placeholder="Nama narasumber"
                                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                        />
                                        <input
                                            value={testimonial.role}
                                            onChange={(event) => updateTestimonial(index, 'role', event.target.value)}
                                            placeholder="Peran/relasi"
                                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                        />
                                        <textarea
                                            value={testimonial.quote}
                                            onChange={(event) => updateTestimonial(index, 'quote', event.target.value)}
                                            rows={3}
                                            placeholder="Isi testimoni"
                                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                        />
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addTestimonial}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200"
                            >
                                Tambah Testimoni
                            </button>
                        </div>
                    </section>
                ) : null}

                <div className="flex items-center justify-end gap-2">
                    <a
                        href="/admin/pages"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    >
                        Batal
                    </a>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </form>
            {toastMessage ? <Toast message={toastMessage} /> : null}
        </AdminLayout>
    );
}
