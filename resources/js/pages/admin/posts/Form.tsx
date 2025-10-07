import { useEffect, useMemo, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';

interface PostResource {
    id?: number;
    title?: string;
    slug?: string | null;
    excerpt?: string | null;
    content?: string | null;
    cover_url?: string | null;
    cover_alt?: string | null;
    category?: string | null;
    tags?: string[] | null;
    sticky?: boolean | null;
    status?: 'draft' | 'scheduled' | 'published' | 'archived';
    published_at?: string | null;
    seo_title?: string | null;
    seo_description?: string | null;
    seo_keywords?: string | null;
}

interface PostFormProps {
    post?: PostResource;
}

type PageProps = {
    errors?: Record<string, string>;
    flash?: { success?: string };
    categories?: string[];
    tags?: string[];
};

type FormValues = {
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    category: string;
    tags: string[];
    sticky: boolean;
    status: 'draft' | 'scheduled' | 'published' | 'archived';
    published_at: string;
    cover: File | null;
    cover_alt: string;
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
};

const STATUS_OPTIONS: Array<{ value: FormValues['status']; label: string }> = [
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

export default function PostForm({ post }: PostFormProps) {
    const isEdit = Boolean(post?.id);
    const { props } = usePage<PageProps>();
    const categories = useMemo(() => props.categories ?? [], [props.categories]);
    const suggestedTags = useMemo(() => props.tags ?? [], [props.tags]);

    const [coverPreview, setCoverPreview] = useState<string | null>(post?.cover_url ?? null);
    const [toastMessage, setToastMessage] = useState<string | null>(props.flash?.success ?? null);
    const [tagInput, setTagInput] = useState('');

    const { data, setData, post: postForm, processing, errors, reset } = useForm<FormValues>({
        title: post?.title ?? '',
        slug: post?.slug ?? '',
        excerpt: post?.excerpt ?? '',
        body: post?.content ?? '',
        category: post?.category ?? '',
        tags: post?.tags ?? [],
        sticky: Boolean(post?.sticky ?? false),
        status: post?.status ?? 'draft',
        published_at: post?.published_at ? post.published_at.slice(0, 16) : '',
        cover: null,
        cover_alt: post?.cover_alt ?? '',
        seo_title: post?.seo_title ?? '',
        seo_description: post?.seo_description ?? '',
        seo_keywords: post?.seo_keywords ?? '',
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

    const addTagFromInput = () => {
        const value = tagInput.trim();

        if (!value) {
            return;
        }

        if (!data.tags.includes(value)) {
            setData('tags', [...data.tags, value]);
        }

        setTagInput('');
    };

    const removeTag = (tag: string) => {
        setData(
            'tags',
            data.tags.filter((item) => item !== tag),
        );
    };

    const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;

        setData('cover', file);

        if (coverPreview && coverPreview.startsWith('blob:')) {
            URL.revokeObjectURL(coverPreview);
        }

        setCoverPreview(file ? URL.createObjectURL(file) : post?.cover_url ?? null);
    };

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload: Record<string, unknown> = {
            ...data,
            sticky: data.sticky ? 1 : 0,
            tags: data.tags,
            published_at: data.published_at ? new Date(data.published_at).toISOString() : null,
        };

        if (!data.cover) {
            delete payload.cover;
        }

        if (!data.cover_alt) {
            payload.cover_alt = '';
        }

        if (!data.seo_keywords) {
            payload.seo_keywords = '';
        }

        if (isEdit && post?.id) {
            payload._method = 'put';
        }

        postForm(isEdit && post?.id ? `/admin/posts/${post.id}` : '/admin/posts', {
            data: payload,
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                showToast(isEdit ? 'Berita diperbarui.' : 'Berita dibuat.');

                if (!isEdit) {
                    reset();
                    setCoverPreview(null);
                }
            },
        });
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Berita' : 'Tambah Berita'}>
            <form onSubmit={submit} className="mx-auto flex w-full max-w-4xl flex-col gap-6" encType="multipart/form-data">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-6 flex flex-col gap-2">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Informasi Utama</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Tulis judul, slug, dan ringkasan untuk berita. Ringkasan membantu pembaca memahami konteks sebelum membaca konten lengkap.
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Judul</label>
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
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                placeholder="judul-berita-baru"
                            />
                            {errors.slug ? <p className="mt-1 text-xs text-rose-500">{errors.slug}</p> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Kategori</label>
                            <select
                                value={data.category}
                                onChange={(event) => setData('category', event.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            >
                                <option value="">Pilih kategori</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            {errors.category ? <p className="mt-1 text-xs text-rose-500">{errors.category}</p> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                            <select
                                value={data.status}
                                onChange={(event) => setData('status', event.target.value as FormValues['status'])}
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
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Jadwalkan Publikasi</label>
                            <input
                                type="datetime-local"
                                value={data.published_at}
                                onChange={(event) => setData('published_at', event.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            {errors.published_at ? <p className="mt-1 text-xs text-rose-500">{errors.published_at}</p> : null}
                        </div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 md:col-span-2">
                            <input
                                type="checkbox"
                                checked={data.sticky}
                                onChange={(event) => setData('sticky', event.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                            />
                            Jadikan berita sorotan utama
                        </label>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ringkasan (140-200 karakter)</label>
                            <textarea
                                value={data.excerpt}
                                onChange={(event) => setData('excerpt', event.target.value)}
                                rows={4}
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                <span>{data.excerpt.length} karakter</span>
                                {errors.excerpt ? <span className="text-rose-500">{errors.excerpt}</span> : null}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Cover Berita</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Unggah cover rasio 16:9 minimal 1200x675 piksel.</p>
                        </div>
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
                                placeholder="Teks alternatif untuk aksesibilitas"
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            {errors.cover_alt ? <p className="text-xs text-rose-500">{errors.cover_alt}</p> : null}
                        </div>
                        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-900">
                            {coverPreview ? (
                                <img src={coverPreview} alt="Preview cover" className="h-48 w-full rounded-xl object-cover" />
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada pratinjau cover.</p>
                            )}
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Isi Berita</h2>
                    <textarea
                        value={data.body}
                        onChange={(event) => setData('body', event.target.value)}
                        rows={14}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm leading-relaxed text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        placeholder="Tulis konten berita di sini."
                    />
                    {errors.body ? <p className="mt-1 text-xs text-rose-500">{errors.body}</p> : null}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-4 flex flex-col gap-2">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Tag &amp; Optimasi</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Gunakan tag untuk mengelompokkan berita dan optimalkan metadata untuk mesin pencari.
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tambahkan Tag</label>
                            <div className="mt-1 flex gap-2">
                                <input
                                    value={tagInput}
                                    onChange={(event) => setTagInput(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            event.preventDefault();
                                            addTagFromInput();
                                        }
                                    }}
                                    className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    placeholder="Tekan Enter untuk menambahkan"
                                />
                                <button
                                    type="button"
                                    onClick={addTagFromInput}
                                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
                                >
                                    Tambah
                                </button>
                            </div>
                            {errors.tags ? <p className="mt-1 text-xs text-rose-500">{errors.tags}</p> : null}
                            {data.tags.length > 0 ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {data.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-600 dark:text-white"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="text-slate-500 hover:text-rose-500"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            ) : null}
                            {suggestedTags.length > 0 ? (
                                <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                                    <p className="font-medium">Saran tag populer:</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {suggestedTags.map((tag) => (
                                            <button
                                                type="button"
                                                key={tag}
                                                onClick={() => {
                                                    if (!data.tags.includes(tag)) {
                                                        setData('tags', [...data.tags, tag]);
                                                    }
                                                }}
                                                className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:border-slate-500 dark:text-slate-300 dark:hover:bg-slate-700"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        <div className="space-y-4">
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
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Kata Kunci SEO</label>
                                <input
                                    value={data.seo_keywords}
                                    onChange={(event) => setData('seo_keywords', event.target.value)}
                                    placeholder="Pisahkan dengan koma"
                                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                                {errors.seo_keywords ? <p className="mt-1 text-xs text-rose-500">{errors.seo_keywords}</p> : null}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="flex items-center justify-end gap-2">
                    <a
                        href="/admin/posts"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    >
                        Batal
                    </a>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan' }
                    </button>
                </div>
            </form>
            {toastMessage ? <Toast message={toastMessage} /> : null}
        </AdminLayout>
    );
}
