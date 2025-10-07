import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';

type MediaResource = {
    id: number;
    type: 'image' | 'video';
    url: string;
    caption?: string | null;
    sort?: number | null;
};

type AlbumResource = {
    id: number;
    title: string;
    slug: string;
    cover_url?: string | null;
    description?: string | null;
    media?: MediaResource[];
};

type PageProps = {
    flash?: { success?: string };
};

type AlbumFormValues = {
    title: string;
    slug: string;
    description: string;
    cover: File | null;
    removeCover: boolean;
};

type MediaFormValues = {
    file: File | null;
    caption: string;
    sort: string;
};

interface AlbumFormProps {
    album?: AlbumResource;
}

function Toast({ message }: { message: string }) {
    return (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">
            {message}
        </div>
    );
}

export default function AlbumForm({ album }: AlbumFormProps) {
    const isEdit = Boolean(album?.id);
    const { props } = usePage<PageProps>();
    const [toastMessage, setToastMessage] = useState<string | null>(props.flash?.success ?? null);
    const [coverPreview, setCoverPreview] = useState<string | null>(album?.cover_url ?? null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [mediaPreviewType, setMediaPreviewType] = useState<'image' | 'video' | null>(null);

    const {
        data: albumData,
        setData: setAlbumData,
        post: submitAlbumRequest,
        processing: albumProcessing,
        errors: albumErrors,
        reset: resetAlbum,
        transform: transformAlbum,
    } = useForm<AlbumFormValues>({
        title: album?.title ?? '',
        slug: album?.slug ?? '',
        description: album?.description ?? '',
        cover: null,
        removeCover: false,
    });

    const {
        data: mediaData,
        setData: setMediaData,
        post: submitMediaRequest,
        processing: mediaProcessing,
        errors: mediaErrors,
        reset: resetMedia,
        transform: transformMedia,
    } = useForm<MediaFormValues>({
        file: null,
        caption: '',
        sort: '',
    });

    const albumMedia = useMemo(() => album?.media ?? [], [album?.media]);

    useEffect(() => {
        if (props.flash?.success) {
            setToastMessage(props.flash.success);
            const timeout = setTimeout(() => setToastMessage(null), 3500);
            return () => clearTimeout(timeout);
        }

        return undefined;
    }, [props.flash?.success]);

    useEffect(() => () => {
        if (coverPreview && coverPreview.startsWith('blob:')) {
            URL.revokeObjectURL(coverPreview);
        }
    }, [coverPreview]);

    useEffect(() => () => {
        if (mediaPreview && mediaPreview.startsWith('blob:')) {
            URL.revokeObjectURL(mediaPreview);
        }
    }, [mediaPreview]);

    useEffect(() => {
        if (!albumData.cover && !albumData.removeCover) {
            setCoverPreview(album?.cover_url ?? null);
        }
    }, [album?.cover_url, albumData.cover, albumData.removeCover]);

    const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setAlbumData('cover', file);
        setAlbumData('removeCover', false);

        if (coverPreview && coverPreview.startsWith('blob:')) {
            URL.revokeObjectURL(coverPreview);
        }

        setCoverPreview(file ? URL.createObjectURL(file) : album?.cover_url ?? null);
    };

    const handleRemoveCover = () => {
        if (coverPreview && coverPreview.startsWith('blob:')) {
            URL.revokeObjectURL(coverPreview);
        }

        setCoverPreview(null);
        setAlbumData('cover', null);
        setAlbumData('removeCover', true);
    };

    const handleMediaFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setMediaData('file', file);

        if (mediaPreview && mediaPreview.startsWith('blob:')) {
            URL.revokeObjectURL(mediaPreview);
        }

        setMediaPreview(file ? URL.createObjectURL(file) : null);
        setMediaPreviewType(file ? (file.type.startsWith('video/') ? 'video' : 'image') : null);
    };

    const submitAlbum = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        transformAlbum((current) => {
            const payload: Record<string, unknown> = {
                title: current.title,
                slug: current.slug,
                description: current.description,
            };

            if (current.cover) {
                payload.cover = current.cover;
            }

            if (current.removeCover) {
                payload.remove_cover = 1;
            }

            if (isEdit && album?.id) {
                payload._method = 'put';
            }

            return payload;
        });

        submitAlbumRequest(isEdit && album?.id ? `/admin/albums/${album.id}` : '/admin/albums', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (!isEdit) {
                    resetAlbum();
                    setCoverPreview(null);
                } else {
                    setAlbumData('cover', null);
                    setAlbumData('removeCover', false);
                }
            },
            onFinish: () => {
                transformAlbum((formData) => formData);
            },
        });
    };

    const submitMedia = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!album?.id) {
            return;
        }

        transformMedia((current) => {
            const payload: Record<string, unknown> = {};

            if (current.file) {
                payload.file = current.file;
            }

            const trimmedCaption = current.caption.trim();
            if (trimmedCaption) {
                payload.caption = trimmedCaption;
            }

            if (current.sort !== '') {
                payload.sort = Number(current.sort);
            }

            return payload;
        });

        submitMediaRequest(`/admin/albums/${album.id}/media`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                resetMedia();
                setMediaPreview((prev) => {
                    if (prev && prev.startsWith('blob:')) {
                        URL.revokeObjectURL(prev);
                    }

                    return null;
                });
                setMediaPreviewType(null);
            },
            onFinish: () => {
                transformMedia((formData) => formData);
            },
        });
    };

    const deleteMedia = (mediaId: number) => {
        if (!album?.id) {
            return;
        }

        if (typeof window !== 'undefined' && !window.confirm('Hapus media ini?')) {
            return;
        }

        router.delete(`/admin/albums/${album.id}/media/${mediaId}`, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title={isEdit ? 'Kelola Album' : 'Tambah Album'}>
            {toastMessage ? <Toast message={toastMessage} /> : null}

            <form onSubmit={submitAlbum} className="grid max-w-3xl gap-4" encType="multipart/form-data">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Judul</label>
                    <input
                        value={albumData.title}
                        onChange={(event) => setAlbumData('title', event.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        required
                    />
                    {albumErrors.title ? <p className="mt-1 text-xs text-rose-600">{albumErrors.title}</p> : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Slug (opsional)</label>
                    <input
                        value={albumData.slug}
                        onChange={(event) => setAlbumData('slug', event.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                    {albumErrors.slug ? <p className="mt-1 text-xs text-rose-600">{albumErrors.slug}</p> : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Cover Album</label>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleCoverChange}
                        className="mt-1 block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                    {albumErrors.cover ? <p className="mt-1 text-xs text-rose-600">{albumErrors.cover}</p> : null}
                    {coverPreview ? (
                        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                            <img src={coverPreview} alt="Preview cover" className="h-48 w-full object-cover" />
                        </div>
                    ) : null}
                    {(coverPreview || album?.cover_url) && !albumData.removeCover ? (
                        <button
                            type="button"
                            onClick={handleRemoveCover}
                            className="mt-3 inline-flex items-center justify-center rounded-lg border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                            disabled={albumProcessing}
                        >
                            Hapus Cover
                        </button>
                    ) : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Deskripsi</label>
                    <textarea
                        value={albumData.description}
                        onChange={(event) => setAlbumData('description', event.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        rows={6}
                    />
                    {albumErrors.description ? <p className="mt-1 text-xs text-rose-600">{albumErrors.description}</p> : null}
                </div>
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href="/admin/albums"
                        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                        Kembali
                    </Link>
                    <button
                        type="submit"
                        className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={albumProcessing}
                    >
                        Simpan
                    </button>
                </div>
            </form>

            {isEdit ? (
                <div className="mt-8 space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900">Tambah Media</h2>
                    <form onSubmit={submitMedia} className="grid gap-3 rounded-2xl border bg-white p-4" encType="multipart/form-data">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Berkas Media</label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,video/mp4"
                                onChange={handleMediaFileChange}
                                className="mt-1 block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                            />
                            {mediaErrors.file ? <p className="mt-1 text-xs text-rose-600">{mediaErrors.file}</p> : null}
                            {mediaPreview ? (
                                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                                    {mediaPreviewType === 'video' ? (
                                        <video src={mediaPreview} className="h-48 w-full object-cover" controls />
                                    ) : (
                                        <img src={mediaPreview} alt="Preview media" className="h-48 w-full object-cover" />
                                    )}
                                </div>
                            ) : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Caption</label>
                            <input
                                value={mediaData.caption}
                                onChange={(event) => setMediaData('caption', event.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                            />
                            {mediaErrors.caption ? <p className="mt-1 text-xs text-rose-600">{mediaErrors.caption}</p> : null}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Urutan</label>
                            <input
                                value={mediaData.sort}
                                onChange={(event) => setMediaData('sort', event.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                type="number"
                                min="0"
                            />
                            {mediaErrors.sort ? <p className="mt-1 text-xs text-rose-600">{mediaErrors.sort}</p> : null}
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                                disabled={mediaProcessing}
                            >
                                Tambah Media
                            </button>
                        </div>
                    </form>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {albumMedia.map((item) => (
                            <div key={item.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="relative aspect-video overflow-hidden">
                                    {item.type === 'video' ? (
                                        <video src={item.url} className="h-full w-full object-cover" controls />
                                    ) : (
                                        <img src={item.url} alt={item.caption ?? 'Media album'} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col gap-2 p-4 text-sm text-slate-600">
                                    <p className="font-semibold text-slate-900">{item.caption ?? 'Tanpa caption'}</p>
                                    {typeof item.sort === 'number' ? <p className="text-xs text-slate-500">Urutan: {item.sort}</p> : null}
                                    <button
                                        type="button"
                                        onClick={() => deleteMedia(item.id)}
                                        className="mt-auto inline-flex items-center justify-center rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                                    >
                                        Hapus Media
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </AdminLayout>
    );
}
