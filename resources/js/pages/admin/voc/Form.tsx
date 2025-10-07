import { useEffect, useMemo, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';

type ProgramStatus = 'draft' | 'scheduled' | 'published' | 'archived';

type MediaResource = {
    id: number;
    url: string;
    alt?: string | null;
    type?: string | null;
};

type VocationalItem = {
    id?: number;
    slug?: string | null;
    title?: string | null;
    summary?: string | null;
    description?: string | null;
    audience?: string | null;
    duration?: string | null;
    schedule?: string | null;
    outcomes?: string[] | null;
    facilities?: string[] | null;
    mentors?: string[] | null;
    contact_person?: string | null;
    cta_url?: string | null;
    status?: ProgramStatus | null;
    published_at?: string | null;
    seo_title?: string | null;
    seo_description?: string | null;
    cover_url?: string | null;
    cover_alt?: string | null;
    media?: MediaResource[];
};

type PageProps = {
    errors?: Record<string, string>;
    flash?: { success?: string };
};

type FormValues = {
    slug: string;
    title: string;
    summary: string;
    description: string;
    audience: string;
    duration: string;
    schedule: string;
    kurikulum: string[];
    fasilitas: string[];
    contact_person: string;
    cta_url: string;
    status: ProgramStatus;
    published_at: string;
    seo_title: string;
    seo_description: string;
    cover: File | null;
    cover_alt: string;
    gallery: File[];
    gallery_alt: string[];
};

const STATUS_OPTIONS: Array<{ value: ProgramStatus; label: string }> = [
    { value: 'draft', label: 'Draft' },
    { value: 'scheduled', label: 'Terjadwal' },
    { value: 'published', label: 'Publikasi' },
    { value: 'archived', label: 'Arsip' },
];

function Toast({ message }: { message: string }) {
    return (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl dark:bg-emerald-500">
            {message}
        </div>
    );
}

type VocFormProps = {
    item?: VocationalItem;
};

const ensureArray = (value?: string[] | null): string[] => {
    if (!value || value.length === 0) {
        return [''];
    }

    return value;
};

export default function VocForm({ item }: VocFormProps) {
    const isEdit = Boolean(item?.id);
    const { props } = usePage<PageProps>();
    const [toastMessage, setToastMessage] = useState<string | null>(props.flash?.success ?? null);
    const [coverPreview, setCoverPreview] = useState<string | null>(item?.cover_url ?? null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    const { data, setData, post: submitRequest, processing, errors, reset, transform } = useForm<FormValues>({
        slug: item?.slug ?? '',
        title: item?.title ?? '',
        summary: item?.summary ?? '',
        description: item?.description ?? '',
        audience: item?.audience ?? '',
        duration: item?.duration ?? '',
        schedule: item?.schedule ?? '',
        kurikulum: ensureArray(item?.outcomes ?? null),
        fasilitas: ensureArray(item?.facilities ?? null),
        contact_person: item?.contact_person ?? '',
        cta_url: item?.cta_url ?? '',
        status: item?.status ?? 'draft',
        published_at: item?.published_at ? item.published_at.slice(0, 16) : '',
        seo_title: item?.seo_title ?? '',
        seo_description: item?.seo_description ?? '',
        cover: null,
        cover_alt: item?.cover_alt ?? '',
        gallery: [],
        gallery_alt: [],
    });

    const existingGallery = useMemo(() => item?.media ?? [], [item?.media]);

    useEffect(() => {
        if (props.flash?.success) {
            setToastMessage(props.flash.success);
            const timeout = setTimeout(() => setToastMessage(null), 3500);
            return () => clearTimeout(timeout);
        }

        return undefined;
    }, [props.flash?.success]);

    useEffect(() => {
        return () => {
            if (coverPreview && coverPreview.startsWith('blob:')) {
                URL.revokeObjectURL(coverPreview);
            }
        };
    }, [coverPreview]);

    useEffect(() => {
        return () => {
            galleryPreviews.forEach((url) => {
                if (url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [galleryPreviews]);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const updateArrayField = (field: 'kurikulum' | 'fasilitas', index: number, value: string) => {
        const next = [...data[field]];
        next[index] = value;
        setData(field, next);
    };

    const addArrayField = (field: 'kurikulum' | 'fasilitas') => {
        setData(field, [...data[field], '']);
    };

    const removeArrayField = (field: 'kurikulum' | 'fasilitas', index: number) => {
        const next = data[field].filter((_, idx) => idx != index);
        setData(field, next.length > 0 ? next : ['']);
    };

    const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setData('cover', file);

        if (coverPreview && coverPreview.startsWith('blob:')) {
            URL.revokeObjectURL(coverPreview);
        }

        setCoverPreview(file ? URL.createObjectURL(file) : item?.cover_url ?? null);
    };

    const handleGalleryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? Array.from(event.target.files) : [];

        setData('gallery', files);
        setData('gallery_alt', files.map((_, index) => data.gallery_alt[index] ?? ''));

        setGalleryPreviews((prev) => {
            prev.forEach((url) => {
                if (url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });

            return files.map((file) => URL.createObjectURL(file));
        });
    };

    const updateGalleryAlt = (index: number, value: string) => {
        const next = [...data.gallery_alt];
        next[index] = value;
        setData('gallery_alt', next);
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        transform((current) => {
            const trimmedKurikulum = current.kurikulum.map((entry) => entry.trim()).filter(Boolean);
            const trimmedFasilitas = current.fasilitas.map((entry) => entry.trim()).filter(Boolean);
            const galleryAlt = current.gallery_alt
                .slice(0, current.gallery.length)
                .map((entry) => entry.trim());

            const payload: Record<string, unknown> = {
                ...current,
                kurikulum: trimmedKurikulum,
                fasilitas: trimmedFasilitas,
                gallery_alt: galleryAlt,
                published_at: current.published_at ? new Date(current.published_at).toISOString() : null,
            };

            if (!current.cover) {
                delete payload.cover;
            }

            if (!current.gallery.length) {
                delete payload.gallery;
                delete payload.gallery_alt;
            }

            if (isEdit && item?.id) {
                payload._method = 'put';
            }

            return payload;
        });

        submitRequest(isEdit && item?.id ? `/admin/vocational-programs/${item.id}` : '/admin/vocational-programs', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                showToast(isEdit ? 'Program diperbarui.' : 'Program dibuat.');

                if (!isEdit) {
                    reset();
                    setCoverPreview(null);
                    setGalleryPreviews((prev) => {
                        prev.forEach((url) => {
                            if (url.startsWith('blob:')) {
                                URL.revokeObjectURL(url);
                            }
                        });

                        return [];
                    });
                }
            },
            onFinish: () => {
                transform((formData) => formData);
            },
        });
    };

    return (
        <AdminLayout title={`${isEdit ? 'Edit' : 'Tambah'} Program Vokasional`}>
            <form onSubmit={submit} className="mx-auto flex w-full max-w-5xl flex-col gap-6" encType="multipart/form-data">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-6 flex flex-col gap-2">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Identitas Program</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Slug dan judul akan muncul di URL publik. Tambahkan ringkasan singkat untuk memperkenalkan program.
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Slug</label>
                            <input
                                value={data.slug}
                                onChange={(event) => setData('slug', event.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                placeholder="program-teknologi-asistif"
                                required
                            />
                            {errors.slug ? <p className="mt-1 text-xs text-rose-500">{errors.slug}</p> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Judul Program</label>
                            <input
                                value={data.title}
                                onChange={(event) => setData('title', event.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                required
                            />
                            {errors.title ? <p className="mt-1 text-xs text-rose-500">{errors.title}</p> : null}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ringkasan</label>
                            <textarea
                                value={data.summary}
                                onChange={(event) => setData('summary', event.target.value)}
                                rows={3}
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                placeholder="Gambarkan manfaat utama program secara singkat."
                            />
                            {errors.summary ? <p className="mt-1 text-xs text-rose-500">{errors.summary}</p> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Target Peserta</label>
                            <input
                                value={data.audience}
                                onChange={(event) => setData('audience', event.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            {errors.audience ? <p className="mt-1 text-xs text-rose-500">{errors.audience}</p> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Durasi</label>
                            <input
                                value={data.duration}
                                onChange={(event) => setData('duration', event.target.value)}
                                placeholder="12 pertemuan"
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            {errors.duration ? <p className="mt-1 text-xs text-rose-500">{errors.duration}</p> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Jadwal</label>
                            <input
                                value={data.schedule}
                                onChange={(event) => setData('schedule', event.target.value)}
                                placeholder="Setiap Sabtu 09.00"
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            {errors.schedule ? <p className="mt-1 text-xs text-rose-500">{errors.schedule}</p> : null}
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-4 flex flex-col gap-2">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Kurikulum &amp; Fasilitas</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Rinci kompetensi utama dan fasilitas pendukung agar calon peserta memahami pengalaman belajar yang ditawarkan.</p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Kurikulum</h3>
                                <button
                                    type="button"
                                    onClick={() => addArrayField('kurikulum')}
                                    className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200"
                                >
                                    Tambah Baris
                                </button>
                            </div>
                            <div className="mt-3 space-y-3">
                                {data.kurikulum.map((value, index) => (
                                    <div key={`kurikulum-${index}`} className="flex gap-2">
                                        <input
                                            value={value}
                                            onChange={(event) => updateArrayField('kurikulum', index, event.target.value)}
                                            className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                            placeholder={`Kompetensi ${index + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayField('kurikulum', index)}
                                            className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300"
                                            aria-label="Hapus kurikulum"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {errors.kurikulum ? <p className="mt-2 text-xs text-rose-500">{errors.kurikulum}</p> : null}
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Fasilitas</h3>
                                <button
                                    type="button"
                                    onClick={() => addArrayField('fasilitas')}
                                    className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200"
                                >
                                    Tambah Baris
                                </button>
                            </div>
                            <div className="mt-3 space-y-3">
                                {data.fasilitas.map((value, index) => (
                                    <div key={`fasilitas-${index}`} className="flex gap-2">
                                        <input
                                            value={value}
                                            onChange={(event) => updateArrayField('fasilitas', index, event.target.value)}
                                            className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                            placeholder={`Fasilitas ${index + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayField('fasilitas', index)}
                                            className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300"
                                            aria-label="Hapus fasilitas"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {errors.fasilitas ? <p className="mt-2 text-xs text-rose-500">{errors.fasilitas}</p> : null}
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-4 flex flex-col gap-2">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Media Program</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Unggah cover utama dan galeri pendukung. Pastikan teks alternatif diisi untuk aksesibilitas.</p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-[minmax(0,280px)_1fr]">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="cover">
                                Cover Program
                            </label>
                            <input
                                id="cover"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleCoverChange}
                                className="block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:file:bg-slate-700"
                            />
                            {errors.cover ? <p className="text-xs text-rose-500">{errors.cover}</p> : null}
                            <input
                                value={data.cover_alt}
                                onChange={(event) => setData('cover_alt', event.target.value)}
                                placeholder="Deskripsi cover"
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            {errors.cover_alt ? <p className="text-xs text-rose-500">{errors.cover_alt}</p> : null}
                            <div className="pt-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="gallery">
                                    Galeri (gambar/video)
                                </label>
                                <input
                                    id="gallery"
                                    type="file"
                                    multiple
                                    accept="image/jpeg,image/png,image/webp,video/mp4"
                                    onChange={handleGalleryChange}
                                    className="mt-1 block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:file:bg-slate-700"
                                />
                                {errors.gallery ? <p className="text-xs text-rose-500">{errors.gallery}</p> : null}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-900">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">Pratinjau Cover</p>
                                <div className="mt-3 h-48 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
                                    {coverPreview ? (
                                        <img src={coverPreview} alt="Preview cover" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                                            Belum ada pratinjau cover.
                                        </div>
                                    )}
                                </div>
                            </div>
                            {galleryPreviews.length > 0 ? (
                                <div className="space-y-4">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">Galeri Baru</p>
                                    {galleryPreviews.map((preview, index) => {
                                        const galleryFieldKey = `gallery_alt.${index}`;
                                        const galleryFieldError = (errors as Record<string, string | undefined>)[galleryFieldKey];

                                        return (
                                            <div key={`gallery-preview-${index}`} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-600 dark:bg-slate-800">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-20 w-32 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-900">
                                                        <img src={preview} alt={`Pratinjau galeri ${index + 1}`} className="h-full w-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-300">Teks alternatif</label>
                                                    <input
                                                        value={data.gallery_alt[index] ?? ''}
                                                        onChange={(event) => updateGalleryAlt(index, event.target.value)}
                                                        required
                                                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                            {galleryFieldError ? <p className="text-xs text-rose-500">{galleryFieldError}</p> : null}
                                        </div>
                                        );
                                    })}
                                </div>
                            ) : null}
                            {existingGallery.length > 0 ? (
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">Galeri Saat Ini</p>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {existingGallery.map((media) => (
                                            <figure key={media.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-600 dark:bg-slate-800">
                                                <img src={media.url} alt={media.alt ?? ''} className="h-32 w-full object-cover" />
                                                <figcaption className="px-3 py-2 text-xs text-slate-500 dark:text-slate-300">{media.alt ?? 'Tanpa deskripsi'}</figcaption>
                                            </figure>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-4 flex flex-col gap-2">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Kontak &amp; Penerbitan</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Atur kontak penanggung jawab, tautan pendaftaran, status publikasi, dan metadata SEO.</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Kontak Person</label>
                            <input
                                value={data.contact_person}
                                onChange={(event) => setData('contact_person', event.target.value)}
                                placeholder="Nama & nomor yang dapat dihubungi"
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            {errors.contact_person ? <p className="mt-1 text-xs text-rose-500">{errors.contact_person}</p> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">CTA URL</label>
                            <input
                                value={data.cta_url}
                                onChange={(event) => setData('cta_url', event.target.value)}
                                placeholder="https://..."
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            {errors.cta_url ? <p className="mt-1 text-xs text-rose-500">{errors.cta_url}</p> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                            <select
                                value={data.status}
                                onChange={(event) => setData('status', event.target.value as ProgramStatus)}
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            >
                                {STATUS_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.status ? <p className="mt-1 text-xs text-rose-500">{errors.status}</p> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Jadwal Publikasi</label>
                            <input
                                type="datetime-local"
                                value={data.published_at}
                                onChange={(event) => setData('published_at', event.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            {errors.published_at ? <p className="mt-1 text-xs text-rose-500">{errors.published_at}</p> : null}
                        </div>
                        <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Judul SEO</label>
                                <input
                                    value={data.seo_title}
                                    onChange={(event) => setData('seo_title', event.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                                {errors.seo_title ? <p className="mt-1 text-xs text-rose-500">{errors.seo_title}</p> : null}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Deskripsi SEO</label>
                                <textarea
                                    value={data.seo_description}
                                    onChange={(event) => setData('seo_description', event.target.value)}
                                    rows={3}
                                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                                {errors.seo_description ? <p className="mt-1 text-xs text-rose-500">{errors.seo_description}</p> : null}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Deskripsi Lengkap</label>
                            <textarea
                                value={data.description}
                                onChange={(event) => setData('description', event.target.value)}
                                rows={10}
                                className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                placeholder="Detail lengkap kurikulum, metode, dan dukungan program."
                            />
                            {errors.description ? <p className="mt-1 text-xs text-rose-500">{errors.description}</p> : null}
                        </div>
                    </div>
                </section>

                <div className="flex items-center justify-end gap-2">
                    <a
                        href="/admin/vocational-programs"
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
