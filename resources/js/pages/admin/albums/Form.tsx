import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/_layout/AdminLayout';

interface AlbumFormProps {
    album?: {
        id: number;
        title: string;
        slug: string;
        cover_url?: string | null;
        description?: string | null;
        media?: Array<{
            id: number;
            type: 'image' | 'video';
            url: string;
            caption?: string | null;
            poster?: string | null;
            track_vtt?: string | null;
            sort?: number;
        }>;
    };
}

export default function AlbumForm({ album }: AlbumFormProps) {
    const isEdit = Boolean(album?.id);
    const { props } = usePage();
    const errors = (props as any)?.errors as Record<string, string> | undefined;

    const [form, setForm] = useState({
        title: album?.title ?? '',
        slug: album?.slug ?? '',
        cover_url: album?.cover_url ?? '',
        description: album?.description ?? '',
    });
    const [mediaForm, setMediaForm] = useState({
        type: 'image' as 'image' | 'video',
        url: '',
        caption: '',
        poster: '',
        track_vtt: '',
        sort: '' as string | number,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { ...form };
        if (isEdit && album) {
            router.post(`/admin/albums/${album.id}`, { ...payload, _method: 'put' });
        } else {
            router.post('/admin/albums', payload);
        }
    };

    const addMedia = (e: React.FormEvent) => {
        e.preventDefault();
        if (!album) return;
        const payload = {
            ...mediaForm,
            sort: mediaForm.sort === '' ? 0 : Number(mediaForm.sort),
        };
        router.post(`/admin/albums/${album.id}/media`, payload, {
            preserveScroll: true,
            onSuccess: () => setMediaForm({ type: 'image', url: '', caption: '', poster: '', track_vtt: '', sort: '' }),
        });
    };

    const deleteMedia = (mediaId: number) => {
        if (!album) return;
        if (confirm('Hapus media ini?')) {
            router.delete(`/admin/albums/${album.id}/media/${mediaId}`, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Kelola Album' : 'Tambah Album'}>
            <form onSubmit={submit} className="grid max-w-3xl gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Judul</label>
                    <input
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        required
                    />
                    {errors?.title ? <p className="mt-1 text-xs text-rose-600">{errors.title}</p> : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Slug (opsional)</label>
                    <input
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                    {errors?.slug ? <p className="mt-1 text-xs text-rose-600">{errors.slug}</p> : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Cover URL</label>
                    <input
                        value={form.cover_url}
                        onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        placeholder="https://..."
                    />
                    {errors?.cover_url ? <p className="mt-1 text-xs text-rose-600">{errors.cover_url}</p> : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Deskripsi</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        rows={6}
                    />
                    {errors?.description ? <p className="mt-1 text-xs text-rose-600">{errors.description}</p> : null}
                </div>
                <div className="flex items-center justify-end gap-2">
                    <a
                        href="/admin/albums"
                        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                        Kembali
                    </a>
                    <button
                        type="submit"
                        className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        Simpan
                    </button>
                </div>
            </form>

            {album ? (
                <div className="mt-8 space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900">Tambah Media</h2>
                    <form onSubmit={addMedia} className="grid gap-3 rounded-2xl border bg-white p-4">
                        <div className="grid gap-3 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Tipe</label>
                                <select
                                    value={mediaForm.type}
                                    onChange={(e) => setMediaForm({ ...mediaForm, type: e.target.value as 'image' | 'video' })}
                                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                >
                                    <option value="image">Gambar</option>
                                    <option value="video">Video</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Urutan</label>
                                <input
                                    value={mediaForm.sort}
                                    onChange={(e) => setMediaForm({ ...mediaForm, sort: e.target.value })}
                                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                    type="number"
                                    min="0"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">URL</label>
                            <input
                                value={mediaForm.url}
                                onChange={(e) => setMediaForm({ ...mediaForm, url: e.target.value })}
                                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Caption</label>
                            <input
                                value={mediaForm.caption}
                                onChange={(e) => setMediaForm({ ...mediaForm, caption: e.target.value })}
                                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                            />
                        </div>
                        {mediaForm.type === 'video' ? (
                            <div className="grid gap-3 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Poster (opsional)</label>
                                    <input
                                        value={mediaForm.poster}
                                        onChange={(e) => setMediaForm({ ...mediaForm, poster: e.target.value })}
                                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Track VTT (opsional)</label>
                                    <input
                                        value={mediaForm.track_vtt}
                                        onChange={(e) => setMediaForm({ ...mediaForm, track_vtt: e.target.value })}
                                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                    />
                                </div>
                            </div>
                        ) : null}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                            >
                                Tambah Media
                            </button>
                        </div>
                    </form>

                    <div className="space-y-3">
                        <h3 className="text-base font-semibold text-slate-900">Daftar Media</h3>
                        {album.media?.length ? (
                            <div className="grid gap-3 md:grid-cols-2">
                                {album.media.map((media) => (
                                    <div key={media.id} className="rounded-xl border bg-white p-4">
                                        <p className="text-xs uppercase tracking-wide text-slate-500">{media.type.toUpperCase()}</p>
                                        <p className="mt-1 break-all text-sm font-medium text-slate-800">{media.url}</p>
                                        {media.caption ? (
                                            <p className="text-sm text-slate-600">{media.caption}</p>
                                        ) : null}
                                        <button
                                            type="button"
                                            onClick={() => deleteMedia(media.id)}
                                            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">Belum ada media pada album ini.</p>
                        )}
                    </div>
                </div>
            ) : null}
        </AdminLayout>
    );
}
