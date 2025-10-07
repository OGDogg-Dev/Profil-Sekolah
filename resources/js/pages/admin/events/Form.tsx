import { useEffect, useMemo, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';

type EventStatus = 'draft' | 'scheduled' | 'published' | 'archived';
type EventRecurrence = 'once' | 'weekly' | 'monthly';

type EventResource = {
    id?: number;
    title?: string;
    slug?: string | null;
    description?: string | null;
    location?: string | null;
    timezone?: string | null;
    start_at?: string | null;
    end_at?: string | null;
    recurrence?: EventRecurrence | null;
    registration_url?: string | null;
    cover_url?: string | null;
    cover_alt?: string | null;
    status?: EventStatus | null;
};

type PageProps = {
    errors?: Record<string, string>;
    flash?: { success?: string };
};

type FormValues = {
    title: string;
    slug: string;
    description: string;
    location: string;
    timezone: string;
    start_at: string;
    end_at: string;
    recurrence: EventRecurrence;
    registration_url: string;
    status: EventStatus;
    cover: File | null;
    cover_alt: string;
    removeCover: boolean;
};

const STATUS_OPTIONS: Array<{ value: EventStatus; label: string }> = [
    { value: 'draft', label: 'Draft' },
    { value: 'scheduled', label: 'Terjadwal' },
    { value: 'published', label: 'Terbit' },
    { value: 'archived', label: 'Arsip' },
];

const RECURRENCE_OPTIONS: Array<{ value: EventRecurrence; label: string }> = [
    { value: 'once', label: 'Sekali' },
    { value: 'weekly', label: 'Mingguan' },
    { value: 'monthly', label: 'Bulanan' },
];

function Toast({ message }: { message: string }) {
    return (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl dark:bg-emerald-500">
            {message}
        </div>
    );
}

interface EventFormProps {
    event?: EventResource;
}

export default function EventForm({ event }: EventFormProps) {
    const isEdit = Boolean(event?.id);
    const { props } = usePage<PageProps>();
    const [coverPreview, setCoverPreview] = useState<string | null>(event?.cover_url ?? null);
    const [toastMessage, setToastMessage] = useState<string | null>(props.flash?.success ?? null);

    const { data, setData, post: submitRequest, processing, errors, reset, transform } = useForm<FormValues>({
        title: event?.title ?? '',
        slug: event?.slug ?? '',
        description: event?.description ?? '',
        location: event?.location ?? '',
        timezone: event?.timezone ?? 'Asia/Jakarta',
        start_at: event?.start_at ? event.start_at.slice(0, 16) : '',
        end_at: event?.end_at ? event.end_at.slice(0, 16) : '',
        recurrence: event?.recurrence ?? 'once',
        registration_url: event?.registration_url ?? '',
        status: event?.status ?? 'draft',
        cover: null,
        cover_alt: event?.cover_alt ?? '',
        removeCover: false,
    });

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
        if (!data.cover && !data.removeCover) {
            setCoverPreview(event?.cover_url ?? null);
        }
    }, [event?.cover_url, data.cover, data.removeCover]);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('cover', file);
        setData('removeCover', false);

        if (coverPreview && coverPreview.startsWith('blob:')) {
            URL.revokeObjectURL(coverPreview);
        }

        setCoverPreview(file ? URL.createObjectURL(file) : (event as any)?.cover_url ?? null);
    };

    const handleRemoveCover = () => {
        if (coverPreview && coverPreview.startsWith('blob:')) {
            URL.revokeObjectURL(coverPreview);
        }

        setCoverPreview(null);
        setData('cover', null);
        setData('cover_alt', '');
        setData('removeCover', true);
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        transform((current) => {
            const payload: Record<string, unknown> = {
                ...current,
                start_at: current.start_at ? new Date(current.start_at).toISOString() : null,
                end_at: current.end_at ? new Date(current.end_at).toISOString() : null,
            };

            if (!current.cover) {
                delete payload.cover;
            }

            delete payload.removeCover;

            if (current.removeCover) {
                payload.remove_cover = 1;
            }

            if (isEdit && event?.id) {
                payload._method = 'put';
            }

            return payload;
        });

        submitRequest(isEdit && event?.id ? `/admin/events/${event.id}` : '/admin/events', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                showToast(isEdit ? 'Agenda diperbarui.' : 'Agenda dibuat.');
                if (data.removeCover) {
                    setData('removeCover', false);
                }

                if (!isEdit) {
                    reset();
                    setCoverPreview(null);
                }
            },
            onFinish: () => {
                transform((formData) => formData);
            },
        });
    };

    const icsHref = useMemo(() => {
        if (!event?.id) {
            return null;
        }

        return `/events/${event.id}/ics`;
    }, [event?.id]);

    return (
        <AdminLayout title={isEdit ? 'Edit Agenda' : 'Tambah Agenda'}>
            <form onSubmit={submit} className="mx-auto flex w-full max-w-3xl flex-col gap-6" encType="multipart/form-data">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-6 flex flex-col gap-2">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Informasi Agenda</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Atur judul, jadwal, dan lokasi agenda publik sekolah.</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Judul Agenda</label>
                            <input
                                value={data.title}
                                onChange={(event) => setData('title', event.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                required
                            />
                            {errors.title ? <p className="mt-1 text-xs text-rose-500">{errors.title}</p> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Slug</label>
                            <input
                                value={data.slug}
                                onChange={(event) => setData('slug', event.target.value)}
                                placeholder="agenda-inklusif"
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            {errors.slug ? <p className="mt-1 text-xs text-rose-500">{errors.slug}</p> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Zona Waktu</label>
                            <input
                                value={data.timezone}
                                onChange={(event) => setData('timezone', event.target.value)}
                                placeholder="Asia/Jakarta"
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            {errors.timezone ? <p className="mt-1 text-xs text-rose-500">{errors.timezone}</p> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                            <select
                                value={data.status}
                                onChange={(event) => setData('status', event.target.value as EventStatus)}
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
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Mulai</label>
                            <input
                                type="datetime-local"
                                value={data.start_at}
                                onChange={(event) => setData('start_at', event.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                required
                            />
                            {errors.start_at ? <p className="mt-1 text-xs text-rose-500">{errors.start_at}</p> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Selesai</label>
                            <input
                                type="datetime-local"
                                value={data.end_at}
                                onChange={(event) => setData('end_at', event.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            {errors.end_at ? <p className="mt-1 text-xs text-rose-500">{errors.end_at}</p> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Lokasi</label>
                            <input
                                value={data.location}
                                onChange={(event) => setData('location', event.target.value)}
                                placeholder="Aula inklusi sekolah"
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            {errors.location ? <p className="mt-1 text-xs text-rose-500">{errors.location}</p> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Frekuensi</label>
                            <select
                                value={data.recurrence}
                                onChange={(event) => setData('recurrence', event.target.value as EventRecurrence)}
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            >
                                {RECURRENCE_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.recurrence ? <p className="mt-1 text-xs text-rose-500">{errors.recurrence}</p> : null}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">URL Pendaftaran</label>
                            <input
                                value={data.registration_url}
                                onChange={(event) => setData('registration_url', event.target.value)}
                                placeholder="https://..."
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            {errors.registration_url ? <p className="mt-1 text-xs text-rose-500">{errors.registration_url}</p> : null}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Deskripsi</label>
                            <textarea
                                value={data.description}
                                onChange={(event) => setData('description', event.target.value)}
                                rows={8}
                                className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            {errors.description ? <p className="mt-1 text-xs text-rose-500">{errors.description}</p> : null}
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Cover Agenda</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Unggah cover 16:9 minimal 1200x675 piksel untuk memperkuat narasi agenda.</p>
                        </div>
                        {icsHref ? (
                            <a
                                href={icsHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-white"
                            >
                                Unduh ICS
                            </a>
                        ) : null}
                    </div>
                    <div className="grid gap-4 md:grid-cols-[minmax(0,320px)_1fr]">
                        <div className="flex flex-col gap-3">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="cover">
                                Pilih berkas cover
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
                                placeholder="Deskripsi singkat gambar"
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            {errors.cover_alt ? <p className="text-xs text-rose-500">{errors.cover_alt}</p> : null}
                            {(coverPreview || event?.cover_url) && !data.removeCover ? (
                                <button
                                    type="button"
                                    onClick={handleRemoveCover}
                                    className="inline-flex items-center justify-center rounded-lg border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-900/40"
                                    disabled={processing}
                                >
                                    Hapus Cover
                                </button>
                            ) : null}
                        </div>
                        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-900">
                            {coverPreview ? (
                                <img src={coverPreview} alt="Preview cover agenda" className="h-48 w-full rounded-xl object-cover" />
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada pratinjau cover.</p>
                            )}
                        </div>
                    </div>
                </section>

                <div className="flex items-center justify-end gap-2">
                    <a
                        href="/admin/events"
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
